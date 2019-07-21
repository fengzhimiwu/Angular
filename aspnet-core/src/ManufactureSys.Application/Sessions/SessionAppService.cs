using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Auditing;
using Abp.AutoMapper;
using Abp.Runtime.Session;
using Abp.UI;
using ManufactureSys.Authorization.Users;
using ManufactureSys.Sessions.Dto;
using ManufactureSys.Users.Dto;

namespace ManufactureSys.Sessions
{
    public class SessionAppService : ManufactureSysAppServiceBase, ISessionAppService
    {
        private readonly UserManager _userManager;

        public SessionAppService(UserManager userManager)
        {
            _userManager = userManager;
        }
        /// <summary>
        /// 获取当前登陆用户信息
        /// </summary>
        /// <returns></returns>
        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            var output = new GetCurrentLoginInformationsOutput
            {
                Application = new ApplicationInfoDto
                {
                    Version = AppVersionHelper.Version,
                    ReleaseDate = AppVersionHelper.ReleaseDate,
                    Features = new Dictionary<string, bool>()
                }
            };

            if (AbpSession.TenantId.HasValue)
            {
                output.Tenant = ObjectMapper.Map<TenantLoginInfoDto>(await GetCurrentTenantAsync());
            }

            if (AbpSession.UserId.HasValue)
            {
                output.User = ObjectMapper.Map<UserLoginInfoDto>(await GetCurrentUserAsync());
            }

            return output;
        }
        /// <summary>
        /// 修改当前用户密码
        /// </summary>
        /// <returns></returns>
        public async Task<bool> ChangePassword(ChangePasswordInput input)
        {
            var user = await _userManager.GetUserByIdAsync(GetSessionUserId());
            // 检查密码是否正确
            if (!await _userManager.CheckPasswordAsync(user, input.CurrentPassword)) 
                throw new UserFriendlyException("输入的当前密码错误");
            // 修改密码
            var result = await _userManager.ChangePasswordAsync(user, input.NewPassword);
            return result.Succeeded;
        }
        /// <summary>
        /// 更新当前用户信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<UserDto> UpdateCurrentUser(UpdateCurrentUserInput input)
        {

            var user = await _userManager.GetUserByIdAsync(GetSessionUserId());
            input.MapTo(user);
            CheckErrors(await _userManager.UpdateAsync(user));
            return await GetCurrentUser();
        }
        /// <summary>
        /// 获取当前用户信息
        /// </summary>
        /// <returns></returns>
        [DisableAuditing]
        public virtual async Task<UserDto> GetCurrentUser()
        {
            var entity = await _userManager.GetUserByIdAsync(GetSessionUserId());
            return entity.MapTo<UserDto>();
        }
    }
}
