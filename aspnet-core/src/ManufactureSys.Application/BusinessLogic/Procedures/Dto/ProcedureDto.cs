using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.Procedures.Dto
{
    [AutoMapTo(typeof(Procedure)), AutoMapFrom(typeof(Procedure))]
    public class ProcedureDto: EntityDto<Guid>
    {
        public string Name { get; set; }
               
        public string Description { get; set; }

        /// <summary>
        /// 工序模板 总的耗时 （单位：天）
        /// </summary>
        public decimal TotalDuration { get; set; }
        /// <summary>
        /// 工序模板中，包含多个工序流程， 此属性，保存最后的优先级值
        /// </summary>
        public int? LastPriority { get; set; }

    }
}