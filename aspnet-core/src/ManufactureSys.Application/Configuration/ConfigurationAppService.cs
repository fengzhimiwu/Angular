using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using ManufactureSys.Configuration.Dto;

namespace ManufactureSys.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : ManufactureSysAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
