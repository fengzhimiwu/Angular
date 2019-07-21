using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.WorkshopArrangements.Dto;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.BusinessLogic.Workshops.Dto;

namespace ManufactureSys.BusinessLogic.WorkshopArrangements
{
    [AbpAuthorize(PermissionNames.SystemWorkshop)]
    public class WorkshopArrangementAppService : ManufactureSysAppServiceBase<WorkshopArrangement,
            WorkshopArrangementDto, Guid, PagedResultRequestDto, CreateWorkshopArrangementInput, WorkshopArrangementDto
        >,
        IWorkshopArrangementAppService
    {
        private readonly WorkshopArrangementManager _workshopArrangementManager;

        public WorkshopArrangementAppService(
            IRepository<WorkshopArrangement, Guid> repository,
            WorkshopArrangementManager workshopArrangementManager
        ) : base(repository)
        {
            _workshopArrangementManager = workshopArrangementManager;
        }

        public override async Task<WorkshopArrangementDto> Create(CreateWorkshopArrangementInput input)
        {
            CheckCreatePermission();
            var guid = Guid.NewGuid();
            var entity = await _workshopArrangementManager.CreateOrUpdate(
                input.FlowLines.Select(v => input.MapTo(new WorkshopArrangement
                {
                    LayoutWorkshopId = guid,
                    FlowLine = v
                })).ToList(),
                input.FlowLineLayouts.MapTo<Workshop[][]>());
            return MapToEntityDto(entity);
        }

        public override async Task<WorkshopArrangementDto> Update(WorkshopArrangementDto input)
        {
            CheckUpdatePermission();
            var entity = await _workshopArrangementManager.CreateOrUpdate(
                input.FlowLines.Select(v =>
                {
                    var arrangement = input.MapTo<WorkshopArrangement>();
                    arrangement.FlowLine = v;
                    return arrangement;
                }).ToList(),
                input.FlowLineLayouts.MapTo<Workshop[][]>());
            return MapToEntityDto(entity);
        }

        public override async Task<WorkshopArrangementDto> Get(EntityDto<Guid> input)
        {
            CheckGetPermission();
            var entity = await _workshopArrangementManager.Get(input.Id);
            var dto = MapToEntityDto(entity);
            dto.FlowLines = await _workshopArrangementManager.GetFlowLines(input.Id);
            dto.FlowLineLayouts = (await _workshopArrangementManager.GetWorkshops(input.Id)).MapTo<WorkshopDto[][]>();
            return dto;
        }

        public override async Task<PagedResultDto<WorkshopArrangementDto>> GetAll(PagedResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = _workshopArrangementManager.GetAll();
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            return await GetAllAsyncByQueryFilter(query);
        }
    }
}