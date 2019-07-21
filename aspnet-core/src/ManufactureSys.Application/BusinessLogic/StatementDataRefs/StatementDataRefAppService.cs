using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.Procedures.Dto;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.StatementDataRefs.Dto;
using ManufactureSys.BusinessLogic.Statements;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.TaskItems.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.StatementDataRefs
{
    [AbpAuthorize(PermissionNames.SystemStatement)]
    public class StatementDataRefAppService : ManufactureSysAppServiceBase
    {
        private readonly TaskItemManager _taskItemManager;
        private readonly ProcedureManager _procedureManager;
        private readonly IRepository<ProcedureStepTaskItem, Guid> _repositoryPt;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly StatementManager _statementManager;

        public StatementDataRefAppService(
            TaskItemManager taskItemManager, StatementManager statementManager, ProcedureManager procedureManager,
            IRepository<ProcedureStepTaskItem, Guid> repositoryPt,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep)
        {
            _taskItemManager = taskItemManager;
            _statementManager = statementManager;
            _procedureManager = procedureManager;
            _repositoryPt = repositoryPt;
            _repositoryProcedureStep = repositoryProcedureStep;
        }

        public async Task<StatementDataRefDto> Create(CreateStatementDataRefInput input)
        {
            var entity = await _statementManager.InsertAsync(input.MapTo<StatementDataRef>());
            entity.ProcedureStepTaskItem = await _repositoryPt.GetAsync(entity.ProcedureStepTaskItemId);
            entity.ProcedureStepTaskItem.TaskItem = await _taskItemManager.GetAsync(entity.ProcedureStepTaskItem.TaskItemId);
            return entity.MapTo<StatementDataRefDto>();
        }

        public async Task Delete(EntityDto<Guid> input)
        {
            await _statementManager.DeleteAsync(input.Id);
        }

        /// <summary>
        /// 获取所有工序模板
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureDto>> GetAllProcedures()
        {
            var query = _procedureManager.GetAll().Where(v => !v.IsRoutine);
            return new PagedResultDto<ProcedureDto>(
                await query.CountAsync(),
                await query.Select(v => v.MapTo<ProcedureDto>()).ToListAsync()
            );
        }

        /// <summary>
        /// 获取所有工序
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepDto>> GetAllProcedureSteps(Guid procedureId)
        {
            var query = _repositoryProcedureStep.GetAll().Where(v => v.ProcedureId == procedureId);
            return new PagedResultDto<ProcedureStepDto>(
                await query.CountAsync(),
                await query.Select(v => v.MapTo<ProcedureStepDto>()).ToListAsync()
            );
        }

        /// <summary>
        /// 获取pt
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepTaskItemDto>> GetAllPts(Guid procedureStepId)
        {
            var query = _repositoryPt.GetAll().Where(v => v.ProcedureStepId == procedureStepId).Include(v => v.TaskItem);
            return new PagedResultDto<ProcedureStepTaskItemDto>(
                await query.CountAsync(),
                await query.Select(v => v.MapTo<ProcedureStepTaskItemDto>()).ToListAsync()
            );
        }

        /// <summary>
        /// 获取已经绑定过的项目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<StatementDataRefDto>> GetAllBindings(EntityDto<Guid> input)
        {
            var query = _statementManager.GetAll().Where(t => t.FileItemId == input.Id)
                .Include(v => v.ProcedureStepTaskItem).ThenInclude(v => v.TaskItem);
            return new PagedResultDto<StatementDataRefDto>(
                await query.CountAsync(),
                await query.Select(v => v.MapTo<StatementDataRefDto>()).ToListAsync()
            );
        }
    }
}