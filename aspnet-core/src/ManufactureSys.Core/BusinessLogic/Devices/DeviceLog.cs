using System;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.Devices
{
    public class DeviceLog: CreationAuditedEntity<Guid>
    {
        public Guid DeviceId { get; set; }
        public Device Device { get; set; }
        /// <summary>
        /// 剩余使用次数
        /// </summary>
        public int AvailableTimes { get; set; }
        // 使用者 CreatorUser
        // 使用时间 CreationTime
    }
}