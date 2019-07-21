using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.SystemSettings.Dto;
using ManufactureSys.Net.DtoBase;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.SystemSettings
{
    /// <summary>
    /// 查询是公共方法，其他的要带上权限
    /// </summary>
    public class SystemSettingAppService: ManufactureSysAppServiceBase<SystemSetting, SystemSettingDto, Guid, GetAllSettingsInput, CreateSystemSettingInput, SystemSettingDto>
    {
        public SystemSettingAppService(
            IRepository<SystemSetting, Guid> repositorySystemSetting
        ) : base(repositorySystemSetting)
        {
        }
        [AbpAuthorize(PermissionNames.SystemSetting)]
        public override Task Delete(EntityDto<Guid> input)
        {
            return base.Delete(input);
        }
        [AbpAuthorize(PermissionNames.SystemSetting)]
        public override Task<SystemSettingDto> Update(SystemSettingDto input)
        {
            return base.Update(input);
        }
        [AbpAuthorize(PermissionNames.SystemSetting)]
        public override async Task<SystemSettingDto> Create(CreateSystemSettingInput input)
        {
            CheckCreatePermission();
            var entity = MapToEntity(input);
            entity.TenantId = CurrentUnitOfWork.GetTenantId();
            await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }

        /// <summary>
        /// 获取系统参数值
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<SystemSettingDto>> GetAll(GetAllSettingsInput input)
        {
            CheckGetAllPermission();
            // 先筛选Key再筛选value
            var query = Repository.GetAll().Where(v => v.Key.Equals(input.Key))
                .WhereIf(!input.Value.IsNullOrWhiteSpace(), v => v.Value.Contains(input.Value));
            return await GetAllAsyncByQueryFilter(query);
        }
    }
}