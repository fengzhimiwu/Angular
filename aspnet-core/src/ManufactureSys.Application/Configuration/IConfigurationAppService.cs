using System.Threading.Tasks;
using ManufactureSys.Configuration.Dto;

namespace ManufactureSys.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
