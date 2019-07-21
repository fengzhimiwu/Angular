using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.IdentityFramework;
using Abp.Localization;
using Abp.Runtime.Session;
using ManufactureSys.Authorization;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.Authorization.Users;
using ManufactureSys.Roles.Dto;
using System;
//using ManufactureSys.Entities;
using System.Threading.Tasks;
using AutoMapper;
using Abp.Domain.Uow;
using System.Dynamic;
using System.Net.Http;
using Abp.AutoMapper;
using Abp.Dependency;
using Abp.Domain.Entities;
using Abp.Extensions;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.FileItems.Dto;
using ManufactureSys.BusinessLogic.Home.Dto;
using ManufactureSys.BusinessLogic.Projects.Dto;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.WorkshopLayouts;
using ManufactureSys.EntityFrameworkCore.Repositories;
using ManufactureSys.MultiTenancy;
using ManufactureSys.MultiTenancy.Dto;
using ManufactureSys.Users.Dto;
using Array = NPOI.HPSF.Array;

namespace ManufactureSys.BusinessLogic.Projects
{
    /// <summary>
    /// TODO 考虑公共方法对函数进行权限控制，因为可能每个人都要取得项目信息来进行下一步操作，可以考虑将项目查询移入home，也可以将权限细分
    /// </summary>
    [AbpAuthorize(PermissionNames.Project)]
    public class ProjectAppService : ManufactureSysAppServiceBase<Project, ProjectDto, Guid,
        PagedAndSortedResultRequestDto, CreateProjectInput, ProjectDto>
    {
        private readonly ProjectManager _projectManager;
        private readonly FileItemManager _fileItemManager;
        private readonly PlanManager _planManager;
        private readonly WorkshopLayoutManager _workshopLayoutManager;

        public ProjectAppService(
            IRepository<Project, Guid> projectRepository,
            FileItemManager fileItemManager,
            ProjectManager projectManager, PlanManager planManager, WorkshopLayoutManager workshopLayoutManager) : base(projectRepository)
        {
            _fileItemManager = fileItemManager;
            _projectManager = projectManager;
            _planManager = planManager;
            _workshopLayoutManager = workshopLayoutManager;
        }

        /// <summary>
        /// 获取项目列表
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<ProjectDto>> GetAll(PagedAndSortedResultRequestDto input)
        {
            CheckGetAllPermission();
            var projectIds = _projectManager.GetProjectsJoined(GetAbpSessionUserId());
            // 禁用数据筛选器
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var query = CreateFilteredQuery(input)
                .Where(v => v.TenantId == AbpSession.TenantId || projectIds.Contains(v.Id));
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            var entities = await AsyncQueryableExecuter.ToListAsync(query);

            return new PagedResultDto<ProjectDto>(
                totalCount,
                entities.Select(MapToEntityDto).ToList()
            );
        }

        /// <summary>
        /// 取得项目详情，关闭tenant筛选器
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override Task<ProjectDto> Get(EntityDto<Guid> input)
        {
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            return base.Get(input);
        }

        /// <summary>
        /// 创建项目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ProjectDto> Create(CreateProjectInput input)
        {
            CheckCreatePermission();
            var entity = MapToEntity(input);
            entity.TenantId = CurrentUnitOfWork.GetTenantId();
            // 插入并取得Id
            entity = await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 删除项目时的操作
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task Delete(EntityDto<Guid> input)
        {
            // 项目删除后，删除布局
            var project = await Repository.GetAsync(input.Id);
            await _workshopLayoutManager.DeletePedestalsByLayoutId(project.LayoutId);
            // 删除构件
            await _planManager.DeleteAsync(v => v.ProjectId == input.Id);
            await base.Delete(input);
        }

        /// <summary>
        /// 通过name取得项目
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<ProjectDto>> GetAllByName(string name)
        {
            // 取得多个项目的id
            var projectIds = _projectManager.GetProjectsJoined(GetAbpSessionUserId());
            // 关闭数据筛选器
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var query = Repository.GetAll()
                .Where(v => v.TenantId == AbpSession.TenantId || projectIds.Contains(v.Id));
            // 名字筛选
            if (!name.IsNullOrEmpty())
                query = query.Where(v => v.Name.Contains(name));
            // 限制10个
            ApplyPaging(query, new PagedAndSortedResultRequestDto
            {
                MaxResultCount = 10,
                SkipCount = 0
            });
            return await GetAllAsyncByQueryFilter(query);
        }
        /// <summary>
        /// 取得bim模型列表
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<BimModelDto>> GetAllBimModels(Guid projectId)
        {
            var list = _fileItemManager.GetAll(projectId, FileItemCategory.BimModel);
            return new PagedResultDto<BimModelDto>
            {
                TotalCount = await list.CountAsync(),
                Items = await list.Select(v => v.MapTo(new BimModelDto
                    {BimModelUrl = ProjectManager.BimModelsPath + v.FileName})).ToListAsync()
            };
        }

        /// <summary>
        /// 删除bim模型
        /// </summary>
        /// <param name="fileItemId"></param>
        /// <returns></returns>
        public async Task DeleteBimModel(Guid fileItemId)
        {
            await _projectManager.DeleteBimModel(fileItemId);
        }
        /// <summary>
        /// 获取bim模型上构件的dbid并分类
        /// </summary>
        /// <param name="bimModelFileItemId"></param>
        /// <returns></returns>
        public async Task<GetBimModelDbIdsOutput> GetBimModelDbIds(Guid bimModelFileItemId)
        {
            var query = _planManager.GetAll()
                .Where(v => v.BimModelFileItemId == bimModelFileItemId && v.BimModelDbId != null);
            return new GetBimModelDbIdsOutput
            {
                // 完成了的构件
                FinishedDbIds = await query.Where(v => v.IsFinished).Select(v => (int)v.BimModelDbId).ToArrayAsync(),
                // 无状态
                NoStateDbIds = await query.Where(v => v.StageCode.IsNullOrWhiteSpace()).Select(v => (int)v.BimModelDbId).ToArrayAsync(),
                // 正在处理的构件
                ProcessingDbIds = await query.Where(v => !v.IsFinished && !v.StageCode.IsNullOrWhiteSpace()).Select(v => (int)v.BimModelDbId).ToArrayAsync(),
                // 当前工序完成的DbId
                CurrentStepFinishedDbIds = await query.Where(v => SubProjectManager.IsCurrentStepFinished(v)).Select(v => (int)v.BimModelDbId).ToArrayAsync(),
            };
        }
    }
}