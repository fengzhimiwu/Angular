using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Inventories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ManufactureSys.BusinessLogic.Examinations
{
    public class ExaminationManager : ManufactureSysDomainServiceBase<ExaminationReport, Guid>
    {
        private readonly IRepository<Inventory, Guid> _repositoryInventory;
        private readonly IRepository<FileItem, Guid> _repositoryFileItem;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ExaminationManager(IRepository<ExaminationReport, Guid> repositoryInspectionReport,
            IRepository<Inventory, Guid> repositoryInventory, IRepository<FileItem, Guid> repositoryFileItem,
            IHostingEnvironment hostingEnvironment) : base(repositoryInspectionReport)
        {
            _repositoryInventory = repositoryInventory;
            _repositoryFileItem = repositoryFileItem;
            _hostingEnvironment = hostingEnvironment;
        }
        /// <summary>
        /// 送检操作
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<ExaminationReport> SendToExamination(ExaminationReport input)
        {
            // 增加已检验的数量
            var inventory = await _repositoryInventory.GetAsync(input.InventoryId);
            inventory.CheckedSample += input.SampleAmount;
            await _repositoryInventory.UpdateAsync(inventory);
            // 插入检验表
            return await InsertAsync(input);;
        }
    }
}