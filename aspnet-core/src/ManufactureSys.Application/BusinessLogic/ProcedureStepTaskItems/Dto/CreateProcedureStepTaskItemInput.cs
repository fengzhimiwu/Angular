using System;

namespace ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto
{
    public class CreateProcedureStepTaskItemInput
    {
        public Guid TaskItemId { get; set; }
        public Guid ProcedureStepId { get; set; }
    }
}