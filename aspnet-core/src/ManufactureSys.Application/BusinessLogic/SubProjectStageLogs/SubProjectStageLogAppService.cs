using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjectStageLogs.Dto;
using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.AutoMapper;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Linq.Extensions;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Pedestals.Dto;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.TaskItems;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.SubProjectStageLogs
{
    /// <summary>
    /// 公共接口无需权限
    /// </summary>
    public class SubProjectStageLogAppService : ManufactureSysAppServiceBase
    {
        private readonly IRepository<SubProjectStageLog, Guid> _repositorySubProjectStageLog;
        private readonly IRepository<SubProject, Guid> _repositorySubProject;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly TaskItemManager _taskItemManager;

        public SubProjectStageLogAppService(
            IRepository<SubProjectStageLog, Guid> repository,
            IRepository<SubProject, Guid> repositorySubProject, TaskItemManager taskItemManager,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep)
        {
            _repositorySubProjectStageLog = repository;
            _repositorySubProject = repositorySubProject;
            _taskItemManager = taskItemManager;
            _repositoryProcedureStep = repositoryProcedureStep;
        }

        /// <summary>
        /// 获取子项目所有的信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<GetAllSubProjectStageLogOutput> GetAll(GetAllSubProjectStageLogInput input)
        {
            var subProject = await _repositorySubProject.GetAsync(input.SubProjectId);
            // 获取构件的更改记录
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var logs = _repositorySubProjectStageLog.GetAll().Where(v => v.SubProjectId == input.SubProjectId)
                .Include(v => v.TaskItemAssignment).ThenInclude(v => v.User)
                .Include(v => v.TaskItemAssignment).ThenInclude(v => v.TaskItem)
                .Include(v => v.TaskItemAssignment).ThenInclude(v => v.ProcedureStepTaskItem).ThenInclude(v => v.ProcedureStep)
                .Include(v => v.CreatorUser)
                .Select(v => v.MapTo<SubProjectStageLogDto>());
            // 被分派的工作项
            var ptStates = (await _taskItemManager.GetTaskItemsBySubProjectId(input.SubProjectId))
                .Include(v => v.TaskItemAssignments)
                // map的时候用一个方法来添加一些内容
                .Select(a => MapToPtStateDto(a, input.SubProjectId));
            // 添加构件项目工序的优先级列表
            var priorityList = _repositoryProcedureStep.GetAll().Where(v => v.ProcedureId == subProject.ProcedureId)
                .Select(v => v.Priority).OrderBy(v => v);
            return new GetAllSubProjectStageLogOutput
            {
                SubProject = subProject.MapTo<SubProjectDto>(),
                SubProjectStageLogs = await logs.ToListAsync(),
                PtsState = await ptStates.ToListAsync(),
                PriorityList = await priorityList.ToListAsync()
            };
        }

        private static PtStateDto MapToPtStateDto(ProcedureStepTaskItem pt, Guid subProjectId)
        {
            var dto = pt.MapTo<PtStateDto>();
            // 首先按创建时间降序排列，取第一个符合要求的任务
            var assignment = pt.TaskItemAssignments.OrderByDescending(v => v.CreationTime).FirstOrDefault(v =>
                v.SubProjectId == subProjectId && v.ProcedureStepTaskItemId == pt.Id);
            // 如果被修改过，那么就说明完成，如果没有那就没有完成。?.运算符左侧操作数计算结果为 null，则返回 null
            dto.IsFinished = assignment?.LastModificationTime.HasValue;
            dto.TaskItemAssignmentId = assignment?.Id;
            return dto;
        }
    }
}