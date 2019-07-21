using System;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.Procedures.Dto;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.TaskItems.Dto;
using ManufactureSys.EntityFrameworkCore.Repositories;
using ManufactureSys.Sessions;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.TaskItems
{
    [AbpAuthorize(PermissionNames.SystemTaskItem)]
    public class TaskItemAppService : ManufactureSysAppServiceBase<TaskItem, TaskItemDto, Guid,
        PagedResultRequestDto, CreateTaskItemInput, TaskItemDto>
    {
        private readonly IRepository<TaskItem, Guid> _repositoryTaskItem;
        private readonly TaskItemManager _taskItemManager;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;

        public TaskItemAppService(
            IRepository<TaskItem, Guid> taskItemRepository,
            TaskItemManager taskItemManager,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep
            )
            : base(taskItemRepository)
        {
            _repositoryTaskItem = taskItemRepository;
            _taskItemManager = taskItemManager;
            _repositoryProcedureStep = repositoryProcedureStep;
        }

        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<TaskItemDto> Create(CreateTaskItemInput input)
        {
            var dto = await _taskItemManager.CreateAsync(MapToEntity(input));
            return MapToEntityDto(dto);
        }
    }
}