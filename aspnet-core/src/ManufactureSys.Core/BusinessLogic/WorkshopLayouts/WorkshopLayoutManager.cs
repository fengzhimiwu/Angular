using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.SubProjects;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts
{
    public class WorkshopLayoutManager : ManufactureSysDomainServiceBase
    {
        private readonly IRepository<Pedestal, Guid> _repositoryPedestal;

        public WorkshopLayoutManager(IRepository<Pedestal, Guid> repositoryPedestal)
        {
            _repositoryPedestal = repositoryPedestal;
        }
        /// <summary>
        /// 通过LayoutId删除台座实例
        /// </summary>
        /// <param name="workshopLayoutId"></param>
        /// <returns></returns>
        public async Task DeletePedestalsByLayoutId(Guid? workshopLayoutId)
        {
            await _repositoryPedestal.DeleteAsync(v => v.WorkshopLayoutId == workshopLayoutId);
        }
    }
}