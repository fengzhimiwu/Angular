using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.UI;
using ManufactureSys.BusinessLogic.SubProjects;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Procedures
{
    public class ProcedureManager : ManufactureSysDomainServiceBase<Procedure, Guid>
    {
        private readonly IRepository<Procedure, Guid> _repositoryProcedure;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly IRepository<ProcedureStepTaskItem, Guid> _repositoryProcedureStepTaskItem;
        private readonly IRepository<SubProject, Guid> _repositorySubProject;

        public ProcedureManager(
            IRepository<Procedure, Guid> repositoryProcedure,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep,
            IRepository<ProcedureStepTaskItem, Guid> repositoryProcedureStepTaskItem,
            IRepository<SubProject, Guid> repositorySubProject) : base(repositoryProcedure)
        {
            _repositoryProcedure = repositoryProcedure;
            _repositoryProcedureStep = repositoryProcedureStep;
            _repositoryProcedureStepTaskItem = repositoryProcedureStepTaskItem;
            _repositorySubProject = repositorySubProject;
        }

        /// <summary>
        /// 创建更新每一道工序
        /// </summary>
        /// <param name="procedureStep"></param>
        /// <returns></returns>
        /// <exception cref="UserFriendlyException"></exception>
        public async Task<ProcedureStep> CreateOrUpdateProcedureStepAsync(ProcedureStep procedureStep)
        {
            procedureStep.NumTaskItems = _repositoryProcedureStepTaskItem.GetAll()
                .Count(v => v.ProcedureStepId == procedureStep.Id);
            // 插入或者更新每一道工序
            await _repositoryProcedureStep.InsertOrUpdateAsync(procedureStep);
            CurrentUnitOfWork.SaveChanges();
            var procedure = await _repositoryProcedure.GetAsync(procedureStep.ProcedureId);
            // 填入工序最后一步的优先级
            var query = _repositoryProcedureStep.GetAll().Where(v => v.ProcedureId == procedureStep.ProcedureId);
            procedure.LastPriority = await query.MaxAsync(v => v.Priority);
            // 填入工序总时间
            procedure.TotalDuration = await query.SumAsync(s => s.Duration);
            // 更新工序
            await _repositoryProcedure.UpdateAsync(procedure);
            return procedureStep;
        }

        /// <summary>
        /// 检测是否被占用
        /// </summary>
        /// <param name="procedureId"></param>
        /// <exception cref="UserFriendlyException"></exception>
        public void CheckOccupation(Guid procedureId)
        {
            // 只要有pedestal台座上的subProject使用了这个工序就无法操作
            if (_repositorySubProject.GetAll()
                .Include(v => v.Pedestal).Where(v => v.Pedestal != null)
                .Any(v => v.ProcedureId == procedureId))
                throw new UserFriendlyException("工序模板被占用，无法进行操作");
        }

        /// <summary>
        /// 创建一个日常任务类别
        /// </summary>
        /// <param name="procedureStep"></param>
        /// <returns></returns>
        public async Task<ProcedureStep> CreateRoutineCategory(ProcedureStep procedureStep)
        {
            var procedure = GetAll().FirstOrDefault(v => v.IsRoutine);
            // 如果为空则要新建一个procedure
            if (procedure == null)
            {
                procedure = new Procedure
                {
                    TenantId = CurrentUnitOfWork.GetTenantId(),
                    Name = "日常",
                    Description = "这是日常任务工序模板",
                    IsRoutine = true
                };
                await InsertAsync(procedure);
            }

            // 给日常procedureId赋值
            procedureStep.ProcedureId = procedure.Id;
            procedureStep.NumTaskItems = _repositoryProcedureStepTaskItem.GetAll()
                .Count(v => v.ProcedureStepId == procedureStep.Id);
            // 插入或者更新每一道工序
            await _repositoryProcedureStep.InsertOrUpdateAsync(procedureStep);
            return procedureStep;
        }
    }
}