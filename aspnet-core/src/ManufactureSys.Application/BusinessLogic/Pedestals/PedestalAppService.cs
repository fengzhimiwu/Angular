using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.Pedestals.Dto;
using ManufactureSys.BusinessLogic.WorkshopLayouts;
using ManufactureSys.BusinessLogic.WorkshopLayouts.Dto;
using ManufactureSys.BusinessLogic.Workshops;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.UI;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.SubProjects;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Pedestals
{
    /// <summary>
    /// 公共的台座接口，在方法上面进行权限验证
    /// </summary>
    public class PedestalAppService : ManufactureSysAppServiceBase
    {
        private readonly IRepository<Pedestal, Guid> _repository;
        private readonly IRepository<WorkshopLayout, Guid> _workshopLayoutRepository;
        private readonly IWorkshopLayoutAppService _workshopLayoutAppService;
        private readonly SubProjectManager _subProjectManager;
        private readonly PedestalManager _pedestalManager;

        public PedestalAppService(IRepository<Pedestal, Guid> repository,
            IRepository<WorkshopLayout, Guid> workshopLayoutRepository,
            IWorkshopLayoutAppService workshopLayoutAppService,
            SubProjectManager subProjectManager, PedestalManager pedestalManager)
        {
            _repository = repository;
            _workshopLayoutRepository = workshopLayoutRepository;
            _workshopLayoutAppService = workshopLayoutAppService;
            _subProjectManager = subProjectManager;
            _pedestalManager = pedestalManager;
        }

        /// <summary>
        /// 根据布局和项目生成台座实例
        /// 项目布局管理
        /// </summary>
        /// <param name="input"></param>
        [AbpAuthorize(PermissionNames.ProjectManagement)]
        public void CreateByLayoutAndProject(PedestalInput input)
        {
            // 检查台座上是否有梁片，被占用报错
            if (_repository.GetAll().Where(q => q.ProjectId == input.ProjectId)
                .Include(v => v.SubProject)
                .Any(v => v.SubProject != null)) throw new UserFriendlyException("台座被占用无法切换台座");
            //如果项目存在布局实例进行删除操作，保证项目布局唯一 //q.WorkshopLayoutId == input.LayoutId
            var entity = _repository.FirstOrDefault(q => q.ProjectId == input.ProjectId);
            if (entity != null)
            {
                _repository.Delete(q => q.ProjectId == input.ProjectId);
            }

            var workshopLayoutEntity = _workshopLayoutRepository.Get(input.LayoutId);

            WorkshopLayoutInput workshopLayoutInput = new WorkshopLayoutInput();
            workshopLayoutInput.IsSave = true;
            workshopLayoutInput.LayoutId = input.LayoutId;
            workshopLayoutInput.ProjectId = input.ProjectId;

            workshopLayoutInput.ProductionLine = workshopLayoutEntity.ProductionLine;
            workshopLayoutInput.BeamPedestal = workshopLayoutEntity.BeamPedestal;
            workshopLayoutInput.SaveBeam = workshopLayoutEntity.SaveBeam;
            workshopLayoutInput.BindRebar = workshopLayoutEntity.BindRebar;
            _workshopLayoutAppService.Generate(workshopLayoutInput);
        }

        /// <summary>
        /// 根据项目和布局获取台座
        /// 生产 布局管理
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.ProductionManagement, PermissionNames.SystemWorkshop, RequireAllPermissions = false)]
        public Task<List<GenerateOutput>> GetListByLayoutAndProject(PedestalInput input)
        {
            List<GenerateOutput> generateOutputs = new List<GenerateOutput>();

            //根据布局和项目获取台座
            var pedestalList = _repository.GetAll()
                .Where(q => q.WorkshopLayoutId == input.LayoutId && q.ProjectId == input.ProjectId)
                .Include(v => v.SubProject).ToList();
            //获取生产线信息
            var productLines = pedestalList.GroupBy(q => q.ProductionLine).Select(q => q.Key);
            foreach (var item in productLines)
            {
                #region 返回布局信息

                //根据生产线过滤台座
                var tempList = pedestalList.Where(q => q.ProductionLine == item);

                GenerateOutput output = new GenerateOutput();
                output.ProductionLine = item.ToString();
                //左部或上部钢筋绑扎台
                var LU_BindRebar = tempList.Where(q => q.Type == "GJ" && q.Area == "LU").ToList();
                //左部或上部制梁台
                var LU_BeamPedestal = tempList.Where(q => q.Type == "ZL" && q.Area == "LU").ToList();
                //左部或上部存梁台
                var LU_SaveBeam = tempList.Where(q => q.Type == "CL" && q.Area == "LU").ToList();
                //右部或下部钢筋绑扎台
                var RD_BindRebar = tempList.Where(q => q.Type == "GJ" && q.Area == "RD").ToList();
                //右部或下部制梁台
                var RD_BeamPedestal = tempList.Where(q => q.Type == "ZL" && q.Area == "RD").ToList();
                //右部或下部存梁台
                var RD_SaveBeam = tempList.Where(q => q.Type == "CL" && q.Area == "RD").ToList();

                output.LU_BindRebar = ObjectMapper.Map<List<PedestalDto>>(LU_BindRebar);
                output.LU_BeamPedestal = ObjectMapper.Map<List<PedestalDto>>(LU_BeamPedestal);
                output.LU_SaveBeam = ObjectMapper.Map<List<PedestalDto>>(LU_SaveBeam);
                output.RD_BindRebar = ObjectMapper.Map<List<PedestalDto>>(RD_BindRebar);
                output.RD_BeamPedestal = ObjectMapper.Map<List<PedestalDto>>(RD_BeamPedestal);
                output.RD_SaveBeam = ObjectMapper.Map<List<PedestalDto>>(RD_SaveBeam);

                generateOutputs.Add(output);

                #endregion
            }

            return Task.FromResult(generateOutputs);
        }

        /// <summary>
        /// 绑定台座
        /// 生产
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.ProductionManagement)]
        public async Task<PedestalDto> Update(PedestalDto input)
        {
            var entity = await _repository.GetAsync(input.Id);
            if (input.SubProjectId.HasValue)
            {
                var subProject = await _subProjectManager.GetAsync((Guid) input.SubProjectId);
                // 如果梁片未完成则初始化状态码；否则插入记录表
                if (!subProject.IsFinished) await _subProjectManager.InitStageCode(subProject);
                else _subProjectManager.InsertStageLog(subProject);
                // 检查占用
                await _pedestalManager.CheckOccupation(input.Id, input.SubProjectId);
                // 删除原有台座上的梁片
                await _pedestalManager.DeleteSubProjectInPedestal(subProject);
                // 判断是否未制梁台或存梁台
                await _pedestalManager.QualifyToPedestal(entity, subProject);
            }
            else
            {
                throw new UserFriendlyException("没有子项目id");
            }
            entity = await _repository.UpdateAsync(input.MapTo(entity));
            return entity.MapTo<PedestalDto>();
        }

        /// <summary>
        /// 根据子项目Id获取台座信息
        /// 生产
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.ProductionManagement)]
        public async Task<PedestalDto> GetBySubProjectId(Guid subProjectId)
        {
            var entity = await _repository.GetAll().Where(v => v.SubProjectId == subProjectId).FirstOrDefaultAsync();
            return entity.MapTo<PedestalDto>();
        }
    }
}