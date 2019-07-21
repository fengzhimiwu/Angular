using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ManufactureSys.Configuration;

namespace ManufactureSys.Web.Host.Startup
{
    [DependsOn(
       typeof(ManufactureSysWebCoreModule))]
    public class ManufactureSysWebHostModule: AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public ManufactureSysWebHostModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ManufactureSysWebHostModule).GetAssembly());
        }
    }
}
