using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.Material;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Inventories
{
    public class InventoryManager: ManufactureSysDomainServiceBase<Inventory, Guid>
    {
        private readonly IRepository<Provider, Guid> _repositoryProvider;
        public InventoryManager(IRepository<Inventory, Guid> repositoryInventory, IRepository<Provider, Guid> repositoryProvider) : base(repositoryInventory)
        {
            _repositoryProvider = repositoryProvider;
        }
        /// <summary>
        /// 进库操作
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<Inventory> CreateInventory(Inventory input)
        {
            var provider = await _repositoryProvider.GetAsync(input.ProviderId);
            // 计算样本数量，四舍五入
            input.SampleTotal = provider.SampleRate * input.Amount / 100;
            // 计算本供应商的批次
            input.BatchNum = await Repository.GetAll().Where(v => v.ProviderId == input.ProviderId)
                .DefaultIfEmpty().MaxAsync(v => v.BatchNum);
            input.BatchNum += 1;
            return await Repository.InsertAsync(input);
        }
        /// <summary>
        /// 确认到货操作
        /// </summary>
        /// <param name="inventoryId"></param>
        /// <returns></returns>
        public async Task<Inventory> CheckMaterialArrive(Guid inventoryId)
        {
            var inventory = await GetAsync(inventoryId);
            inventory.IsArrival = true;
            return await UpdateAsync(inventory);
        }
    }
}