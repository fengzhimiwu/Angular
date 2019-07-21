using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.SubProjects.Dto
{
    [AutoMapTo(typeof(SubProject))]  
    public class CreateSubProjectInput
    {

        public Guid ProjectId { get; set; }
        [DefaultValue(null)]
        public Guid? BimModelFileItemId { get; set; }
        public Guid? ProcedureId { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        [NotMapped]
        public int?[] BimModelIds { get; set; }
        [DefaultValue(0)]
        [NotMapped]
        public int NumCreating { get; set; }

        [DefaultValue(1)]
        [NotMapped]
        public int StartNum { get; set; }
    }
}
