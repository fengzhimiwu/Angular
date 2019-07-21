using System.Threading.Tasks;
using Abp.Application.Editions;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ManufactureSys.MultiTenancy.Dto;

namespace ManufactureSys.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedResultRequestDto, CreateTenantDto, TenantDto>
    {
        Task<PagedResultDto<Edition>> GetEditions();
    }
}
