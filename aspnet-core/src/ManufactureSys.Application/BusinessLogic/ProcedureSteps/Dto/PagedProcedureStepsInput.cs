using System;
using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.ProcedureSteps.Dto
{
    public class PagedProcedureStepsInput
    {
        public virtual Guid ProcedureId { get; set; }
    }
}