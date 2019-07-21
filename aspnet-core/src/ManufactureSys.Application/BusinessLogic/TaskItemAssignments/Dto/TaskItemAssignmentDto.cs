using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.TaskItems.Dto;
using ManufactureSys.Users.Dto;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments.Dto
{
    [AutoMapFrom(typeof(TaskItemAssignment))]
    public class TaskItemAssignmentDto: EntityDto<Guid>
    {
        public Guid? SubProjectId { get; set; }
        public SubProjectDto SubProject { get; set; }
        public Guid ProcedureStepTaskItemId { get; set; }
        public ProcedureStepTaskItemDto ProcedureStepTaskItem { get; set; }
        public Guid? RootAssignmentId { get; set; }

        public Guid TaskItemId { get; set; }
        public TaskItemDto TaskItem { get; set; }
       
        /// <summary>
        /// 工作项任务，派发给了谁 ----   负责人
        /// </summary>
        public long UserId { get; set; } 
        public UserDto User { get; set; }
        /// <summary>
        /// 工作项任务，安排谁参与 ----   多人参与人
        /// </summary>
        public string ParticipantIds { get; set; }
        /// <summary>
        /// 分派任务时的备注
        /// </summary>
        public string RemarkAssigned { get; set; }
        public string TaskFormData { get; set; }
        /// <summary>
        /// 任务完成时转发给另外的人看：表示基于这个任务，又创建一个任务，只给 UserId ，不用选参与人
        /// </summary>
        public bool IsForwarded { get; set; }
        public long CreatorUserId { get; set; }
        public UserDto CreatorUser { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }
}