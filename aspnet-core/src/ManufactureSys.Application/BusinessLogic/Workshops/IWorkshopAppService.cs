using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.Workshops.Dto;

namespace ManufactureSys.BusinessLogic.Workshops
{
    public interface IWorkshopAppService: IAsyncCrudAppService<WorkshopDto, Guid, PagedWorkshopInput, CreateWorkshopInput, WorkshopDto,
        EntityDto<Guid>, EntityDto<Guid>>
    {
        Task<bool> AssignWorkshop(WorkshopDto workshopDto);
        Task<PagedResultDto<WorkshopDto>> GetAllByWorkshopTypeId(Guid? workshopTypeId);
        Task<PagedResultDto<WorkshopDto>> CreateWorkshops(CreateWorkshopInput input);
    }
}