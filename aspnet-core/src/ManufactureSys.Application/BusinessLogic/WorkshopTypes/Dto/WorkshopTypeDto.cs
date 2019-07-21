using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.WorkshopArrangements;
using ManufactureSys.BusinessLogic.Workshops;

namespace ManufactureSys.BusinessLogic.WorkshopTypes.Dto
{
    [AutoMap(typeof(WorkshopType))]
    public class WorkshopTypeDto: EntityDto<Guid>
    {
        public virtual string Name { get; set; }
        public string Color { get; set; }
        public int OrderId { get; set; }
    }
}