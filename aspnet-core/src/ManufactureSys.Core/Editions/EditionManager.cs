using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.Editions
{
    public class EditionManager : AbpEditionManager
    {
        public const string DefaultEditionName = "Standard";
        public const string ProductionEditionName = "Production";
        public const string SupervisionEditionName = "Supervision";

        public EditionManager(
            IRepository<Edition> editionRepository, 
            IAbpZeroFeatureValueStore featureValueStore)
            : base(
                editionRepository,
                featureValueStore)
        {
        }

        public async Task<IReadOnlyList<Edition>> GetAll()
        {
            return await Editions.Where(v => v.Id != 1).ToListAsync();
        }
    }
}
