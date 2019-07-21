using System;
using System.ComponentModel.DataAnnotations;

namespace ManufactureSys.BusinessLogic.Statements.Dto
{
    public class PreviewStatementInput
    {
        public Guid FileItemId { get; set; }
        public Guid SubProjectId { get; set; }
        [Required]
        public string TaskFormData { get; set; }
    }
}