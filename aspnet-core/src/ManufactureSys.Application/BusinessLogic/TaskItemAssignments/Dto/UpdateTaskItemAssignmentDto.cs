using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments.Dto
{
    [AutoMapTo(typeof(TaskItemAssignment))]
    public class UpdateTaskItemAssignmentDto: EntityDto<Guid>
    {
        public string TaskFormData { get; set; }
    }
}