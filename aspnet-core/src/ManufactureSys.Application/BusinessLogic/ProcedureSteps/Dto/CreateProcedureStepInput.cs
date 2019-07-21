using System;
using System.Collections.Generic;
using System.ComponentModel;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.ProcedureSteps.Dto
{
    [AutoMapTo(typeof(ProcedureStep))]  
    public class CreateProcedureStepInput
    {
        public Guid? ProcedureId { get; set; }
        public string Name { get; set; }
        [DefaultValue(1)]
        public int Priority { get; set; }
        public decimal Duration { get; set; }
        public string Description { get; set; }
    }
}
