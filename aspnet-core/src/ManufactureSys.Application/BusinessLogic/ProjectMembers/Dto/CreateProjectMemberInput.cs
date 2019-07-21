using System;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Projects;

namespace ManufactureSys.BusinessLogic.ProjectMembers.Dto
{
    [AutoMapTo(typeof(ProjectMember))]
    public class CreateProjectMemberInput
    {
        public Guid ProjectId { get; set; }
        public int TenantId { get; set; }
        public long UserId { get; set; }
    }
}