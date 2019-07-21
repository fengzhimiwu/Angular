using System;
using System.ComponentModel;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Material;

namespace ManufactureSys.BusinessLogic.Inventories
{
    public class Inventory: FullAuditedEntity<Guid>
    {
        public Guid ProviderId { get; set; }
        public Provider Provider { get; set; }
        /// <summary>
        /// 存库号
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 进库量
        /// </summary>
        public float Amount { get; set; }
        /// <summary>
        /// 批次
        /// </summary>
        [DefaultValue(0)]
        public int BatchNum { get; set; }
        /// <summary>
        /// 样本总量
        /// </summary>
        public float SampleTotal { get; set; }
        /// <summary>
        /// 检验过的样本
        /// </summary>
        [DefaultValue(0)]
        public float CheckedSample { get; set; }
        /// <summary>
        /// 是否签收
        /// </summary>
        [DefaultValue(false)]
        public bool IsArrival { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// 进货人
        /// </summary>
        public User CreatorUser { get; set; }
        /// <summary>
        /// 签收人
        /// </summary>
        public User LastModifierUser { get; set; }
        // 进货时间 CreationTime
        // 签收时间 LastModificationTime
    }
}