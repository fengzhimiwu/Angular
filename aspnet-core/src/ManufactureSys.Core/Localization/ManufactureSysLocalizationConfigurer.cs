using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace ManufactureSys.Localization
{
    public static class ManufactureSysLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(ManufactureSysConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(ManufactureSysLocalizationConfigurer).GetAssembly(),
                        "ManufactureSys.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
