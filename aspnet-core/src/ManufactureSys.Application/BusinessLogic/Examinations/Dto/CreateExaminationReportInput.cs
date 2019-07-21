using System;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.Examinations.Dto
{
    [AutoMapTo(typeof(ExaminationReport))]
    public class CreateExaminationReportInput
    {
        public Guid InventoryId { get; set; }
        public string Code { get; set; }
        /// <summary>
        /// 送检数量
        /// </summary>
        public int SampleAmount { get; set; }
        /// <summary>
        /// 批次
        /// </summary>
        public int BatchNum { get; set; }
        public long UserId { get; set; }
        /// <summary>
        /// 描述与检验结果
        /// </summary>
        public string Description { get; set; }
    }
}