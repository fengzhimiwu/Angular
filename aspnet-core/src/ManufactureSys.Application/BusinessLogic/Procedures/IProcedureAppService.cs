using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ManufactureSys.BusinessLogic.Procedures.Dto;
using ManufactureSys.BusinessLogic.ProcedureSteps.Dto;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.Procedures
{
    public interface IProcedureAppService : IAsyncCrudAppService<ProcedureDto, Guid, PagedResultRequestDto,
        CreateProcedureInput, ProcedureDto>
    {
        Task<PagedResultDto<ProcedureDto>> GetAllByName(string name);
    }
}