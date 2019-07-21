using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.SystemSettings.Dto
{
    [AutoMap(typeof(SystemSetting))]
    public class SystemSettingDto: EntityDto<Guid>
    {
        [Required]
        public string Key { set; get; }
        [Required]
        public string Value { set; get; }
        public string Description { get; set; }
    }
}