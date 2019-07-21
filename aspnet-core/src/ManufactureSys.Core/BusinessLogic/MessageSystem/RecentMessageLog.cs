using System;
using System.ComponentModel;
using Abp.Domain.Entities;
using ManufactureSys.Authorization.Users;

namespace ManufactureSys.BusinessLogic.MessageSystem
{
    public class RecentMessageLog: Entity<Guid>, IMessageLogBase, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        public long? CreatorUserId { get; set; }
        public long ReceiverUserId { get; set; }
        public User ReceiverUser { get; set; }
        /// <summary>
        /// 最后发送Id
        /// </summary>
        public DateTime LastMessageTime { get; set; }
        /// <summary>
        /// 最后发送的内容
        /// </summary>
        public string LastMessageContent { get; set; }
        /// <summary>
        /// 未读消息数量
        /// </summary>
        [DefaultValue(1)]
        public int NumMessagesUnRead { get; set; }
    }
}