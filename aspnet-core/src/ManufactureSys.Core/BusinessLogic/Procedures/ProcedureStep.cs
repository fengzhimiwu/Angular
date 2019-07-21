using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using JetBrains.Annotations;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.Workshops;

namespace ManufactureSys.BusinessLogic.Procedures
{
    /// <summary>
    /// 工序流程 -- 与 Procedure 工序模板关联
    /// 若某个工序需要执行多次时，直接定义为 多个 工序，确保工序串行执行
    /// </summary>
    public class ProcedureStep : FullAuditedEntity<Guid>
    {
        /// <summary>
        /// 工序模板ID ---  工序流程 归属于 哪个 工序模板 
        /// </summary>
        public virtual Guid ProcedureId { get; set; }    
        public virtual Procedure Procedure { get; set; }  
        public virtual string Name { get; set; }
        /// <summary> 
        /// 关于该工序的操作说明文字 --- 帮助系统
        /// </summary>
        public virtual string Description { get; set; }
        /// <summary>
        /// 优先级别，也相当于排序级别 --- 两个工序流程，可以设置相同的优先级
        /// </summary>
        public virtual int Priority { get; set; }
        /// <summary>
        /// 工序流程中，包含的工作项数量，绑定的时候会自动算出来
        /// </summary>
        [DefaultValue(0)]
        public virtual int NumTaskItems { get; set; }
        /// <summary>
        /// 工序流程，耗费的时间， 单位： 天
        /// </summary>
        [DefaultValue(0L)]
        public decimal Duration { get; set; }
    }
}

