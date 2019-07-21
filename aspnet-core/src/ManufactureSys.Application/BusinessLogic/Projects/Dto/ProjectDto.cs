using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManufactureSys.BusinessLogic.Projects.Dto
{
    [AutoMapFrom(typeof(Project)), AutoMapTo(typeof(Project))]
    public class ProjectDto : EntityDto<Guid>
    {
        public int? TenantId { get; set; }
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
        public string Supervisor { get; set; }
        public Guid? WorkshopArrangementId { get; set; }
        public Guid? LayoutId { get; set; }
        /// <summary>
        /// 项目简介
        /// </summary>
        public string Profile { get; set; }
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
