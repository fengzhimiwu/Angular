using System;
using Abp.Domain.Entities;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.WorkshopArrangements;

namespace ManufactureSys.BusinessLogic.Workshops
{
    /// <summary>
    /// 工作台实体类 ----- 预留
    /// </summary>
    public class Workshop: Entity<Guid>, IPassivable
    {
        public virtual Guid WorkshopTypeId { get; set; }    // 工作台类型Id，标记： 绑扎台、制梁台、存梁台
        public virtual WorkshopType WorkshopType { get; set; }  // 工作台所属类型对象
        public Guid WorkshopArrangementId { get; set; }         // 工作台安排Id
        public WorkshopArrangement WorkshopArrangement { get; set; } // 工作台安排对象
        /// <summary>
        /// 记录当前工作台的构建
        /// </summary>
        public virtual Guid? SubProjectId { get; set; }     // 子项目Id
        public virtual SubProject SubProject { get; set; }  // 子项目对象
        public string Position { get; set; }                // 位置
        public virtual bool IsActive { get; set; }          // 是否激活
    }
}