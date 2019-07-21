using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using ManufactureSys.Authorization;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Notifications;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.Projects.Dto;
using ManufactureSys.BusinessLogic.StatementDataRefs.Dto;
using ManufactureSys.BusinessLogic.Statements;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.TaskItemAssignments.Dto;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.TaskItems.Dto;
using ManufactureSys.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments
{
    /// <summary>
    /// 任务接口
    /// </summary>
    [AbpAuthorize(PermissionNames.ProductionMyTask)]
    public class TaskItemAssignmentAppService : ManufactureSysAppServiceBase<TaskItemAssignment,
        TaskItemAssignmentDto, Guid, GetAllTaskAssignmentInput, ForwardTaskItemAssignmentInput,
        UpdateTaskItemAssignmentDto>
    {
        private readonly TaskItemManager _taskItemManager;
        private readonly ProjectManager _projectManager;
        private readonly NotificationManager _notificationManager;
        private readonly SubProjectManager _subProjectManager;
        private readonly TaskItemAssignmentManager _taskItemAssignmentManager;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly RoleManager _roleManager;
        private readonly StatementManager _statementManager;

        public TaskItemAssignmentAppService(
            IRepository<TaskItemAssignment, Guid> repositoryTaskItemAssignmentData,
            TaskItemManager taskItemManager,
            ProjectManager projectManager,
            NotificationManager notificationManager,
            SubProjectManager subProjectManager, IRepository<User, long> repositoryUser,
            TaskItemAssignmentManager taskItemAssignmentManager, RoleManager roleManager, StatementManager statementManager) : base(
            repositoryTaskItemAssignmentData)
        {
            _taskItemManager = taskItemManager;
            _projectManager = projectManager;
            _notificationManager = notificationManager;
            _subProjectManager = subProjectManager;
            _repositoryUser = repositoryUser;
            _taskItemAssignmentManager = taskItemAssignmentManager;
            _roleManager = roleManager;
            _statementManager = statementManager;
        }

        /// <summary>
        /// 取到在项目中的用户
        /// </summary>
        /// <param name="input"></param>
        /// <returns>生产，任务转发</returns>
        public async Task<PagedResultDto<UserDto>> GetUsersFromProject(GetUsersFromProjectInput input)
        {
            var query = _projectManager.GetAllMemberInProject(input.ProjectId, name: input.Name);
            return new PagedResultDto<UserDto>(
                await AsyncQueryableExecuter.CountAsync(query),
                query.Select(v => v.MapTo<UserDto>()).ToList()
            );
        }

        /// <summary>
        /// 转发任务
        /// </summary>
        /// <param name="input"></param>
        /// <returns>任务</returns>
        public override async Task<TaskItemAssignmentDto> Create(ForwardTaskItemAssignmentInput input)
        {
            CheckCreatePermission();
            // 先提交
            var entitySubmitted = await GetEntityByIdAsync(input.UpdateTaskItemAssignmentDto.Id);
            MapToEntity(input.UpdateTaskItemAssignmentDto, entitySubmitted);
            entitySubmitted = Repository.Update(entitySubmitted);
            // 为什么要先保存一遍？因为只有这样才会触发abp的自动填入各种信息，用户，租户等等
            CurrentUnitOfWork.SaveChanges();
            // 转发
            var entity = input.CreateTaskItemAssignmentInput.MapTo<TaskItemAssignment>();
            entity.IsForwarded = true;
            // 加入RootAssignmentId变成链式，rootAssignmentId确定一整个表格
            entity.RootAssignmentId = entitySubmitted.RootAssignmentId;
            await _taskItemAssignmentManager.InsertAsync(entity);
            // 所以一个unit里面有好几个保存插入操作的时候，要提前save
            CurrentUnitOfWork.SaveChanges();
            // 通知转发对象
            await _notificationManager.SendAssignmentNotification(entity.UserId, entity.TaskItemId);
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 提交表格
        /// </summary>
        /// <param name="dto"></param>
        /// <returns>任务</returns>
        public override async Task<TaskItemAssignmentDto> Update(UpdateTaskItemAssignmentDto dto)
        {
            CheckUpdatePermission();
            var entity = await GetEntityByIdAsync(dto.Id);
            MapToEntity(dto, entity);
            entity = Repository.Update(entity);
            CurrentUnitOfWork.SaveChanges();
            // 插入stageLog，转发不插入
            await _subProjectManager.ChangeStageCode(_taskItemManager.GetSubProject(entity.Id), entity);
            return MapToEntityDto(entity);
        }

        /// <summary>
        /// 获取用户成的工作列表，IsFinished为true是取完成，非转发任务；false是取未完成的所有任务
        /// PAGE:我的任务页面 已完成任务页面
        /// </summary>
        /// <param name="input">任务</param>
        /// <returns></returns>
        public override async Task<PagedResultDto<TaskItemAssignmentDto>> GetAll(GetAllTaskAssignmentInput input)
        {
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var entityList = Repository.GetAll()
                // true包含“我参与的”和“我的”，false只包含“我的”
                .Where(q => input.IsFinished
                    ? q.ParticipantIds.Contains(GetAbpSessionUserId().ToString()) || q.UserId == input.UserId
                    : q.UserId == input.UserId)
                // .Where(q => input.IsFinished ? !q.TaskFormData.IsNullOrEmpty() && !q.IsForwarded && q.LastModificationTime.HasValue: q.TaskFormData.IsNullOrEmpty() && !q.LastModificationTime.HasValue)
                // true包含“最后更改时间不为空”且“不是转发”，false只包含“最后更改时间为空的”
                .Where(q => input.IsFinished
                    ? !q.IsForwarded && q.LastModificationTime.HasValue
                    : !q.LastModificationTime.HasValue)
                .Include(v => v.TaskItem)
                .Include(v => v.SubProject)
                .Include(v => v.CreatorUser)
                .OrderByDescending(q => q.CreationTime);
            return input.IsFinished
                ? await GetAllPagedByQueryFilter(entityList, input)
                : await GetAllAsyncByQueryFilter(entityList);
        }

        /// <summary>
        /// 获取一个任务的表格包含转发记录，原来是使用的Get方法，现在直接用这个接口取链式
        /// 任务详情页面
        /// </summary>
        /// <param name="input"></param>
        /// <returns>任务</returns>
        public async Task<PagedResultDto<TaskItemAssignmentDto>> GetAssignment(EntityDto<Guid> input)
        {
            var entity = await GetEntityByIdAsync(input.Id);
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            // 关闭软删除筛选器
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.SoftDelete))
            {
                var entityList = Repository.GetAll()
                    .Where(q => q.SubProjectId == entity.SubProjectId)
                    .Where(q => q.ProcedureStepTaskItemId == entity.ProcedureStepTaskItemId)
                    // 如果subProjectId没有值，则使用RootAssignmentId筛选
                    .WhereIf(!entity.SubProjectId.HasValue, v => v.RootAssignmentId == entity.RootAssignmentId)
                    .OrderBy(q => q.CreationTime).Include(v => v.User);
                var list = entityList.Select(q => q.MapTo<TaskItemAssignmentDto>()).ToList();
                // 向第一个元素填入需要的信息
                list[0].TaskItem = (await _taskItemManager.GetAsync(entity.TaskItemId)).MapTo<TaskItemDto>();
                // 如果subProjectId为空则不进行操作 SubProjectId为空，无法继续操作
                if (entity.SubProjectId.HasValue)
                    list[0].SubProject = (await _subProjectManager.GetAsync((Guid) entity.SubProjectId))
                        .MapTo<SubProjectDto>();
                return new PagedResultDto<TaskItemAssignmentDto>(await entityList.CountAsync(), list);
            }
        }

        /// <summary>
        /// 获取合作的任务
        /// PAGE:合作任务页面
        /// </summary>
        /// <param name="input"></param>
        /// <returns>任务</returns>
        public async Task<PagedResultDto<TaskItemAssignmentDto>> GetTasksCooperated(GetAllTaskAssignmentInput input)
        {
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var entityList = Repository.GetAll() // 在“参与人员内”且“表格数据为空”
                .Where(q => q.ParticipantIds.Contains(GetAbpSessionUserId().ToString()) &&
                            q.TaskFormData.IsNullOrEmpty())
                .Include(v => v.TaskItem)
                .Include(v => v.SubProject)
                .Include(v => v.CreatorUser)
                .OrderByDescending(q => q.CreationTime);
            return await GetAllAsyncByQueryFilter(entityList);
        }

        /// <summary>
        /// 获取我发布的任务
        /// </summary>
        /// <param name="input"></param>
        /// <returns>任务</returns>
        public async Task<PagedResultDto<TaskItemAssignmentDto>> GetTaskPublished(GetAllTaskAssignmentInput input)
        {
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var entityList = Repository.GetAll() // 在“发布人员里”
                .Where(q => q.CreatorUserId == GetAbpSessionUserId())
                .Include(v => v.TaskItem)
                .Include(v => v.SubProject)
                .Include(v => v.CreatorUser)
                .OrderByDescending(q => q.CreationTime);
            return await GetAllPagedByQueryFilter(entityList, input);
        }

        /// <summary>
        /// 获取正在参与的人员
        /// PAGE:任务信息弹窗
        /// </summary>
        /// <param name="userIdsString"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<UserDto>> GetParticipants(string userIdsString)
        {
            if (userIdsString == null) return null;
            var ids = userIdsString.Split(",").Select(long.Parse);
            var query = _repositoryUser.GetAll().Where(v => ids.Contains(v.Id)).Include(u => u.Roles);
            var dtos = new List<UserDto>();
            foreach (var user in query)
            {
                var roles = _roleManager.Roles.Where(r => user.Roles.Any(ur => ur.RoleId == r.Id))
                    .Select(r => r.NormalizedName);
                var userDto = user.MapTo<UserDto>();
                userDto.RoleNames = roles.ToArray();
                dtos.Add(userDto);
            }

            return new PagedResultDto<UserDto>(await query.CountAsync(), dtos);
        }

        /// <summary>
        /// 通过任务Id来获取项目信息
        /// PAGE:转发弹窗
        /// </summary>
        /// <param name="assignmentId"></param>
        /// <returns></returns>
        public async Task<ProjectDto> GetProjectByAssignmentId(Guid assignmentId)
        {
            var assignment = await _taskItemAssignmentManager.GetAsync(assignmentId);
            // SubProjectId为空，无法继续操作
            if (!assignment.SubProjectId.HasValue) return null;
            var subProject = await _subProjectManager.GetAsync((Guid) assignment.SubProjectId);
            var project = await _projectManager.GetAsync(subProject.ProjectId);
            return project.MapTo<ProjectDto>();
        }
    }
}