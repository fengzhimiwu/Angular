using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.Projects.Dto;
using ManufactureSys.MultiTenancy;
using ManufactureSys.MultiTenancy.Dto;
using ManufactureSys.Users.Dto;

namespace ManufactureSys.BusinessLogic.ProjectMembers.Dto
{
    [AutoMap(typeof(ProjectMember))]
    public class ProjectMemberDto: EntityDto<Guid>
    {
        public virtual Guid? ProjectId { get; set; }
        public virtual ProjectDto Project { get; set; }
        public Guid TenantId { get; set; }
        public TenantDto Tenant { get; set; }
        public virtual long UserId { get; set; }
        public virtual UserDto User { get; set; }
    }
}