using System;
using System.ComponentModel;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Providers.Dto;

namespace ManufactureSys.BusinessLogic.Inventories.Dto
{
    [AutoMap(typeof(Inventory))]
    public class InventoryDto: EntityDto<Guid>
    {
        public Guid ProviderId { get; set; }
        public ProviderDto Provider { get; set; }
        public string Code { get; set; }
        /// <summary>
        /// 进库量
        /// </summary>
        public float Amount { get; set; }
        /// <summary>
        /// 批次
        /// </summary>
        public float BatchNum { get; set; }
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