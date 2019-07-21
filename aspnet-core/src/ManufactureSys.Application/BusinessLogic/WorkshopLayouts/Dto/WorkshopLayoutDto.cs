using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Runtime.Validation;
using ManufactureSys.BusinessLogic.Workshops;
using System;
using System.ComponentModel.DataAnnotations;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts.Dto
{
    /// <summary>
    /// 工作台布局Dto
    /// </summary>
    [AutoMap(typeof(WorkshopLayout))]
    public class WorkshopLayoutDto : EntityDto<Guid>, ICustomValidate
    {
        /// <summary>
        /// 布局名称
        /// </summary>
        [Required]
        [MaxLength(100, ErrorMessage = "布局名称过长")]
        public virtual string LayoutName { get; set; }
        /// <summary>
        /// 布局方式
        /// </summary>
        [Required]
        [MaxLength(50, ErrorMessage = "布局方式名称过长")]
        public virtual string LayoutWay { get; set; }
        /// <summary>
        /// 生产线数量
        /// </summary>
        [Required]
        public virtual int ProductionLine { get; set; }
        /// <summary>
        /// 钢筋绑扎台数量
        /// </summary>
        public virtual int? BindRebar { get; set; }
        /// <summary>
        /// 制梁台数量
        /// </summary>
        public virtual int? BeamPedestal { get; set; }
        /// <summary>
        /// 存梁台数量
        /// </summary>
        public virtual int? SaveBeam { get; set; }
        /// <summary>
        /// 是否启用
        /// </summary>
        [Required]
        public virtual bool IsActive { get; set; }
        public virtual string Image { get; set; }

        public void AddValidationErrors(CustomValidationContext context)
        {
            if (ProductionLine <= 0)
            {
                context.Results.Add(new ValidationResult("生产线数量应该大于0！"));
            }
            if (BindRebar < 0 && BeamPedestal < 0 && SaveBeam < 0)
            {
                context.Results.Add(new ValidationResult("台座数量应该大于等于0！"));
            }
        }
    }
}
