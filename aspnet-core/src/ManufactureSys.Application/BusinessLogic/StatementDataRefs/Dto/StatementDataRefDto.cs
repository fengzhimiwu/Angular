using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.Statements;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.StatementDataRefs.Dto
{
    [AutoMapFrom(typeof(StatementDataRef))]
    public class StatementDataRefDto: EntityDto<Guid>
    {
        public Guid FileItemId { get; set; }
        public FileItem FileItem { get; set; }
        public Guid ProcedureStepTaskItemId { get; set; }
        public ProcedureStepTaskItemDto ProcedureStepTaskItem { get; set; }
    }
}