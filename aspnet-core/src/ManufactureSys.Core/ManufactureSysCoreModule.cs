using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Timing;
using Abp.Zero;
using Abp.Zero.Configuration;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Notifications;
using ManufactureSys.Configuration;
using ManufactureSys.Features;
using ManufactureSys.Localization;
using ManufactureSys.MultiTenancy;
using ManufactureSys.Timing;

namespace ManufactureSys
{
    [DependsOn(typeof(AbpZeroCoreModule))]
    public class ManufactureSysCoreModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Auditing.IsEnabledForAnonymousUsers = true;

            // Declare entity types
            Configuration.Modules.Zero().EntityTypes.Tenant = typeof(Tenant);
            Configuration.Modules.Zero().EntityTypes.Role = typeof(Role);
            Configuration.Modules.Zero().EntityTypes.User = typeof(User);

            ManufactureSysLocalizationConfigurer.Configure(Configuration.Localization);

            // Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = ManufactureSysConsts.MultiTenancyEnabled;

            // Configure roles
            AppRoleConfig.Configure(Configuration.Modules.Zero().RoleManagement);

            Configuration.Settings.Providers.Add<AppSettingProvider>();
            // ManufactureSys模块注册
            Configuration.Features.Providers.Add<AppFeatureProvider>();
            Configuration.Notifications.Providers.Add<ManufactureSysNotificationProvider>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ManufactureSysCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            IocManager.Resolve<AppTimes>().StartupTime = Clock.Now;
        }
    }
}
