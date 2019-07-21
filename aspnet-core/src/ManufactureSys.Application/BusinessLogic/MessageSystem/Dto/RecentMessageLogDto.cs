using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.Users.Dto;

namespace ManufactureSys.BusinessLogic.MessageSystem.Dto
{
    [AutoMapFrom(typeof(RecentMessageLog))]
    public class RecentMessageLogDto: EntityDto<Guid>
    {
        public long? CreatorUserId { get; set; }
        public long ReceiverUserId { get; set; }
        public UserDto ReceiverUser { get; set; }
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
        public int NumMessagesUnRead { get; set; }
    }
}