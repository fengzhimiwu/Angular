using System;
using System.Collections.Generic;
using System.ComponentModel;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.Procedures
{
    public class ProcedureStepTaskItem: FullAuditedEntity<Guid>
    {
        public virtual Guid ProcedureStepId { get; set; }
        public virtual ProcedureStep ProcedureStep { get; set; }
        public virtual Guid TaskItemId { get; set; }
        public virtual TaskItem TaskItem{ get; set; }
        [DefaultValue(0)]
        public virtual int SortId { get; set; }
        public ICollection<TaskItemAssignment> TaskItemAssignments { get; set; }
    }
}