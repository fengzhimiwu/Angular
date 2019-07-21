using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ManufactureSys.Roles.Dto;
using ManufactureSys.Users.Dto;

namespace ManufactureSys.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();

        Task ChangeLanguage(ChangeUserLanguageDto input);
    }
}
