using Abp.Application.Features;
using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;
using ManufactureSys.Features;

namespace ManufactureSys.Authorization
{
    public class ManufactureSysAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            var material = context.CreatePermission(PermissionNames.Material, L("材料管理"));
            material.CreateChildPermission(PermissionNames.MaterialDevices, L("设备"));
            material.CreateChildPermission(PermissionNames.MaterialProviders, L("供应商"));
            material.CreateChildPermission(PermissionNames.MaterialInventories, L("材料库存"));
            material.CreateChildPermission(PermissionNames.MaterialExaminations, L("材料检验"));
            material.CreateChildPermission(PermissionNames.MaterialSettings, L("材料参数"));
            var system = context.CreatePermission(PermissionNames.System, L("系统管理"));
            system.CreateChildPermission(PermissionNames.SystemUsers, L("用户"));
            system.CreateChildPermission(PermissionNames.SystemRoles, L("角色"));
            system.CreateChildPermission(PermissionNames.SystemTenants, L("公司"),
                multiTenancySides: MultiTenancySides.Host);
            system.CreateChildPermission(PermissionNames.SystemTaskItem, L("工作项管理"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.ProductionFeature));
            system.CreateChildPermission(PermissionNames.SystemProcedure, L("工序管理"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.ProductionFeature));
            system.CreateChildPermission(PermissionNames.SystemWorkshop, L("工作台管理"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.ProductionFeature),
                multiTenancySides: MultiTenancySides.Host);
            system.CreateChildPermission(PermissionNames.SystemStatement, L("报表模板"));
            system.CreateChildPermission(PermissionNames.SystemSetting, L("参数管理"));
            var project = context.CreatePermission(PermissionNames.Project, L("项目模块"));
            var projectManagement = project.CreateChildPermission(PermissionNames.ProjectManagement, L("项目管理"));
            projectManagement.CreateChildPermission(PermissionNames.ProjectManagementGet, L("项目查看"));
            projectManagement.CreateChildPermission(PermissionNames.ProjectManagementModify, L("项目修改"));
            project.CreateChildPermission(PermissionNames.ProjectPlan, L("项目排产计划"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.ProductionFeature));
            project.CreateChildPermission(PermissionNames.ProjectStatements, L("报表生成"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.ProductionFeature));
            project.CreateChildPermission(PermissionNames.ProjectQuality, L("质量管理"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.SupervisionFeature));
            var production = context.CreatePermission(PermissionNames.Production, L("生产模块"));
            production.CreateChildPermission(PermissionNames.ProductionMyTask, L("我的任务"));
            production.CreateChildPermission(PermissionNames.ProductionManagement, L("生产管理"),
                featureDependency: new SimpleFeatureDependency(AppFeatures.ProductionFeature));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, ManufactureSysConsts.LocalizationSourceName);
        }
    }
}