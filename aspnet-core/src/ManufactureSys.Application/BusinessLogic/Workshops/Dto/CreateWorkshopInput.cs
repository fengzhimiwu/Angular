using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.Workshops.Dto
{
    [AutoMapTo(typeof(Workshop)), AutoMapFrom(typeof(Workshop))]
    public class CreateWorkshopInput
    {
        public virtual Guid WorkshopTypeId { get; set; }
        public virtual string Name { get; set; }
        public string Position { get; set; }
        [NotMapped]
        [DefaultValue(0)]
        public int NumCreating { get; set; }
    }
}