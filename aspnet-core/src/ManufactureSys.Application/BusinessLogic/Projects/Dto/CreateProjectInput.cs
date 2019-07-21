using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Runtime.Validation;
//using ManufactureSys.Entities;

namespace ManufactureSys.BusinessLogic.Projects.Dto
{
    [AutoMapTo(typeof(Project))]
    public class CreateProjectInput
    {
        [Required(ErrorMessage = "ProjectName must have a value")]
        [StringLength(200, ErrorMessage = "string over maximum length")]
        public string Name { get; set; }
        public Guid? LayoutId { get; set; }
    }
}
