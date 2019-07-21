using System;
using System.Collections.Generic;
using System.Text;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts.Dto
{
    public class WorkshopLayoutInput
    {
        /// <summary>
        /// 生产线数量
        /// </summary>
        public virtual int ProductionLine { get; set; }
        /// <summary>
        /// 钢筋绑扎台数量
        /// </summary>
        public virtual int BindRebar { get; set; }
        /// <summary>
        /// 制梁台数量
        /// </summary>
        public virtual int BeamPedestal { get; set; }
        /// <summary>
        /// 存梁台数量
        /// </summary>
        public virtual int SaveBeam { get; set; }
        /// <summary>
        /// 布局Id
        /// </summary>
        public Guid LayoutId { get; set; }
        /// <summary>
        /// 所属项目Id
        /// </summary>
        public Guid ProjectId { get; set; }
        /// <summary>
        /// 是否存入数据库
        /// </summary>
        public bool IsSave { get; set; }
        public WorkshopLayoutInput()
        {
            IsSave = false;
        }
    }
}
