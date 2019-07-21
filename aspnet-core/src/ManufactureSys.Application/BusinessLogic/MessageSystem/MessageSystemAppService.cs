using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using ManufactureSys.BusinessLogic.MessageSystem.Dto;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.MessageSystem
{
    /// <summary>
    /// 无需权限 消息系统接口
    /// </summary>
    public class MessageSystemAppService : ManufactureSysAppServiceBase
    {
        private readonly ProjectManager _projectManager;
        private readonly MessageManager _messageManager;
        private readonly IRepository<RecentMessageLog, Guid> _repositoryRecentMessageLog;

        public MessageSystemAppService(ProjectManager projectManager, MessageManager messageManager, IRepository<RecentMessageLog, Guid> repositoryRecentMessageLog)
        {
            _projectManager = projectManager;
            _messageManager = messageManager;
            _repositoryRecentMessageLog = repositoryRecentMessageLog;
        }
        /// <summary>
        /// 获取消息个数
        /// </summary>
        /// <returns></returns>
        public async Task<int> GetMessageNum()
        {
            return await _repositoryRecentMessageLog.GetAll()
                .Where(log => log.CreatorUserId == GetSessionUserId())
                .SumAsync(log => log.NumMessagesUnRead);
        }
        /// <summary>
        /// 取得所有点对点的消息，做了分页处理
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<MessageLogDto>> GetAll(GetAllMessageLogInput input)
        {
            var query = await _messageManager.GetAllMessages(input.ReceiverId, GetSessionUserId());
            return await GetAllPagedByQueryFilter<MessageLogDto, MessageLog, Guid>(query, input);
        }
        /// <summary>
        /// 获取所有项目中的用户
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<UserDto>> GetAllUserInProject(Guid projectId)
        {
            var query = _projectManager.GetAllMemberInProject(projectId).Where(v => v.Id != GetSessionUserId());
            return new PagedResultDto<UserDto>
            {
                TotalCount = await query.CountAsync(),
                Items = await query.Select(v => v.MapTo<UserDto>()).ToListAsync()
            };
        }
        /// <summary>
        /// 获取最近消息列表
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<RecentMessageLogDto>> GetAllRecentMessageUsers()
        {
            var query = _messageManager.GetAllRecentMessageUsers(GetSessionUserId());
            return new PagedResultDto<RecentMessageLogDto>
            {
                TotalCount = await query.CountAsync(),
                Items = await query.Select(v => v.MapTo<RecentMessageLogDto>()).ToListAsync()
            };
        }
        /// <summary>
        /// 删除一条最近消息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task DeleteRecentMessage(EntityDto<Guid> input)
        {
            await _repositoryRecentMessageLog.DeleteAsync(input.Id);
        }
    }
}