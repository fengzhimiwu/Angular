using System;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.TaskItemAssignments;

namespace ManufactureSys.BusinessLogic.Production.Dto
{
    [AutoMapTo(typeof(TaskItemAssignment))]
    public class CreateTaskItemAssignmentInput
    {
        public Guid? SubProjectId { get; set; }
        public Guid TaskItemId { get; set; }
        public Guid ProcedureStepTaskItemId { get; set; }
        public long UserId { get; set; }
        public string ParticipantIds { get; set; }
        /// <summary>
        /// 分派任务时的备注
        /// </summary>
        public string RemarkAssigned { get; set; }
    }
}