using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Material;
using ManufactureSys.BusinessLogic.Providers;

namespace ManufactureSys.BusinessLogic.MaterialSettings.Dto
{
    [AutoMapTo(typeof(MaterialSetting))]
    public class CreateMaterialSettingInput
    {
        [Required]
        public string Key { set; get; }
        [Required]
        public string Value { set; get; }
        public string Description { get; set; }
    }
}