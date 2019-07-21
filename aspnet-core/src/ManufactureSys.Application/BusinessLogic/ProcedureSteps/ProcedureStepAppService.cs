using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.ProcedureSteps
{
    [AbpAuthorize(PermissionNames.SystemProcedure)]
    public class ProcedureStepAppService : ManufactureSysAppServiceBase<ProcedureStep, ProcedureStepDto, Guid,
        Guid, CreateProcedureStepInput, ProcedureStepDto>
    {
        private readonly ProcedureManager _procedureManager;
        private readonly TaskItemManager _taskItemManager;

        public ProcedureStepAppService(
            IRepository<ProcedureStep, Guid> repositoryProcedureStep,
            ProcedureManager procedureManager, TaskItemManager taskItemManager): base(repositoryProcedureStep)
        {
            _procedureManager = procedureManager;
            _taskItemManager = taskItemManager;
        }
        /// <summary>
        /// 根据ProcedureId取得每道工序，不分页数据
        /// </summary>
        /// <param name="procedureId"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<ProcedureStepDto>> GetAll(Guid procedureId)
        {
            CheckGetAllPermission();
            var query = Repository.GetAll().Where(p => p.ProcedureId == procedureId).OrderBy(v => v.Priority);
            return await GetAllAsyncByQueryFilter(query);
        }
        /// <summary>
        /// 创建一道工序/日常任务类别
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ProcedureStepDto> Create(CreateProcedureStepInput input)
        {
            CheckCreatePermission();
            // 如果procedureId没有值则是日常任务分类创建
            if (!input.ProcedureId.HasValue)
                return MapToEntityDto(await _procedureManager.CreateRoutineCategory(MapToEntity(input)));
            // 先插入取得实体，即id
            var entity = await _procedureManager.CreateOrUpdateProcedureStepAsync(MapToEntity(input));
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 更新一道工序
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ProcedureStepDto> Update(ProcedureStepDto input)
        {
            var entity = await GetEntityByIdAsync(input.Id);
            MapToEntity(input, entity);
            entity = await _procedureManager.CreateOrUpdateProcedureStepAsync(entity);
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 删除接口
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override Task Delete(EntityDto<Guid> input)
        {
            _taskItemManager.CheckProcedureStepOccupation(input.Id);
            return base.Delete(input);
        }
        /// <summary>
        /// 获取日常任务分类
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepDto>> GetAllRoutineCategory()
        {
            CheckGetAllPermission();
            var procedure = _procedureManager.GetAll().FirstOrDefault(v => v.IsRoutine);
            // 如果为空则返回一个空的对象
            if (procedure == null) return new PagedResultDto<ProcedureStepDto>();
            var query = Repository.GetAll().Where(p => p.ProcedureId == procedure.Id);
            return await GetAllAsyncByQueryFilter(query);
        }
    }
}