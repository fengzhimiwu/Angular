using System;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Statements;

namespace ManufactureSys.BusinessLogic.StatementDataRefs.Dto
{
    [AutoMapTo(typeof(StatementDataRef))]
    public class CreateStatementDataRefInput
    {
        public Guid FileItemId { get; set; }
        public Guid ProcedureStepTaskItemId { get; set; }
    }
}