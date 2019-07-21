using System;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.SubProjects
{
    /// <summary>
    /// 梁片生产过程中，经过了哪些台座、状态
    /// </summary>
    public class SubProjectStageLog: CreationAuditedEntity<Guid>
    {
        public Guid SubProjectId { get; set; }
        public SubProject SubProject { get; set; }
        public Guid? TaskItemAssignmentId { get; set; }
        public TaskItemAssignment TaskItemAssignment { get; set; }
        public Guid? PedestalId { get; set; }
        public Pedestal Pedestal { get; set; }
        public User CreatorUser { get; set; }
        // 预留
        public Guid? WorkshopId { get; set; }
        public string StageCode { get; set; }
    }
}