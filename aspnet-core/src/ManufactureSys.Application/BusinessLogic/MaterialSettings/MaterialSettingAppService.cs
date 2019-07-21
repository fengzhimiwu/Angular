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
using ManufactureSys.BusinessLogic.Material;
using ManufactureSys.BusinessLogic.MaterialSettings.Dto;
using ManufactureSys.BusinessLogic.Providers;
using ManufactureSys.Net.DtoBase;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.MaterialSettings
{
    /// <summary>
    /// 说明参照系统参数systemSettings
    /// </summary>
    public class MaterialSettingAppService : ManufactureSysAppServiceBase<MaterialSetting, MaterialSettingDto, Guid,
        GetAllSettingsInput, CreateMaterialSettingInput, MaterialSettingDto>
    {
        public MaterialSettingAppService(
            IRepository<MaterialSetting, Guid> repositoryMaterialSetting
        ) : base(repositoryMaterialSetting)
        {
        }

        [AbpAuthorize(PermissionNames.MaterialSettings)]
        public override Task Delete(EntityDto<Guid> input)
        {
            return base.Delete(input);
        }

        [AbpAuthorize(PermissionNames.MaterialSettings)]
        public override Task<MaterialSettingDto> Update(MaterialSettingDto input)
        {
            return base.Update(input);
        }

        [AbpAuthorize(PermissionNames.MaterialSettings)]
        public override async Task<MaterialSettingDto> Create(CreateMaterialSettingInput input)
        {
            CheckCreatePermission();
            var entity = MapToEntity(input);
            entity.TenantId = CurrentUnitOfWork.GetTenantId();
            await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 通过id获取单个setting信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.Material)]
        public override Task<MaterialSettingDto> Get(EntityDto<Guid> input)
        {
            return base.Get(input);
        }
        /// <summary>
        /// 获取材料参数
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.Material)]
        public override async Task<PagedResultDto<MaterialSettingDto>> GetAll(GetAllSettingsInput input)
        {
            CheckGetAllPermission();
            // 先筛选Key再筛选value
            var query = Repository.GetAll().Where(v => v.Key.Equals(input.Key))
                .WhereIf(!input.Value.IsNullOrWhiteSpace(), v => v.Value.Contains(input.Value));
            return await GetAllAsyncByQueryFilter(query);
        }
    }
}