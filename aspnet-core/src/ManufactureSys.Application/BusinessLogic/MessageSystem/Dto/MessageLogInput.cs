using System;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.MessageSystem.Dto
{
    [AutoMapTo(typeof(MessageLog))]
    public class MessageLogInput
    {
        public long? CreatorUserId { get; set; }
        public long ReceiverUserId { get; set; }
        public string Content { get; set; }
        public Guid? FileItemId { get; set; }
        /// <summary>
        /// 特殊消息，跳转消息，链接Url
        /// </summary>
        public string LinkUrl { get; set; }
    }
}