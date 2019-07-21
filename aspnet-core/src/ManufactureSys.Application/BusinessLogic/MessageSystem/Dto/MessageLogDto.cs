using System;
using System.ComponentModel;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.TaskItemAssignments.Dto;

namespace ManufactureSys.BusinessLogic.MessageSystem.Dto
{
    [AutoMapFrom(typeof(MessageLog))]
    public class MessageLogDto: EntityDto<Guid>
    {
        public long? CreatorUserId { get; set; }
        public long ReceiverUserId { get; set; }
        public string Content { get; set; }
        public Guid? FileItemId { get; set; }
        public bool IsRead { get; set; }
        /// <summary>
        /// 特殊消息，跳转消息，链接Url
        /// </summary>
        public string LinkUrl { get; set; }
    }
}