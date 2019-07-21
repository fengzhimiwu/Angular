using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace ManufactureSys.Controllers
{
    public abstract class ManufactureSysControllerBase: AbpController
    {
        protected ManufactureSysControllerBase()
        {
            LocalizationSourceName = ManufactureSysConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
