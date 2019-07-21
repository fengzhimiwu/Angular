using System;

namespace ManufactureSys.BusinessLogic.Statements.Dto
{
    public class GenerateStatementInput
    {
        public Guid FileItemId { get; set; }
        public Guid SubProjectId { get; set; }
    }
}