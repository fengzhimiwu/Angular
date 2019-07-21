using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;

//using ManufactureSys.Entities;

namespace ManufactureSys.BusinessLogic.TaskItems.Dto
{
    [AutoMap(typeof(TaskItem))]
    public class TaskItemDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        /// <summary>
        /// 工作项的类别： 安全 or 质量  or 文明施工  ---- Settings 表中定义：工作项类别
        /// </summary>
        public virtual string Category { get; set; }

        public string Remark { get; set; }
        public virtual int SortId { get; set; }
        public Guid? ProcedureStepId { get; set; }
        public ProcedureStepDto ProcedureStep { get; set; }
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
        public  Guid? KnowledgebaseId { get; set; } 
    }
}
