using System;
using System.ComponentModel;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.Inventories.Dto
{
    [AutoMapTo(typeof(Inventory))]
    public class CreateInventoryInput
    {
        public Guid ProviderId { get; set; }
        public string Code { get; set; }
        /// <summary>
        /// 进库量
        /// </summary>
        public float Amount { get; set; }
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
        public string Description { get; set; }
    }
}