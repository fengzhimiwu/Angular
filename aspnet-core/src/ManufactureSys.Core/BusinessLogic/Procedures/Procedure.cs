using System;
using System.ComponentModel;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.Procedures
{
    /// <summary>
    /// 工序模板实体 --- 定义多种 工序模板  
    /// 每种模板中，工序不同，一批梁选择 A 工序模板；另外一批梁选择 B 工序模板
    /// </summary>
    public class Procedure: FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public virtual int? TenantId { get; set; }
        public virtual string Name { get; set; }
        public virtual string Description { get; set; }

        /// <summary>
        /// 工序模板 总的耗时 （单位：天）
        /// </summary>
        [DefaultValue(0)]
        public virtual decimal TotalDuration { get; set; }
        /// <summary>
        /// 工序模板中，包含多个工序流程， 此属性，保存最后的优先级值
        /// </summary>
        public virtual int? LastPriority { get; set; }
        /// <summary>
        /// 判断是否为日常工序模板
        /// </summary>
        [DefaultValue(false)]
        public bool IsRoutine { get; set; }
    }
}