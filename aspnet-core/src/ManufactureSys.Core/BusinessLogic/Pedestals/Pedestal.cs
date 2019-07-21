using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.WorkshopLayouts;
using ManufactureSys.BusinessLogic.Workshops;

namespace ManufactureSys.BusinessLogic.Pedestals
{
    /// <summary>
    /// 台座实体 --- 某个项目选中的梁场布局、生产线中各种类别的台座的具体信息：数量、编号、位置等
    /// </summary>
    public class Pedestal : Entity<Guid>
    {
        /// <summary>
        /// 为每个台座 编码，如： L1_L_CL_00024
        /// L1: 表示生产线1，   L2、 L3 表示 生产线2、3
        /// L：表示布局示意图中 左 区域  ， R 表示布局示意图中的  右 区域， 示意图，只设计横向布局，不提供纵向布局
        /// CL：表示 存梁台 ，  GJ、 ZL 分别表示 钢筋绑扎台、 制梁台
        /// </summary>
        public virtual string Code { get; set; }
        /// <summary>
        /// 本项目所选的梁场布局方案 --- 与 WorkshopLayouts 表关联
        /// </summary>
        public virtual Guid WorkshopLayoutId { get; set; }
        public WorkshopLayout WorkshopLayout { get; set; }

        public virtual Guid ProjectId { get; set; }
        public Project Project { get; set; }
        public virtual int ProductionLine { get; set; }
        /// <summary>
        /// 描述台座的类型： GJ、 ZL、 CL 分别表示： 钢筋绑扎台、制梁台、存梁台
        /// </summary>
        public virtual string Type { get; set; }
        /// <summary>
        /// 表示生产线横向布局的 左、 右
        /// </summary>
        public virtual string Area { get; set; }

        /// 标记台座目前被哪个梁片占用，只记录最新的那个
        public Guid? SubProjectId { get; set; }
        public SubProject SubProject { get; set; }
    }
}
