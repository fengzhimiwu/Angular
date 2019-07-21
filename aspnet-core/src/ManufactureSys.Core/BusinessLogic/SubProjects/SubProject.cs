using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.Projects;

using ManufactureSys.BusinessLogic.Workshops;

namespace ManufactureSys.BusinessLogic.SubProjects
{
    /// <summary>
    /// 子项目/构件  --- 每一片梁片，都是作为项目的子项目， 任务的分派执行，都是基于梁片（子项目）
    /// </summary>
    public class SubProject : AuditedEntity<Guid>
    {
        /// <summary>
        /// 每一个子项目（梁片），都归属于唯一的一个 Project
        /// </summary>
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
        /// <summary>
        /// 是否为手工创建，手工创建为空，由模型创建则有Id对应fileItemId
        /// </summary>
        public Guid? BimModelFileItemId { get; set; }
        /// <summary>
        /// 子项目编码（梁片编码） ----  系统内部按某种规则定义的一种编码
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 表示批次数
        /// </summary>
        [DefaultValue(1)]
        public int BatchNum { get; set; }
        /// <summary>
        /// 该片梁对应 BIM 模型上 的ID ，通过此 编码，可以定位到 BIM 模型--- 手工创建该指为空
        /// </summary>
        public int? BimModelDbId { get; set; }
        /// <summary>
        /// 该片梁对应 BIM 模型上 的编码 ，通过此 编码，可以定位到 BIM 模型--- 
        /// </summary>
        public string BimCode { get; set; }
        public string Description { get; set; }
        /// <summary>
        /// 子项目 ，使用哪个工序模板方案 ， 
        /// 也即该 子项目 按照特定的 工序流程 进行生产  ---- 与 Procedures 表关联
        /// </summary>
        public Guid ProcedureId { get; set; }       
        public Procedure Procedure { get; set; }
        /// <summary>
        /// 阶段编号：当前工序优先级-最后工序优先级-是否分派完成-任务项数目-任务项1完成状态-任务项2完成状态
        /// </summary>
        /// <example>
        /// 子项目正处于：1-9-1-2-1-0 即工序优先级1-最后9-已分派完-任务项数2-任务1完成-任务2未完成
        /// </example>
        public string StageCode { get; set; }

        /// <summary>
        /// 最后一个工序会变为true
        /// </summary>
        [NotMapped]
        private bool _isFinished;
        [DefaultValue(false)] 
        public bool IsFinished 
        {
            get => _isFinished; 
            set
            {
                _isFinished = value;
                FinishingTime = DateTime.Now;
            }
        }
        public DateTime? FinishingTime { get; set; }
        /// <summary>
        /// 构件下台座的时间
        /// </summary>
        public DateTime? OffPedestalTime { get; set; }
        /// <summary>
        /// 预计完成时间
        /// </summary>
        public DateTime? EstimatedFinishedTime { get; set; }
        [NotMapped]
        public const string StageCodeSplitString = "-";
        /// <summary>
        /// 对象深拷贝
        /// </summary>
        /// <returns></returns>
        public SubProject Clone()
        {
            return MemberwiseClone() as SubProject;
        }
        // 台座绑定
        public Pedestal Pedestal { get; set; }
        /// <summary>
        /// 梁片类别： T梁、 30米T梁、  24米T梁 等  ---- 此类别应该定义到 Settings 表中去
        /// </summary>
        public string Category { get; set; }
        // 预留
        public Workshop Workshop { get; set; }
    }
}

