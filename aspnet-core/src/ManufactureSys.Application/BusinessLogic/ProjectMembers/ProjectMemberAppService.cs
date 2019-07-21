using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using ManufactureSys.Authorization;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.BusinessLogic.ProjectMembers.Dto;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.MultiTenancy;
using ManufactureSys.MultiTenancy.Dto;
using ManufactureSys.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.ProjectMembers
{
    [AbpAuthorize(PermissionNames.ProjectManagement)]
    public class ProjectMemberAppService : ManufactureSysAppServiceBase<ProjectMember, ProjectMemberDto, Guid,
        GetAllProjectMemberInput, CreateProjectMemberInput, ProjectMemberDto>
    {
        private readonly TenantManager _tenantManager;
        private readonly ProjectManager _projectManager;
        private readonly RoleManager _roleManager;

        public ProjectMemberAppService(
            IRepository<ProjectMember, Guid> repository,
            TenantManager tenantManager,
            ProjectManager projectManager, RoleManager roleManager) : base(repository)
        {
            _tenantManager = tenantManager;
            _projectManager = projectManager;
            _roleManager = roleManager;
        }

        /// <summary>
        /// 取得所有人包括已被分配项目和未被分配项目的，带有名字（角色）搜索功能
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<ProjectMemberDto>> GetAll(GetAllProjectMemberInput input)
        {
            CheckGetAllPermission();
            // 已分配项目的人员
            var query = _projectManager.GetAllMember(input.ProjectId, input.SearchParameters,
                AbpSession.TenantId);
            var list = await AsyncQueryableExecuter.ToListAsync(query);
            // 联合未分配的人
            var others = await _projectManager.GetAllMemberNotInProject(input.SearchParameters,
                query.Select(v => v.User));
            // 已分派和未分派的人进行连接
            list.AddRange(others.ToArray());
            return new PagedResultDto<ProjectMemberDto>(
                list.Count,
                list.Select(MapToEntityDto).ToList()
            );
        }

        /// <summary>
        /// 查询公司，再查询人员
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<TenantDto>> GetTenantsByName(string name)
        {
            var list = await _tenantManager.GetTenantsByName(name);
            return new PagedResultDto<TenantDto>
            {
                TotalCount = list.Count,
                Items = list.Select(v => v.MapTo<TenantDto>()).ToList()
            };
        }

        /// <summary>
        /// 自定义转对象方法，添加roleNames
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        protected override ProjectMemberDto MapToEntityDto(ProjectMember entity)
        {
            var dto = base.MapToEntityDto(entity);
            if (entity.User != null)
            {
                var roles = _roleManager.Roles.Where(r => entity.User.Roles.Any(ur => ur.RoleId == r.Id))
                    .Select(r => r.DisplayName);
                dto.User.RoleNames = roles.ToArray();
            }

            return dto;
        }
    }
}