using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Auditing;
using Abp.AutoMapper;
using Abp.Dependency;
using Abp.RealTime;
using Abp.Runtime.Session;
using Abp.UI;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.MessageSystem.Dto;
using Microsoft.AspNetCore.SignalR;

namespace ManufactureSys.Controllers
{
    public class MessageHub : AbpHubBase, ITransientDependency
    {
        // 存储了当前连接上的用户
        private static readonly ConcurrentDictionary<string, IOnlineClient> UserClients = new ConcurrentDictionary<string, IOnlineClient>();
        private readonly UserManager _userManager;
        private readonly MessageManager _messageManager;
        private readonly IClientInfoProvider _clientInfoProvider;

        public MessageHub(UserManager userManager,
            MessageManager messageManager, IClientInfoProvider clientInfoProvider
            )
        {
            _userManager = userManager;
            _messageManager = messageManager;
            _clientInfoProvider = clientInfoProvider;
            AbpSession = NullAbpSession.Instance;
        }
        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<MessageLogDto> SendMessage(MessageLogInput input)
        {
            // 获取消息接收者
            var receiver = await _userManager.GetUserByIdAsync(input.ReceiverUserId);
            try
            {
                var entity = input.MapTo<MessageLog>();
                // 添加租户Id
                entity.TenantId = AbpSession.TenantId;
                var message = await _messageManager.SendMessage(entity);
                // 获取当前在线用户
                var clients = UserClients.Values
                    .Where(c => (c.UserId == receiver.Id && c.TenantId == receiver.TenantId));
                var dto = message.MapTo<MessageLogDto>();
                foreach (var client in clients)
                {
                    await Clients.Client(client.ConnectionId).SendAsync("getMessage", dto);
                }
                return dto;
            }
            catch (UserFriendlyException ex)
            {
                Logger.Warn("Could not send chat message to user: " + input.ReceiverUserId);
                Logger.Warn(ex.ToString(), ex);
                return null;
            }
        }
        /// <summary>
        /// 读消息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task ReadMessage(MessageLogInput input)
        {
            await _messageManager.ReadMessage(input.ReceiverUserId, input.CreatorUserId);
        }

        // 注册，连接，断开连接，获取IP的四个通用方法
        public void Register()
        {
            Logger.Debug("A client is registered: " + Context.ConnectionId);
        }
        
        public override async Task OnConnectedAsync()
        {
            if (!AbpSession.UserId.HasValue) throw new UserFriendlyException(L("UserNotLoggedIn"));
            var client = new OnlineClient(
                Context.ConnectionId,
                GetIpAddressOfClient(),
                AbpSession.TenantId,
                (long)AbpSession.UserId
            );

            Logger.Debug("A client is connected: " + client);

            UserClients[client.ConnectionId] = client;
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Logger.Debug("A client is disconnected: " + Context.ConnectionId);

            try
            {
                UserClients.TryRemove(Context.ConnectionId, out var client);
            }
            catch (Exception ex)
            {
                Logger.Warn(ex.ToString(), ex);
            }
            await base.OnDisconnectedAsync(exception);
        }

        protected virtual string GetIpAddressOfClient()
        {
            try
            {
                return _clientInfoProvider.ClientIpAddress;
            }
            catch (Exception ex)
            {
                Logger.Error("Can not find IP address of the client! connectionId: " + Context.ConnectionId);
                Logger.Error(ex.Message, ex);
                return "";
            }
        }
    }
}