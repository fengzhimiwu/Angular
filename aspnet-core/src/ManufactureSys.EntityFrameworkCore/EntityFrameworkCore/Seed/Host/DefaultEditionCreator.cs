using System.Linq;
using Microsoft.EntityFrameworkCore;
using Abp.Application.Editions;
using Abp.Application.Features;
using ManufactureSys.Editions;
using ManufactureSys.Features;

namespace ManufactureSys.EntityFrameworkCore.Seed.Host
{
    public class DefaultEditionCreator
    {
        private readonly ManufactureSysDbContext _context;

        public DefaultEditionCreator(ManufactureSysDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateEditions();
        }
//        private void CreateEditions()
//        {
//            var defaultEdition = _context.Editions.IgnoreQueryFilters().FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName);
//            if (defaultEdition == null)
//            {
//                defaultEdition = new Edition { Name = EditionManager.DefaultEditionName, DisplayName = EditionManager.DefaultEditionName };
//                _context.Editions.Add(defaultEdition);
//                _context.SaveChanges();
//                /* Add desired features to the standard edition, if wanted... */
//            }
//        }
        private void CreateEditions()
        {
            // 全功能版
            var defaultEdition = _context.Editions.IgnoreQueryFilters().FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName);
            if (defaultEdition == null)
            {
                defaultEdition = new Edition { Name = EditionManager.DefaultEditionName, DisplayName = EditionManager.DefaultEditionName };
                _context.Editions.Add(defaultEdition);
                CreateFeatureIfNotExists(defaultEdition.Id, AppFeatures.ProductionFeature, true);
                CreateFeatureIfNotExists(defaultEdition.Id, AppFeatures.SupervisionFeature, true);
            }
            // 生产版本
            var productionEdition = _context.Editions.IgnoreQueryFilters().FirstOrDefault(e => e.Name == EditionManager.ProductionEditionName);
            if (productionEdition == null)
            {
                productionEdition = new Edition { Name = EditionManager.ProductionEditionName, DisplayName = "生产管理版本" };
                _context.Editions.Add(productionEdition);
                CreateFeatureIfNotExists(productionEdition.Id, AppFeatures.ProductionFeature, true);
            }
            // 监理版本
            var supervisionEdition = _context.Editions.IgnoreQueryFilters().FirstOrDefault(e => e.Name == EditionManager.SupervisionEditionName);
            if (supervisionEdition == null)
            {
                supervisionEdition = new Edition { Name = EditionManager.SupervisionEditionName, DisplayName = "监理版本" };
                _context.Editions.Add(supervisionEdition);
                CreateFeatureIfNotExists(supervisionEdition.Id, AppFeatures.SupervisionFeature, true);
            }
            _context.SaveChanges();
        }

        private void CreateFeatureIfNotExists(int editionId, string featureName, bool isEnabled)
        {
            if (_context.EditionFeatureSettings.IgnoreQueryFilters().Any(ef => ef.EditionId == editionId && ef.Name == featureName))
            {
                return;
            }

            _context.EditionFeatureSettings.Add(new EditionFeatureSetting
            {
                Name = featureName,
                Value = isEnabled.ToString(),
                EditionId = editionId
            });
            _context.SaveChanges();
        }
    }
}
