using Abp.Application.Features;
using Abp.Localization;
using Abp.UI.Inputs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ManufactureSys.Features
{
    public class AppFeatureProvider : FeatureProvider
    {
        /// <summary>
        /// 特性设置
        /// </summary>
        /// <param name="context"></param>
        public override void SetFeatures(IFeatureDefinitionContext context)
        {
            var productionFeature = context.Create(AppFeatures.ProductionFeature, "false", scope: FeatureScopes.Edition);
            var supervisionFeature = context.Create(AppFeatures.SupervisionFeature, "false", scope: FeatureScopes.Edition);
            
            var chatFeature = context.Create(
                AppFeatures.ChatFeature,
                defaultValue: "false",
                displayName: L("ChatFeature"),
                inputType: new CheckboxInputType()
            );
            chatFeature.CreateChildFeature(
                AppFeatures.TenantToTenantChatFeature,
                defaultValue: "false",
                displayName: L("TenantToTenantChatFeature"),
                inputType: new CheckboxInputType()
            );
            chatFeature.CreateChildFeature(
                AppFeatures.TenantToHostChatFeature,
                defaultValue: "false",
                displayName: L("TenantToHostChatFeature"),
                inputType: new CheckboxInputType()
            );
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, ManufactureSysConsts.LocalizationSourceName);
        }
    }
}
