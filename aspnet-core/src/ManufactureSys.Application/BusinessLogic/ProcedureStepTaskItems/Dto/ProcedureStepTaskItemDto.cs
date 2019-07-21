using System;
using System.ComponentModel;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto
{
    [AutoMapFrom(typeof(ProcedureStepTaskItem))]
    public class ProcedureStepTaskItemDto: EntityDto<Guid>
    {
        public virtual Guid ProcedureStepId { get; set; }
        public virtual ProcedureStepDto ProcedureStep { get; set; }
        public virtual Guid TaskItemId { get; set; }
        public virtual TaskItemDto TaskItem{ get; set; }
        [DefaultValue(0)]
        public virtual int SortId { get; set; }
    }
}