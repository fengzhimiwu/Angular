using Abp.Domain.Entities;

namespace ManufactureSys.BusinessLogic.MessageSystem
{
    public interface IMessageLogBase
    {
        /// <summary>
        /// 系统消息是没有creatorUserId的
        /// </summary>
        long? CreatorUserId { get; set; }
        long ReceiverUserId { get; set; }
    }
}