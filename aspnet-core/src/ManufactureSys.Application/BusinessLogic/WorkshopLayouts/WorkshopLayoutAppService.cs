using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Pedestals.Dto;
using ManufactureSys.BusinessLogic.WorkshopLayouts.Dto;
using ManufactureSys.BusinessLogic.Workshops;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Authorization;
using ManufactureSys.Authorization;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts
{
    // 为了精确控制，必须在方法上也加上权限控制
    [AbpAuthorize(PermissionNames.SystemWorkshop, PermissionNames.ProjectManagement, RequireAllPermissions = false)]
    public class WorkshopLayoutAppService : AsyncCrudAppService<WorkshopLayout, WorkshopLayoutDto, Guid,
        PagedResultRequestDto, WorkshopLayoutDto, WorkshopLayoutDto>, IWorkshopLayoutAppService
    {
        private readonly IRepository<Pedestal, Guid> _pedestalRepository;
        public WorkshopLayoutAppService(IRepository<WorkshopLayout, Guid> repository,
            IRepository<Pedestal, Guid> pedestalRepository)
            : base(repository)
        {
            _pedestalRepository = pedestalRepository;
        }
        [AbpAuthorize(PermissionNames.SystemWorkshop, PermissionNames.ProjectManagement, RequireAllPermissions = false)]
        public override Task<PagedResultDto<WorkshopLayoutDto>> GetAll(PagedResultRequestDto input)
        {
            return base.GetAll(input);
        }
        [AbpAuthorize(PermissionNames.SystemWorkshop, PermissionNames.ProjectManagement, RequireAllPermissions = false)]
        public override Task<WorkshopLayoutDto> Get(EntityDto<Guid> input)
        {
            return base.Get(input);
        }
        [AbpAuthorize(PermissionNames.SystemWorkshop)]
        public override Task<WorkshopLayoutDto> Update(WorkshopLayoutDto input)
        {
            return base.Update(input);
        }
        [AbpAuthorize(PermissionNames.SystemWorkshop)]
        public override Task Delete(EntityDto<Guid> input)
        {
            return base.Delete(input);
        }
        [AbpAuthorize(PermissionNames.SystemWorkshop)]
        public override Task<WorkshopLayoutDto> Create(WorkshopLayoutDto input)
        {
            return base.Create(input);
        }
        /// <summary>
        /// 生成台座，未和数据库交互
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.SystemWorkshop, PermissionNames.ProjectManagement, RequireAllPermissions = false)]
        public List<GenerateOutput> Generate(WorkshopLayoutInput input)
        {
            List<GenerateOutput> list = new List<GenerateOutput>();
            for (int i = 0; i < input.ProductionLine; i++)
            {
                #region 返回生成的布局信息
                GenerateOutput output = new GenerateOutput();
                output.ProductionLine = (i + 1).ToString();

                PedestalDto pedestalDto = new PedestalDto();
                pedestalDto.ProductionLine = i + 1;
                //如果要保存到数据库，即生成模板实例，
                if (input.IsSave)
                {
                    pedestalDto.WorkshopLayoutId = input.LayoutId;
                    pedestalDto.ProjectId = input.ProjectId;
                }
                //左部或上部制梁台
                pedestalDto.Area = "LU";
                pedestalDto.Type = "ZL";
                List<PedestalDto> LU_ZL_blocks = GenerateBlocks(pedestalDto, input.BeamPedestal, input.IsSave);
                //左部或上部存梁台
                pedestalDto.Type = "CL";
                List<PedestalDto> LU_CL_blocks = GenerateBlocks(pedestalDto, input.SaveBeam, input.IsSave);
                //左部或上部钢筋绑扎台
                pedestalDto.Type = "GJ";
                List<PedestalDto> LU_BZ_blocks = GenerateBlocks(pedestalDto, input.BindRebar, input.IsSave);

                //右部或下部制梁台
                pedestalDto.Area = "RD";
                pedestalDto.Type = "ZL";
                List<PedestalDto> RD_ZL_blocks = GenerateBlocks(pedestalDto, input.BeamPedestal, input.IsSave);
                //右部或下部存梁台
                pedestalDto.Type = "CL";
                List<PedestalDto> RD_CL_blocks = GenerateBlocks(pedestalDto, input.SaveBeam, input.IsSave);
                //右部或下部钢筋绑扎台
                pedestalDto.Type = "GJ";
                List<PedestalDto> RD_BZ_blocks = GenerateBlocks(pedestalDto, input.BindRebar, input.IsSave);

                output.LU_BeamPedestal = LU_ZL_blocks;
                output.LU_SaveBeam = LU_CL_blocks;
                output.LU_BindRebar = LU_BZ_blocks;

                output.RD_BeamPedestal = RD_ZL_blocks;
                output.RD_SaveBeam = RD_CL_blocks;
                output.RD_BindRebar = RD_BZ_blocks;

                list.Add(output);
                #endregion
            }

            return list;
        }

        /// <summary>
        /// 初始化台座编码和状态，和数据库开始交互
        /// </summary>
        /// <param name="dto"></param>
        /// <param name="number"></param>
        /// <param name="isSave"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.SystemWorkshop, PermissionNames.ProjectManagement, RequireAllPermissions = false)]
        private List<PedestalDto> GenerateBlocks(PedestalDto dto, int number, bool isSave)
        {
            var dtos = new List<PedestalDto>();
            for (int i = 1; i <= number; i++)
            {
                var pedestalDto = dto.Clone();

                pedestalDto.Code = "L" + dto.ProductionLine + "_" + dto.Area + "_" + dto.Type + "_" + i.ToString("00000"); ;

                dtos.Add(pedestalDto);
            }
            if (isSave)
            {
                foreach (var item in dtos)
                {
                    _pedestalRepository.Insert(ObjectMapper.Map<Pedestal>(item));
                }
            }

            return dtos;
        }
    }
}
