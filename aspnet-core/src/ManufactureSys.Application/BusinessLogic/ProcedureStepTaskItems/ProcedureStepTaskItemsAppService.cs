using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.TaskItems.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.ProcedureStepTaskItems
{
    [AbpAuthorize(PermissionNames.SystemProcedure)]
    public class ProcedureStepTaskItemsAppService: ManufactureSysAppServiceBase<ProcedureStepTaskItem, ProcedureStepTaskItemDto, Guid, string, CreateProcedureStepTaskItemInput, ProcedureStepTaskItemDto>
    {
        private readonly TaskItemManager _taskItemManager;
        
        public ProcedureStepTaskItemsAppService(
            IRepository<ProcedureStepTaskItem, Guid> repositoryPt, TaskItemManager taskItemManager): base(repositoryPt)
        {
            _taskItemManager = taskItemManager;
        }
        /// <summary>
        /// 通过procedureStepId取得已绑定项目
        /// </summary>
        /// <param name="procedureStepId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepTaskItemDto>> GetAllByProcedureStepId(Guid procedureStepId)
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var query = Repository.GetAll().Where(p => p.ProcedureStepId == procedureStepId)
                    .Include(v => v.TaskItem);
                return await GetAllAsyncByQueryFilter(query);
            }
        }
        /// <summary>
        /// 搜索未绑定的项目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<TaskItemDto>> GetAllTaskItem(string input)
        {
            var query = _taskItemManager.GetAll().Where(t => t.Name.Contains(input));
            return new PagedResultDto<TaskItemDto>(
                await query.CountAsync(),
                await query.Select(v => v.MapTo<TaskItemDto>()).ToListAsync()
            );
        }
        /// <summary>
        /// 绑定工作项
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ProcedureStepTaskItemDto> Create(CreateProcedureStepTaskItemInput input)
        {
            // 检查占用
            _taskItemManager.CheckProcedureStepOccupation(input.ProcedureStepId);
            // 取得数量，填入排序Id
            var taskItemCount = Repository.GetAll().Count(v => v.ProcedureStepId == input.ProcedureStepId);
            var procedureStepTaskItem = new ProcedureStepTaskItem
            {
                SortId = taskItemCount + 1,
                ProcedureStepId = input.ProcedureStepId,
                TaskItemId = input.TaskItemId
            };
            // 取得一道工序，绑定工序
            var entity = await Repository.InsertAsync(procedureStepTaskItem);
            entity.TaskItem = await _taskItemManager.GetAsync(entity.TaskItemId);
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 解绑工作项
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task Delete(EntityDto<Guid> input)
        {
            // 检查是否正在被使用
            _taskItemManager.CheckPtOccupation(input.Id);
            var entity = await Repository.GetAsync(input.Id);
            // 获取SortId比当前操作对象大的数据
            var query = Repository.GetAll()
                .Where(v => v.ProcedureStepId == entity.ProcedureStepId && v.SortId > entity.SortId);
            // 修改sortId，使其SortId正常
            foreach (var one in query)
            {
                one.SortId -= 1;
                await Repository.UpdateAsync(one);
            }
            await base.Delete(input);
        }
    }
}