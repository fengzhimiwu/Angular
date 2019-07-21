using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Devices.Dto;
using ManufactureSys.Net.DtoBase;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Devices
{
    [AbpAuthorize(PermissionNames.MaterialDevices)]
    public class DeviceAppService : ManufactureSysAppServiceBase<Device, DeviceDto, Guid,
        GetAllSearchInputBase, CreateDeviceInput, DeviceDto>
    {
        private readonly DeviceManager _deviceManager;

        public DeviceAppService(
            IRepository<Device, Guid> repositoryDevice, DeviceManager deviceManager) : base(repositoryDevice)
        {
            _deviceManager = deviceManager;
        }

        /// <summary>
        /// 获取全部并加搜索功能：编号、名字、类别
        /// </summary>
        /// <param name="searchInput"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<DeviceDto>> GetAll(GetAllSearchInputBase searchInput)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(searchInput).WhereIf(!searchInput.Keywords.IsNullOrWhiteSpace(), v =>
                    v.Id.ToString().Contains(searchInput.Keywords) || v.Name.Contains(searchInput.Keywords) ||
                    v.Category.Contains(searchInput.Keywords));
            return await GetAllPagedByQueryFilter(query, searchInput);
        }

        /// <summary>
        /// 创建设备
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<DeviceDto> Create(CreateDeviceInput input)
        {
            CheckCreatePermission();
            var entity = MapToEntity(input);
            entity.TenantId = CurrentUnitOfWork.GetTenantId();
            await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }

        /// <summary>
        /// 使用一次设备
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<DeviceDto> UseDeviceOnce(Guid deviceId)
        {
            return MapToEntityDto(await _deviceManager.UseDeviceOnce(deviceId));
        }
    }
}