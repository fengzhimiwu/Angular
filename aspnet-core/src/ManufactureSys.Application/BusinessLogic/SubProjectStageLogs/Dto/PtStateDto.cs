using System;
using System.ComponentModel;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.SubProjectStageLogs.Dto
{
    public class PtStateDto: ProcedureStepTaskItemDto
    {
        // 标识是否完成，null为未分派
        [DefaultValue(null)]
        public bool? IsFinished { get; set; }
        // 添加任务id方便导航
        public Guid? TaskItemAssignmentId { get; set; }
    }
}