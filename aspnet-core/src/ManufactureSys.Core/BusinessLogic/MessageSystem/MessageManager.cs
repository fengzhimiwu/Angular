using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.MessageSystem
{
    public class MessageManager : ManufactureSysDomainServiceBase<MessageLog, Guid>
    {
        private readonly IRepository<RecentMessageLog, Guid> _repositoryRecentMessageLog;

        public MessageManager(IRepository<MessageLog, Guid> repository,
            IRepository<RecentMessageLog, Guid> repositoryRecentMessageLog) : base(repository)
        {
            _repositoryRecentMessageLog = repositoryRecentMessageLog;
        }
        /// <summary>
        /// 获取所有消息记录，并读取消息
        /// </summary>
        /// <param name="receiverId"></param>
        /// <param name="creatorId"></param>
        /// <returns></returns>
        public async Task<IQueryable<MessageLog>> GetAllMessages(long receiverId, long? creatorId)
        {
            // 通过创建时间倒序排列
            var query = Repository.GetAll().ReturnPointMessages(receiverId, creatorId)
                .OrderByDescending(v => v.CreationTime);
            // 读信息，表示已经读了
            await ReadMessage(receiverId, creatorId);
            return query;
        }

        /// <summary>
        /// 获取只和自己有关的最近消息记录
        /// </summary>
        /// <param name="creatorId"></param>
        /// <returns></returns>
        public IQueryable<RecentMessageLog> GetAllRecentMessageUsers(long? creatorId)
        {
            return _repositoryRecentMessageLog.GetAll().Where(v => v.CreatorUserId == creatorId)
                .OrderByDescending(v => v.LastMessageTime).Include(v => v.ReceiverUser);
        }

        /// <summary>
        /// hub dispatch发送消息操作
        /// </summary>
        /// <param name="messageLog"></param>
        /// <returns></returns>
        public async Task<MessageLog> SendMessage(MessageLog messageLog)
        {
            // 发送任息，当发送人和接收人不同才发送
            if (messageLog.ReceiverUserId == messageLog.CreatorUserId) return null;
            // 检查登陆情况
            if (!messageLog.CreatorUserId.HasValue) throw new UserFriendlyException("请登陆后操作");
            // 创建或更新最近消息列表，点对点 发送者的最近消息
            var mine = await _repositoryRecentMessageLog.ReturnPointMessage(messageLog.ReceiverUserId,
                    messageLog.CreatorUserId);
            if (mine != null)
            {
                mine.CreatorUserId = messageLog.CreatorUserId;
                mine.ReceiverUserId = messageLog.ReceiverUserId;
                mine.LastMessageTime = DateTime.Now;
                mine.LastMessageContent = messageLog.Content;
                mine.NumMessagesUnRead = 0;
                await _repositoryRecentMessageLog.UpdateAsync(mine);
            }
            else
            {
                mine = new RecentMessageLog
                {
                    CreatorUserId = messageLog.CreatorUserId,
                    ReceiverUserId = messageLog.ReceiverUserId,
                    LastMessageTime = DateTime.Now,
                    LastMessageContent = messageLog.Content,
                    TenantId = messageLog.TenantId
                };
                await _repositoryRecentMessageLog.InsertAsync(mine);
            }            
            // 创建或更新接收者的最近消息列表
            var other = await _repositoryRecentMessageLog.ReturnPointMessage((long)messageLog.CreatorUserId,
                messageLog.ReceiverUserId);
            if (other != null)
            {
                other.CreatorUserId = messageLog.ReceiverUserId;
                other.ReceiverUserId = (long)messageLog.CreatorUserId;
                other.LastMessageTime = DateTime.Now;
                other.LastMessageContent = messageLog.Content;
                other.NumMessagesUnRead += 1;
                await _repositoryRecentMessageLog.UpdateAsync(other);
            }
            else
            {
                other = new RecentMessageLog
                {
                    CreatorUserId = messageLog.ReceiverUserId,
                    ReceiverUserId = (long)messageLog.CreatorUserId,
                    LastMessageTime = DateTime.Now,
                    LastMessageContent = messageLog.Content,
                    NumMessagesUnRead = 1,
                    TenantId = messageLog.TenantId
                };
                await _repositoryRecentMessageLog.InsertAsync(other);
            }

            return await Repository.InsertAsync(messageLog);
        }

        /// <summary>
        /// hub dispatch在线读消息操作
        /// </summary>
        /// <param name="receiverId"></param>
        /// <param name="creatorId"></param>
        /// <returns></returns>
        public async Task ReadMessage(long receiverId, long? creatorId)
        {
            var recentMessageLog = await _repositoryRecentMessageLog.ReturnPointMessage(receiverId, creatorId);
            if (recentMessageLog != null)
            {
                recentMessageLog.NumMessagesUnRead = 0;
                _repositoryRecentMessageLog.Update(recentMessageLog);
            }
        }
    }

    /// <summary>
    /// 扩展方法实验
    /// </summary>
    public static class MessageHelper
    {
        /// <summary>
        /// 消息记录的扩展方法
        /// </summary>
        /// <param name="query"></param>
        /// <param name="receiverId"></param>
        /// <param name="creatorId"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static IQueryable<T> ReturnPointMessages<T>(this IQueryable<T> query, long receiverId, long? creatorId)
            where T : IMessageLogBase
        {
            return query.Where(v =>
                v.ReceiverUserId == receiverId && v.CreatorUserId == creatorId ||
                v.ReceiverUserId == creatorId && v.CreatorUserId == receiverId);
        }
        /// <summary>
        /// 最近消息的扩展方法
        /// </summary>
        /// <param name="r"></param>
        /// <param name="receiverId"></param>
        /// <param name="creatorId"></param>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TP"></typeparam>
        /// <returns></returns>
        public static async Task<T> ReturnPointMessage<T, TP>(this IRepository<T, TP> r, long receiverId, long? creatorId)
            where T : class, IEntity<TP>, IMessageLogBase
        {
            return await r.FirstOrDefaultAsync(v => 
                v.ReceiverUserId == receiverId && v.CreatorUserId == creatorId);
        }
    }
}