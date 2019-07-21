using System;
using System.Collections.Generic;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.BusinessLogic.Workshops.Dto;

namespace ManufactureSys.BusinessLogic.WorkshopArrangements.Dto
{
    [AutoMapTo(typeof(WorkshopArrangement))]
    public class CreateWorkshopArrangementInput
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string[] FlowLines { get; set; }
        public WorkshopDto[][] FlowLineLayouts { get; set; }
    }
}