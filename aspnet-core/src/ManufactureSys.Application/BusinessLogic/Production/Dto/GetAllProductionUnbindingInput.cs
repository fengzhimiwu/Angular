using System.ComponentModel;

namespace ManufactureSys.BusinessLogic.Production.Dto
{
    public class GetAllProductionUnbindingInput: GetAllProductionBase
    {
        [DefaultValue(true)]
        public bool IsFinished { get; set; }
    }
}