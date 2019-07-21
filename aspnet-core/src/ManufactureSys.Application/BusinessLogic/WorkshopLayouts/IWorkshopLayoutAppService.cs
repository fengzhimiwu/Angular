using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ManufactureSys.BusinessLogic.WorkshopLayouts.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts
{
    public interface IWorkshopLayoutAppService : IAsyncCrudAppService<WorkshopLayoutDto, Guid,
        PagedResultRequestDto, WorkshopLayoutDto, WorkshopLayoutDto>
    {
        List<GenerateOutput> Generate(WorkshopLayoutInput input);
    }
}
