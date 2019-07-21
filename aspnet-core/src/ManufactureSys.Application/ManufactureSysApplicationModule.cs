using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ManufactureSys.Authorization;

namespace ManufactureSys
{
    [DependsOn(
        typeof(ManufactureSysCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class ManufactureSysApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<ManufactureSysAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(ManufactureSysApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddProfiles(thisAssembly)
            );
        }
    }
}
