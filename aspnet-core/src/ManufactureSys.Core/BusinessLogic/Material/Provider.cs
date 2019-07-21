using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.Material
{
    public class Provider: FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        /// <summary>
        /// 供应商名字
        /// </summary>
        public string ProviderName { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Category { get; set; }
        /// <summary>
        /// 单位
        /// </summary>
        public string Unit { get; set; }
        /// <summary>
        /// 规格
        /// </summary>
        public string Spec { get; set; }
        /// <summary>
        /// 样本率
        /// </summary>
        public float SampleRate { get; set; }
    }
}