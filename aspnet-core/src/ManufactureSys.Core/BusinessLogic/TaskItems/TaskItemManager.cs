using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.TaskItems
{
    public class TaskItemManager : ManufactureSysDomainServiceBase<TaskItem, Guid>
    {
        private readonly IRepository<TaskItem, Guid> _repositoryTaskItem;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly IRepository<TaskItemAssignment, Guid> _repositoryTaskItemAssignment;
        private readonly IRepository<SubProject, Guid> _repositorySubProject;
        private readonly IRepository<ProcedureStepTaskItem, Guid> _repositoryPt;

        public TaskItemManager(
            IRepository<TaskItem, Guid> repositoryTaskItem,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep,
            IRepository<TaskItemAssignment, Guid> repositoryTaskItemAssignment,
            IRepository<SubProject, Guid> repositorySubProject, IRepository<ProcedureStepTaskItem, Guid> repositoryPt) :
            base(repositoryTaskItem)
        {
            _repositoryTaskItem = repositoryTaskItem;
            _repositoryProcedureStep = repositoryProcedureStep;
            _repositoryTaskItemAssignment = repositoryTaskItemAssignment;
            _repositorySubProject = repositorySubProject;
            _repositoryPt = repositoryPt;
        }

        /// <summary>
        /// 创建工作项
        /// </summary>
        /// <param name="taskItem"></param>
        /// <returns></returns>
        /// <exception cref="UserFriendlyException"></exception>
        public async Task<TaskItem> CreateAsync(TaskItem taskItem)
        {
            try
            {
                taskItem.TenantId = CurrentUnitOfWork.GetTenantId();
                return await _repositoryTaskItem.InsertAsync(taskItem);
            }
            catch (Exception e)
            {
                Logger.Warn(e.ToString(), e);
                throw new UserFriendlyException("创建失败");
            }
        }

        /// <summary>
        /// 通过subProjectId获得工作项，并筛选未被分派的工作项
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        public async Task<IQueryable<ProcedureStepTaskItem>> GetTaskItemsUnAssigned(Guid subProjectId)
        {
            var subProject = await _repositorySubProject.GetAsync(subProjectId);
            // 获取同优先级工序
            var procedureStepIds = _repositoryProcedureStep.GetAll().Where(v =>
                v.ProcedureId == subProject.ProcedureId &&
                v.Priority == SubProjectManager.GetCurrentStepPriority(subProject)).Select(v => v.Id);
            // 获取被分派的工作项
            var taskItemIdAssigned = _repositoryTaskItemAssignment.GetAll()
                .Where(v => v.SubProjectId == subProjectId).Select(v => v.ProcedureStepTaskItemId);
            // 筛选未被分派的工作项
            var query = _repositoryPt.GetAll().Where(v => !taskItemIdAssigned.Contains(v.Id))
                // 筛选同优先级的工作项
                .Where(v => procedureStepIds.Contains(v.ProcedureStepId))
                .Include(v => v.ProcedureStep)
                .Include(v => v.TaskItem);
            return query;
        }

        /// <summary>
        /// 获取当前构件中的所有的工作项
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        public async Task<IQueryable<ProcedureStepTaskItem>> GetTaskItemsBySubProjectId(Guid subProjectId)
        {
            var subProject = await _repositorySubProject.GetAsync(subProjectId);
            // 获取当前优先级的工序id
            var procedureStepIds = _repositoryProcedureStep.GetAll().Where(v =>
                v.ProcedureId == subProject.ProcedureId &&
                v.Priority == SubProjectManager.GetCurrentStepPriority(subProject)).Select(v => v.Id);
            return _repositoryPt.GetAll().Where(v => procedureStepIds.Contains(v.ProcedureStepId))
                .Include(v => v.ProcedureStep)
                .Include(v => v.TaskItem);
        }

        public bool? IsAssignmentFinish(Guid procedureStepTaskItemId)
        {
            var assignment = _repositoryTaskItemAssignment.GetAll()
                .Where(v => v.ProcedureStepTaskItemId == procedureStepTaskItemId).OrderByDescending(v => v.CreationTime)
                .FirstOrDefault();
            if (assignment == null)
                return null;
            return assignment.TaskFormData.IsNullOrEmpty();
        }

        /// <summary>
        /// 通过工作项获取subProject
        /// </summary>
        /// <param name="taskItemAssignmentId"></param>
        /// <returns></returns>
        public SubProject GetSubProject(Guid taskItemAssignmentId)
        {
            var assignment = _repositoryTaskItemAssignment.Get(taskItemAssignmentId);
            // SubProjectId为空，无法继续操作
            return assignment.SubProjectId.HasValue ? _repositorySubProject.Get((Guid)assignment.SubProjectId) : null;
        }
        /// <summary>
        /// 检查工序是否被占用
        /// </summary>
        /// <param name="procedureStepId"></param>
        /// <exception cref="UserFriendlyException"></exception>
        public void CheckProcedureStepOccupation(Guid procedureStepId)
        {
            var procedureStep = _repositoryProcedureStep.Get(procedureStepId);
            // 如果有一个正在台座上的构件(v.Pedestal != null)，与当前所在工序与所操作的工序相同(SubProjectManager.GetCurrentStepPriority(v) == procedureStep.Priority)，则会报错
            if (_repositorySubProject.GetAll().Include(v => v.Pedestal)
                .Any(v => SubProjectManager.GetCurrentStepPriority(v) == procedureStep.Priority &&
                          v.ProcedureId == procedureStep.ProcedureId && v.Pedestal != null ))
                throw new UserFriendlyException("无法操作正在被使用的工序");
        }
        /// <summary>
        /// 检查工序中所添加的工作项是否被占用
        /// </summary>
        /// <param name="ptId"></param>
        /// <exception cref="UserFriendlyException"></exception>
        public void CheckPtOccupation(Guid ptId)
        {
            var pt = _repositoryPt.Get(ptId);
            // 传入工序模板进行检测
            CheckProcedureStepOccupation(pt.ProcedureStepId);
        }
    }
}