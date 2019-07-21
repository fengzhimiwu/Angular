using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.UI;
using ManufactureSys.BusinessLogic.SubProjects;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Pedestals
{
    public class PedestalManager : ManufactureSysDomainServiceBase<Pedestal, Guid>
    {
        private readonly IRepository<SubProject, Guid> _repositorySubProject;
        private readonly IRepository<SubProjectStageLog, Guid> _repositorySPSL;

        public PedestalManager(
            IRepository<Pedestal, Guid> repository, IRepository<SubProject, Guid> repositorySubProject, IRepository<SubProjectStageLog, Guid> repositorySpsl) : base(
            repository)
        {
            _repositorySubProject = repositorySubProject;
            _repositorySPSL = repositorySpsl;
        }
        /// <summary>
        /// 检查台座是否被占用
        /// </summary>
        /// <param name="pedestalId"></param>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        public async Task CheckOccupation(Guid pedestalId, Guid? subProjectId)
        {
            var pedestal = await Repository.GetAsync(pedestalId);
            // 数据库构件对比需要绑定的构件
            if (subProjectId.HasValue && pedestal.SubProjectId.HasValue && pedestal.SubProjectId != subProjectId)
                throw new UserFriendlyException("台座被占用，无法绑定");
        }
        /// <summary>
        /// 检查构件有没有资格上该台座
        /// </summary>
        /// <param name="pedestal"></param>
        /// <param name="subProject"></param>
        /// <returns></returns>
        public async Task QualifyToPedestal(Pedestal pedestal, SubProject subProject)
        {
            var query = _repositorySPSL.GetAll().Where(v => v.SubProject.Id == subProject.Id)
                .Include(v => v.Pedestal).Select(v => v.Pedestal.Type);
            if (pedestal.Type == "CL")
            {
                if (!await query.ContainsAsync("GJ"))
                {
                    throw new UserFriendlyException("该构件还未上够钢筋绑扎台");
                }
                if (!await query.ContainsAsync("ZL"))
                {
                    throw new UserFriendlyException("该构件还未上过制梁台");
                }
            }
        }
        /// <summary>
        /// 删除之前台座上的构件
        /// </summary>
        /// <param name="subProject"></param>
        /// <returns></returns>
        public async Task<Pedestal> DeleteSubProjectInPedestal(SubProject subProject)
        {
            if (subProject.Pedestal == null)
                return null;
            // 删除台座原有的构件，已绑定新台座
            subProject.Pedestal = await Repository.GetAll().FirstOrDefaultAsync(v => v.SubProjectId == subProject.Id);
            var pedestal = await GetAsync(subProject.Pedestal.Id);
            pedestal.SubProjectId = null;
            pedestal.SubProject = null;
            return await Repository.UpdateAsync(pedestal);
        }

        /// <summary>
        /// 自动离开台座
        /// </summary>
        /// <param name="subProjectIds"></param>
        /// <returns></returns>
        public async Task AutoLeavePedestal(Guid[] subProjectIds)
        {
            var pedestalIds = Repository.GetAll()
                .Where(v => v.SubProjectId.HasValue && subProjectIds.Contains((Guid) v.SubProjectId))
                .Select(v => v.Id);
            // 遍历符合条件的台座
            foreach (var id in pedestalIds)
            {
                await LeavePedestal(id);
            }
        }

        /// <summary>
        /// 离开台座，如果不在存梁台上就不能删除
        /// </summary>
        /// <param name="pedestalId"></param>
        /// <returns></returns>
        public async Task<Pedestal> LeavePedestal(Guid pedestalId)
        {
            var pedestal = await GetAsync(pedestalId);
            // 更新构件
            if (pedestal.SubProjectId.HasValue)
            {
                var subProject = await _repositorySubProject.GetAsync((Guid)pedestal.SubProjectId);
                // 如果完成了，则记录事件，并判断是否在存梁台上；否则重置状态
                if (subProject.IsFinished)
                {
                    subProject.OffPedestalTime = DateTime.Now;
                    // 0.9.3判断是否在存梁台上
                    if (pedestal.Type != "CL")
                        throw new UserFriendlyException("梁片只能从存梁台离开台座，请将完成的构件移入存梁台");
                }
                else subProject.StageCode = null;
                await _repositorySubProject.UpdateAsync(subProject);
            }
            // 更新台座
            pedestal.SubProjectId = null;
            return await UpdateAsync(pedestal);
        }
    }
}