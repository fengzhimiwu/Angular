using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts
{
    /// <summary>
    /// 梁场布局模板 --- 预定义一些布局模板， 例如:2条生产线横向布局、2条生产线竖向布局； 
    ///                                      3条生产线横向布局、3条生产线竖向布局
    /// 布局属于通用模块所以没有tenantId
    /// </summary>
    public class WorkshopLayout : FullAuditedEntity<Guid>, IPassivable
    {
        /// <summary>
        /// 布局模板名称
        /// </summary>
        [Required]
        [MaxLength(100)]
        public virtual string LayoutName { get; set; }

        /// <summary>
        /// 布局方式： 横向布局、 竖向布局  --------- 只支持 横向布局，禁止竖向布局，因为 施工页面 摆放不下
        /// </summary>
        [Required]
        [MaxLength(50)]
        public virtual string LayoutWay { get; set; }

        /// <summary>
        /// 生产线个数
        /// </summary>
        [Required]
        public virtual int ProductionLine { get; set; }  

        /// <summary>
        /// 钢筋绑扎台个数
        /// </summary>
        [DefaultValue(0)]
        public virtual int BindRebar { get; set; }      

        /// <summary>
        /// 制梁台个数
        /// </summary>
        [DefaultValue(0)]
        public virtual int BeamPedestal { get; set; }  

        /// <summary>
        /// 存梁台个数
        /// </summary>
        [DefaultValue(0)]
        public virtual int SaveBeam { get; set; }      

        /// <summary>
        /// 是否激活
        /// </summary>
        public virtual bool IsActive { get; set; }      

        /// <summary>
        /// 布局示例图
        /// </summary>
        public virtual string Image { get; set; }        
    }
}
