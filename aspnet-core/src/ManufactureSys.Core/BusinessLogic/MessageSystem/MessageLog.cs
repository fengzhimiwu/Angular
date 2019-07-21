using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.MessageSystem
{
    /// <summary>
    /// 消息记录
    /// </summary>
    public class MessageLog: CreationAuditedEntity<Guid>, IMessageLogBase, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        /// <summary>
        /// 接收者
        /// </summary>
        public long ReceiverUserId { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 文件Id
        /// </summary>
        public Guid? FileItemId { get; set; }
        public bool IsRead { get; set; }
        /// <summary>
        /// 特殊消息，跳转消息，链接Url
        /// </summary>
        public string LinkUrl { get; set; }
    }
}