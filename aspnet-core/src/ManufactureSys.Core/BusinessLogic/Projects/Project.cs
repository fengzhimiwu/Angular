using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.WorkshopArrangements;

namespace ManufactureSys.BusinessLogic.Projects
{
    /// <summary>
    ///  项目实体 - 保存项目信息
    ///  项目名称、工程名称、 工程地点（省、市、区、详细地址）、工程规模描述
    ///  投资金额、 工程特点介绍、 工程宣传视频
    ///  BIM模型文件、梁场布局、
    /// </summary>
    public class Project : AuditedEntity<Guid>, IMayHaveTenant
    {
        /// <summary>
        ///  项目所属公司
        /// </summary>
        /// <inheritdoc />
        public int? TenantId { get; set; }
        /// <summary>
        ///  项目名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 项目编号 - 例如： WH-2019-001
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 合同编号  
        /// </summary>
        public string ContractNum { get; set; }
        /// <summary>
        /// 梁场名称 
        /// </summary>
        public string SiteName { get; set; }
        /// <summary>
        /// 建设单位
        /// </summary>
        public string UnitName { get; set; }
        /// <summary>
        /// 监理单位
        /// </summary>
        public string Supervisor { get; set; }
        /// <summary>
        /// 预留
        /// </summary>
        public Guid? WorkshopArrangementId { get; set; }
        public WorkshopArrangement WorkshopArrangement { get; set; }
        /// <summary>
        /// 项目所选定的 梁场布局 --- 与 WorkshopLayouts 表 Id 关联
        /// </summary>
        public Guid? LayoutId { get; set; }
        /// <summary>
        /// 项目简介
        /// </summary>
        public string Profile{ get; set; }
        /// <summary>
        /// 项目类别： 桥梁、公路 等
        /// </summary>
        public string Category { get; set; } 
        /// <summary>
        /// 项目所在地信息： 省、市、区、街道、详细地址
        /// </summary>
        public string Province { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Street { get; set; }
        public string Address { get; set; }
        /// <summary>
        /// 项目投资额
        /// </summary>
        public decimal? InvestAmount { get; set; }
        /// <summary>
        /// 负责人多个名字串，多个分号隔开
        /// </summary>
        public string ChargeManNames { get; set; }
        /// <summary>
        /// 项目状态 --- 未开始、进行中、已完成   --- settings 表中定义 
        /// </summary>
        public string Status { get; set; } 
        /// <summary>
        /// 计划开始时间、 完成时间
        /// </summary>
        public DateTime? PlanStartTime { get; set; }
        public DateTime? PlanEndTime { get; set; }
        /// <summary>
        /// 实际开始时间、完成时间
        /// </summary>
        public DateTime? ActualStartTime { get; set; }
        public DateTime? ActualEndTime { get; set; }

        /// <summary>
        /// 备注信息
        /// </summary>
        public string Remark { get; set; }
    }
}

