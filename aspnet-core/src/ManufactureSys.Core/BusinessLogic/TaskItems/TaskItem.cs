using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Knowledgebases;
using ManufactureSys.BusinessLogic.Procedures;

namespace ManufactureSys.BusinessLogic.TaskItems
{
    /// <summary>
    /// 工作项实体类 --- 以及表格
    /// </summary>
    public class TaskItem : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public virtual int? TenantId { get; set; }
        public virtual string Name { get; set; }
//        /// <summary>
//        /// 工作项， 属于哪个工序流程里面，确保当 梁片处于某个 流程 中时，
//        /// 可以过滤出该流程下的工作项列表
//        /// </summary>
//        public virtual ICollection<ProcedureStepTaskItem> ProcedureStepTaskItems { get; set; }

        /// <summary>
        /// 工作项的类别： 安全 or 质量  or 文明施工  ---- Settings 表中定义：工作项类别
        /// </summary>
        public virtual string Category { get; set; }

        /// <summary>
        /// 关于工作项的备注说明信息
        /// </summary>
        public virtual string Remark { get; set; }
        /// <summary>
        /// 工作项关联的表格 --- Json 形式保存的表格，用于填写信息的表单
        /// </summary>
        public string TaskFromTemplate { get; set; }  
        
        /// <summary>
        /// 工作项在某个工序中，执行的次数， 默认 1 次
        /// </summary>
        public int ExecutedTimes { get; set; }

        /// <summary>
        /// 工作项的分值， 用于统计、考核工作量   0-100 分
        /// </summary>
        public int Score { get; set; }

        /// <summary>
        /// 工作项 与 知识库 关联 ---- 知识库用于指导 工作项 到底该 做些什么？注意什么问题
        /// </summary>
        public virtual Guid? KnowledgebaseId { get; set; }
        public virtual KnowledgeBase KnowledgeBase { get; set; }
    }
}

