using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.ProcedureSteps.Dto
{
    [AutoMap(typeof(ProcedureStep))]
    public class ProcedureStepDto : EntityDto<Guid>
    {
        public Guid ProcedureId { get; set; }
        public string Name { get; set; }

        /// <summary> 
        /// 关于该工序的操作说明文字 --- 帮助系统
        /// </summary>
        public string Description { get; set; }

        [DefaultValue(1)]
        public int Priority { get; set; }
        public int NumTaskItems { get; set; }
        public decimal Duration { get; set; }
    }
}
