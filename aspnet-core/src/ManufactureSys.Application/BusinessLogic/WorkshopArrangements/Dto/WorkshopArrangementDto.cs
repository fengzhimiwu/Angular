using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.BusinessLogic.Workshops.Dto;

namespace ManufactureSys.BusinessLogic.WorkshopArrangements.Dto
{
    [AutoMap(typeof(WorkshopArrangement))]
    public class WorkshopArrangementDto: EntityDto<Guid>
    {
        public Guid LayoutWorkshopId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string[] FlowLines { get; set; }
        public WorkshopDto[][] FlowLineLayouts { get; set; }
    }
}