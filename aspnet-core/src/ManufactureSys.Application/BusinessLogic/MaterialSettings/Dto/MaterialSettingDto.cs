using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Material;
using ManufactureSys.BusinessLogic.Providers;

namespace ManufactureSys.BusinessLogic.MaterialSettings.Dto
{
    [AutoMap(typeof(MaterialSetting))]
    public class MaterialSettingDto: EntityDto<Guid>
    {
        [Required]
        public string Key { set; get; }
        [Required]
        public string Value { set; get; }
        public string Description { get; set; }
    }
}