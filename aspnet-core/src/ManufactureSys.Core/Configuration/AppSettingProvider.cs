﻿using System.Collections.Generic;
using Abp.Configuration;

namespace ManufactureSys.Configuration
{
    public class AppSettingProvider : SettingProvider
    {
        public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
        {
            // defaultValue: red
            return new[]
            {
                new SettingDefinition(AppSettingNames.UiTheme, "blue-grey", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User, isVisibleToClients: true)
            };
        }
    }
}
