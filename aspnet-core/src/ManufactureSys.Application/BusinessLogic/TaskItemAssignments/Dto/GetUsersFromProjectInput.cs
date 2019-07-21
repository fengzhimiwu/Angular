using System;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments.Dto
{
    public class GetUsersFromProjectInput
    {
        public int? TenantId { get; set; }
        public Guid ProjectId { get; set; }
        public string Name { get; set; }
        public string RoleNames { get; set; }
    }
}