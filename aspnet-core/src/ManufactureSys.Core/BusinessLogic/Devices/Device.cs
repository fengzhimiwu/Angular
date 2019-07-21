using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.Devices
{
    public class Device: Entity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        /// <summary>
        /// 设备名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// 设备类别
        /// </summary>
        public string Category { get; set; }
        /// <summary>
        /// 使用单位
        /// </summary>
        public string Unit { get; set; }
        /// <summary>
        /// 剩余使用次数
        /// </summary>
        public int AvailableTimes { get; set; }
        /// <summary>
        /// 报警值
        /// </summary>
        public int WarningTimes { get; set; }
    }
}