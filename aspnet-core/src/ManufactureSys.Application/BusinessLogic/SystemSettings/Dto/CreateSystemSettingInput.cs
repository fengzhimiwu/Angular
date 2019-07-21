using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.SystemSettings.Dto
{
    [AutoMapTo(typeof(SystemSetting))]
    public class CreateSystemSettingInput
    {
        [Required]
        public string Key { set; get; }
        [Required]
        public string Value { set; get; }
        public string Description { get; set; }
    }
}