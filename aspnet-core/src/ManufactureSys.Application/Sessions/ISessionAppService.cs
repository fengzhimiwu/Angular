using System.Threading.Tasks;
using Abp.Application.Services;
using ManufactureSys.Sessions.Dto;

namespace ManufactureSys.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
