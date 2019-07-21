using System;
using System.ComponentModel;
using System.Linq;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.WorkshopArrangements
{
    /// <summary>
    /// 预留 --- 自定义 台座布局表， 可灵活定义 生产线上的台座，  代表每一条生产线
    /// </summary>
    public class WorkshopArrangement: FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        /// <summary>
        /// 一个布局，多个生产线
        /// </summary>
        public Guid LayoutWorkshopId { get; set; }
        public string Image { get; set; }
        public string FlowLine { get; set; }
    }
}