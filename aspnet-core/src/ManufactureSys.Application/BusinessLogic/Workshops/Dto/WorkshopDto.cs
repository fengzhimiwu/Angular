using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.WorkshopArrangements;

namespace ManufactureSys.BusinessLogic.Workshops.Dto
{
    [AutoMap(typeof(Workshop))]
    public class WorkshopDto: EntityDto<Guid>
    {
        public Guid? SubProjectId { get; set; }
        public Guid WorkshopTypeId { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public virtual bool IsActive { get; set; }
    }
}