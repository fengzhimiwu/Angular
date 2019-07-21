using System;
using Abp.Domain.Entities;
using ManufactureSys.Authorization.Users;
using ManufactureSys.MultiTenancy;

namespace ManufactureSys.BusinessLogic.Projects
{
    /// <summary>
    /// 项目团队成员
    /// </summary>
    public class ProjectMember: Entity<Guid>
    {
        public virtual Guid ProjectId { get; set; }
        public virtual Project Project { get; set; }
        public int? TenantId { get; set; }
        public Tenant Tenant { get; set; }
        public virtual long UserId { get; set; }
        public User User { get; set; }

        /// <summary>
        /// 项目成员姓名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 成员所在部门 ----  项目下，分为多个部门、多个角色， 这些都定义到 settings 表中
        /// </summary>
        public string Department { get; set; }
        /// <summary>
        /// 在项目中充当的角色 ：  项目经理、 质检员、 工程员、实验员 等 ，定义到 settings 表中
        /// </summary>
        public string RoleName { get; set; }  

    }
}