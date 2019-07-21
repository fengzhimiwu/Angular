using System;
using System.ComponentModel;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments
{
    /// <summary>
    /// 工作项的安排 --- 描述的是： 分派的任务
    /// SubProjectId与Pt确定一个任务和其转发。如果SubProjectId为空，则是RootAssignmentId与Pt确定一个任务和其转发
    /// </summary>
    public class TaskItemAssignment : FullAuditedEntity<Guid>
    {
        // SubProjectId为空，无法继续操作
        public Guid? SubProjectId { get; set; }
        public SubProject SubProject { get; set; }
        // RootAssignmentId表示根任务，即和IsForwarded作用一样，如果rootId与Id相同则为表单任务，否则为转发任务
        // TODO 考虑不使用IsForwarded，而使用RootAssignmentId
        public Guid RootAssignmentId { get; set; }
        public Guid ProcedureStepTaskItemId { get; set; }
        public ProcedureStepTaskItem ProcedureStepTaskItem { get; set; }
        /// <summary>
        /// 记录工作项信息
        /// </summary>
        public Guid TaskItemId { get; set; }
        public TaskItem TaskItem { get; set; }
        /// <summary>
        /// 工作项任务，派发给了谁 ----   负责人
        /// </summary>
        public long UserId { get; set; }
        public User User { get; set; }
        /// <summary>ssi
        /// 工作项任务，安排谁参与 ----   多人参与人
        /// </summary>
        public string ParticipantIds { get; set; } 
        /// <summary>
        /// 分派任务时的备注
        /// </summary>
        public string RemarkAssigned { get; set; }
        /// <summary>
        /// 执行任务后，提交的数据 --- 表单填写的数据信息
        /// </summary>
        public string TaskFormData { get; set; }
        /// <summary>
        /// 任务完成时转发给另外的人看：表示基于这个任务，又创建一个任务，只给 UserId ，不用选参与人
        /// </summary>
        [DefaultValue(false)]
        public bool IsForwarded { get; set; }

        public User CreatorUser { get; set; }

    }
}