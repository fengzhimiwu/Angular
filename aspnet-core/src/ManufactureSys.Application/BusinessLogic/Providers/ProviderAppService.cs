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
using ManufactureSys.BusinessLogic.Inventories;
using ManufactureSys.BusinessLogic.Inventories.Dto;
using ManufactureSys.BusinessLogic.Material;
using ManufactureSys.BusinessLogic.Providers.Dto;
using ManufactureSys.Net.DtoBase;

namespace ManufactureSys.BusinessLogic.Providers
{
    [AbpAuthorize(PermissionNames.MaterialProviders)]
    public class ProviderAppService : ManufactureSysAppServiceBase<Provider, ProviderDto, Guid,
        GetAllSearchInputBase, CreateProviderInput, ProviderDto>
    {
        private readonly InventoryManager _inventoryManager;

        public ProviderAppService(IRepository<Provider, Guid> repositoryMaterial, InventoryManager inventoryManager) :
            base(repositoryMaterial)
        {
            _inventoryManager = inventoryManager;
        }

        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ProviderDto> Create(CreateProviderInput input)
        {
            CheckCreatePermission();
            var entity = MapToEntity(input);
            entity.TenantId = CurrentUnitOfWork.GetTenantId();
            await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }

        /// <summary>
        /// 获取所有供应商：编号、供应商名字、类别
        /// </summary>
        /// <param name="searchInput"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<ProviderDto>> GetAll(GetAllSearchInputBase searchInput)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(searchInput).WhereIf(!searchInput.Keywords.IsNullOrWhiteSpace(), v =>
                    v.ProviderName.Contains(searchInput.Keywords) ||
                    v.Category.Contains(searchInput.Keywords));
            return await GetAllPagedByQueryFilter(query, searchInput);
        }

        /// <summary>
        /// 进货操作
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<InventoryDto> CreateInventory(CreateInventoryInput input)
        {
            var entity = await _inventoryManager.CreateInventory(input.MapTo<Inventory>());
            return entity.MapTo<InventoryDto>();
        }
    }
}