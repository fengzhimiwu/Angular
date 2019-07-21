using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.UI;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.SubProjects
{
    public class SubProjectManager : ManufactureSysDomainServiceBase<SubProject, Guid>
    {
        private readonly IRepository<Project, Guid> _repositoryProject;
        private readonly IRepository<Procedure, Guid> _repositoryProcedure;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly IRepository<ProcedureStepTaskItem, Guid> _repositoryProcedureStepTaskItem;
        private readonly IRepository<TaskItemAssignment, Guid> _repositoryTaskItemAssignment;
        private readonly IRepository<SubProjectStageLog, Guid> _repositoryStageLog;
        private readonly IRepository<Pedestal, Guid> _repositoryPedestal;

        public SubProjectManager(
            IRepository<SubProject, Guid> repositorySubProject,
            IRepository<Project, Guid> repositoryProject,
            IRepository<Procedure, Guid> repositoryProcedure,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep,
            IRepository<ProcedureStepTaskItem, Guid> repositoryProcedureStepTaskItem,
            IRepository<TaskItemAssignment, Guid> repositoryTaskItemAssignment,
            IRepository<SubProjectStageLog, Guid> repositoryStageLog,
            IRepository<Pedestal, Guid> repositoryPedestal
        ) : base(repositorySubProject)
        {
            _repositoryProject = repositoryProject;
            _repositoryProcedure = repositoryProcedure;
            _repositoryProcedureStep = repositoryProcedureStep;
            _repositoryProcedureStepTaskItem = repositoryProcedureStepTaskItem;
            _repositoryTaskItemAssignment = repositoryTaskItemAssignment;
            _repositoryStageLog = repositoryStageLog;
            _repositoryPedestal = repositoryPedestal;
        }

        /// <summary>
        /// 获得初始状态码
        /// </summary>
        /// <param name="subProject"></param>
        /// <returns></returns>
        /// <exception cref="UserFriendlyException"></exception>
        public async Task<bool> InitStageCode(SubProject subProject)
        {
            // 获取当前优先级
            var currentPriority = GetCurrentStepPriority(subProject);
            var querySteps = _repositoryProcedureStep.GetAll().Where(v => v.ProcedureId == subProject.ProcedureId && v.Priority > currentPriority);
            // 取得第一和最后优先级
            var firstPriority = await querySteps.MinAsync(m => m.Priority);
            var lastPriority = await querySteps.MaxAsync(m => m.Priority);
            var procedureStepIds = querySteps.Where(v => v.Priority == firstPriority).Select(v => v.Id);
            // 获取任务数量
            var numTaskItems = await _repositoryProcedureStepTaskItem.GetAll()
                .Where(v => procedureStepIds.Contains(v.ProcedureStepId)).CountAsync();
            if (numTaskItems > 0)
            {
                // 组织stageCode
                subProject.StageCode = firstPriority +
                                       SubProject.StageCodeSplitString + lastPriority + 
                                       SubProject.StageCodeSplitString + (int) TaskItemState.Pending +
                                       SubProject.StageCodeSplitString + numTaskItems;
                for (var i = 0; i < numTaskItems; i++)
                {
                    subProject.StageCode += SubProject.StageCodeSplitString + (int) TaskItemState.Pending;
                }

                // 插入stageLog表一条记录，代表开始生产
                InsertStageLog(subProject);
                return true;
            }

            throw new UserFriendlyException("工序的工作项数量为0，或工序模板配置有问题，请检查");
        }

        public async Task<IReadOnlyList<SubProject>> GetUnBindSubProject()
        {
            return await Repository.GetAll().Where(v => v.StageCode.IsNullOrEmpty()).ToListAsync();
        }
        /// <summary>
        /// 更新子项目的工作项是否被分派完
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <param name="num"></param>
        /// <returns></returns>
        public async Task<SubProject> UpdateSupProjectIsAssigned(Guid subProjectId, int num)
        {
            var entity = await GetAsync(subProjectId);
            var stageCodes = entity.StageCode.Split(SubProject.StageCodeSplitString);
            stageCodes[2] = num < 1 ? ((int) TaskItemState.Finished).ToString()
                : ((int) TaskItemState.Pending).ToString();
            entity.StageCode = LinkStageCode(stageCodes);
            return await UpdateAsync(entity);
        }

        /// <summary>
        /// 完成任务改变状态
        /// </summary>
        /// <param name="subProject"></param>
        /// <param name="assignment"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<SubProject> ChangeStageCode(SubProject subProject, TaskItemAssignment assignment)
        {
            if (subProject == null) return null;
            // 如果完成就不做事情；如果subProject为空则返回
            if (subProject.IsFinished) return subProject;
            // 修改状态码
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var procedureStepTaskItem = _repositoryProcedureStepTaskItem.Get(assignment.ProcedureStepTaskItemId);
            var stageCodes = subProject.StageCode.Split(SubProject.StageCodeSplitString);
            stageCodes[3 + procedureStepTaskItem.SortId] = ((int) TaskItemState.Finished).ToString();
            subProject.StageCode = LinkStageCode(stageCodes);
            // 插入状态表记录状态
            InsertStageLog(subProject, assignment);
            // 如果构件工序走完，则修改IsFinished=true
            if (IsSubProjectFinished(subProject))
                subProject.IsFinished = true;
            return await Repository.UpdateAsync(subProject);
        }

        /// <summary>
        /// 插入状态改变表
        /// </summary>
        /// <param name="subProject"></param>
        /// <param name="assignment"></param>
        /// <exception cref="UserFriendlyException"></exception>
        public void InsertStageLog(SubProject subProject, TaskItemAssignment assignment = null)
        {
            subProject.Pedestal = _repositoryPedestal.GetAll().FirstOrDefault(v => v.SubProjectId == subProject.Id);
            var log = new SubProjectStageLog
            {
                StageCode = subProject.StageCode,
                SubProjectId = subProject.Id,
            };
            // 没台座说明是新构件
            if (subProject.Pedestal != null)
                log.PedestalId = subProject.Pedestal.Id;
            // 有台座没任务，本操作是上存梁台
            if (assignment != null)
                log.TaskItemAssignmentId = assignment.Id;
            _repositoryStageLog.Insert(log);
        }

// 状态码的部分
        /// <summary>
        /// 判断子项目是否做完
        /// </summary>
        /// <param name="subProject"></param>
        /// <returns></returns>
        private bool IsSubProjectFinished(SubProject subProject)
        {
            subProject.Procedure = _repositoryProcedure.Get(subProject.ProcedureId);
            var priority = GetCurrentStepPriority(subProject);
            return subProject.Procedure.LastPriority == priority && IsCurrentStepFinished(subProject);
        }

        /// <summary>
        /// 状态码连接
        /// </summary>
        /// <param name="stageCodes"></param>
        /// <returns></returns>
        private static string LinkStageCode(string[] stageCodes)
        {
            var result = stageCodes[0];
            for (var i = 1; i < stageCodes.Length; i++)
            {
                result += SubProject.StageCodeSplitString + stageCodes[i];
            }

            return result;
        }

        /// <summary>
        /// 从状态码里取出当前所在工序
        /// </summary>
        /// <param name="subProject"></param>
        /// <returns></returns>
        public static int GetCurrentStepPriority(SubProject subProject)
        {
            if (subProject.StageCode.IsNullOrEmpty())
                return -1;
            var stageCodes = subProject.StageCode.Split(SubProject.StageCodeSplitString);
            var procedureStepPriority = stageCodes[0];
            return int.Parse(procedureStepPriority);
        }

        /// <summary>
        /// 状态码判断当前工序是否做完
        /// </summary>
        /// <param name="subProject"></param>
        /// <returns></returns>
        public static bool IsCurrentStepFinished(SubProject subProject)
        {
            var stageCodes = subProject.StageCode?.Split(SubProject.StageCodeSplitString);
            if (stageCodes == null) return false;
            for (var i = 4; i < stageCodes.Length; i++)
            {
                if (stageCodes[i] != ((int) TaskItemState.Finished).ToString())
                    return false;
            }

            return true;
        }
    }
}