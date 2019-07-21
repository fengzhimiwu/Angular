using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Material;

namespace ManufactureSys.BusinessLogic.Providers.Dto
{
    [AutoMapTo(typeof(Provider))]
    public class CreateProviderInput
    {
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