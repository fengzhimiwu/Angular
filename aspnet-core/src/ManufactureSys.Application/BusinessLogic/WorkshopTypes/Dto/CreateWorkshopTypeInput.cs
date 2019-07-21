using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.WorkshopArrangements;
using ManufactureSys.BusinessLogic.Workshops;

namespace ManufactureSys.BusinessLogic.WorkshopTypes.Dto
{
    [AutoMapTo(typeof(WorkshopType))]
    public class CreateWorkshopTypeInput
    {
        public string Name { get; set; }
        public string FlowLine { get; set; }
    }
}