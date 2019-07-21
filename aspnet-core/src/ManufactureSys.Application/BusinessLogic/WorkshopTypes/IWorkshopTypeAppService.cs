using System;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.BusinessLogic.Workshops.Dto;
using ManufactureSys.BusinessLogic.WorkshopTypes.Dto;

namespace ManufactureSys.BusinessLogic.WorkshopTypes
{
    public interface IWorkshopTypeAppService : IAsyncCrudAppService<WorkshopTypeDto, Guid, PagedResultWorkshopTypeInput,
        CreateWorkshopTypeInput, WorkshopTypeDto>
    {
    }
}