using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.Notifications;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Pedestals.Dto;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.Production.Dto;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.SubProjectStageLogs.Dto;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Production
{
    [AbpAuthorize(PermissionNames.ProductionManagement)]
    public class ProductionAppService : ManufactureSysAppServiceBase
    {
        private readonly PedestalManager _pedestalManager;
        private readonly MessageManager _messageManager;
        private readonly TaskItemManager _taskItemManager;
        private readonly NotificationManager _notificationManager;
        private readonly SubProjectManager _subProjectManager;
        private readonly TaskItemAssignmentManager _taskItemAssignmentManager;
        private readonly IRepository<SubProjectStageLog, Guid> _repositorySubLog;

        public ProductionAppService(
            PedestalManager pedestalManager,
            TaskItemManager taskItemManager, NotificationManager notificationManager,
            SubProjectManager subProjectManager, TaskItemAssignmentManager taskItemAssignmentManager,
            MessageManager messageManager, IRepository<SubProjectStageLog, Guid> repositorySubLog)
        {
            _pedestalManager = pedestalManager;
            _taskItemManager = taskItemManager;
            _notificationManager = notificationManager;
            _subProjectManager = subProjectManager;
            _taskItemAssignmentManager = taskItemAssignmentManager;
            _messageManager = messageManager;
            _repositorySubLog = repositorySubLog;
        }

        /// <summary>
        /// 获得所有未分配工作台的项目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<SubProjectDto>> GetAllUnbinding(GetAllProductionUnbindingInput input)
        {
            var query = _subProjectManager.GetAll()
                .WhereIf(input.ProjectId.HasValue, v => v.ProjectId == input.ProjectId)
                .Include(v => v.Pedestal)
                .Where(v => v.Pedestal == null || SubProjectManager.IsCurrentStepFinished(v));
            return await GetAllAsyncByQueryFilter<SubProjectDto, SubProject>(query);
        }

        /// <summary>
        /// 获得所有正在处理中的子项目，附带台座信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<SubProjectDto>> GetAllInProcessing(GetAllProductionBase input)
        {
            var query = _subProjectManager.GetAll().Include(v => v.Pedestal)
                .WhereIf(input.ProjectId.HasValue, v => v.ProjectId == input.ProjectId)
                .Where(v => v.Pedestal != null && !SubProjectManager.IsCurrentStepFinished(v));
            var totalCount = await query.CountAsync();
            var entities = await query.ToListAsync();
            // 需要添加台座信息，所以不能直接用父类方法
            return new PagedResultDto<SubProjectDto>(
                totalCount, entities.Select(v =>
                {
                    var subProject = v.MapTo<SubProjectDto>();
                    subProject.PedestalDto = v.Pedestal.MapTo<PedestalDto>();
                    return subProject;
                }).ToList()
            );
        }

        /// <summary>
        /// 取得此子项目含有的工作项
        /// 生产2
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureStepTaskItemDto>> GetTaskItemsBySubProject(Guid subProjectId)
        {
            var query = await _taskItemManager.GetTaskItemsUnAssigned(subProjectId);
            var list = query.Select(v => v.MapTo<ProcedureStepTaskItemDto>());
            return new PagedResultDto<ProcedureStepTaskItemDto>(list.Count(), list.ToList());
        }

        /// <summary>
        /// 分派多个任务
        /// 生产2
        /// </summary>
        /// <param name="inputs"></param>
        /// <returns></returns>
        public async Task CreateAssignments(CreateTaskItemAssignmentInput[] inputs)
        {
            foreach (var input in inputs)
            {
                var entity = input.MapTo<TaskItemAssignment>();
                // 添加RootAssignmentId表示根任务
                entity.Id = Guid.NewGuid();
                entity.RootAssignmentId = entity.Id;
                await _taskItemAssignmentManager.InsertAsync(entity);
                // 保存触发自动填入创建人，创建时间等
                CurrentUnitOfWork.SaveChanges();
                // 通知分派对象
                var linkUrl = MessageLinkUrlsInfo.TaskItemAssignmentPrefix + entity.Id;
                await _notificationManager.SendAssignmentNotification(input.UserId, input.TaskItemId);
                await _messageManager.SendMessage(new MessageLog
                {
                    Content = MessageLinkUrlsInfo.TaskItemAssignmentContent,
                    ReceiverUserId = input.UserId,
                    CreatorUserId = GetSessionUserId(),
                    TenantId = AbpSession.TenantId,
                    LinkUrl = linkUrl
                });
                CurrentUnitOfWork.SaveChanges();
            }

            // 更新是否完成所有分派的字段
            if (!inputs[0].SubProjectId.HasValue) return;
            var num = await _taskItemManager.GetTaskItemsUnAssigned((Guid) inputs[0].SubProjectId);
            await _subProjectManager.UpdateSupProjectIsAssigned((Guid) inputs[0].SubProjectId, num.Count());
        }

        /// <summary>
        /// 获取已完成的构件
        /// 生产3
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<SubProjectDto>> GetAllInFinished(GetAllProductionBase input)
        {
            var query = _subProjectManager.GetAll()
                .WhereIf(input.ProjectId.HasValue, v => v.ProjectId == input.ProjectId)
                .Where(v => v.IsFinished && !v.OffPedestalTime.HasValue);
            return await GetAllPagedByQueryFilter<SubProjectDto, SubProject, Guid>(query, input);
        }

        /// <summary>
        /// 自动离开台座
        /// 生产3
        /// </summary>
        /// <param name="subProjectIds"></param>
        /// <returns></returns>
        public async Task AutoLeavePedestal(Guid[] subProjectIds)
        {
            await _pedestalManager.AutoLeavePedestal(subProjectIds);
        }

        /// <summary>
        /// 手动离开台座
        /// 生产3
        /// </summary>
        /// <param name="pedestalId"></param>
        /// <returns></returns>
        public async Task LeavePedestal(Guid pedestalId)
        {
            await _pedestalManager.LeavePedestal(pedestalId);
        }
        /// <summary>
        /// 获取构件的状态更改信息
        /// 生产1
        /// </summary>
        /// <param name="sugProjectId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<SubProjectStageLogDto>> GetSubProjectStageLog(Guid sugProjectId)
        {
            var logs = _repositorySubLog.GetAll().Where(v => v.SubProjectId == sugProjectId)
                .Include(v => v.Pedestal).Include(v => v.CreatorUser);
            return new PagedResultDto<SubProjectStageLogDto>(await logs.CountAsync(),
                await logs.Select(v => v.MapTo<SubProjectStageLogDto>()).ToListAsync());
        }
/*
        /// <summary>
        /// 获取项目台座的布局信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public virtual async Task<WorkshopLayoutDto> GetWorkshopLayout(EntityDto<Guid> input)
        {
            var entity = await _workshopLayoutManager.Get(input.Id);
            return entity.MapTo<WorkshopLayoutDto>();
        }
*/

//        public Task Test()
//        {
//            using (var unit = _unitOfWorkManager.Begin(new UnitOfWorkOptions {Timeout = new TimeSpan(0, 0, 30, 0)}))
//            {
//                
//            }
//
//            Task.Run(Test);
//        }
    }
}