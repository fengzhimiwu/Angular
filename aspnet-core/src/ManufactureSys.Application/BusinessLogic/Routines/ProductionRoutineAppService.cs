using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Routines
{
    [AbpAuthorize(PermissionNames.ProductionManagement)]
    public class ProductionRoutineAppService: ManufactureSysAppServiceBase
    {
        private readonly IRepository<ProcedureStepTaskItem, Guid> _repositoryPsTi;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly ProcedureManager _procedureManager;

        public ProductionRoutineAppService(IRepository<ProcedureStepTaskItem, Guid> repositoryPsTi, ProcedureManager procedureManager, IRepository<ProcedureStep, Guid> repositoryProcedureStep)
        {
            _repositoryPsTi = repositoryPsTi;
            _procedureManager = procedureManager;
            _repositoryProcedureStep = repositoryProcedureStep;
        }
        /// <summary>
        /// 获取日常任务分类
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepDto>> GetAllRoutineCategory()
        {
            var procedure = _procedureManager.GetAll().FirstOrDefault(v => v.IsRoutine);
            // 如果为空则返回一个空的对象
            if (procedure == null) return new PagedResultDto<ProcedureStepDto>();
            var query = _repositoryProcedureStep.GetAll().Where(p => p.ProcedureId == procedure.Id);
            return await GetAllAsyncByQueryFilter<ProcedureStepDto, ProcedureStep>(query);
        }
        /// <summary>
        /// 获取procedureStepId这个类别的所有日常任务
        /// </summary>
        /// <param name="procedureStepId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepTaskItemDto>> GetAllRoutineTasks(Guid procedureStepId)
        {
            var query = _repositoryPsTi.GetAll().Where(v => v.ProcedureStepId == procedureStepId)
                .Include(v => v.TaskItem);
            return await GetAllAsyncByQueryFilter<ProcedureStepTaskItemDto, ProcedureStepTaskItem>(query);
        }
    }
}