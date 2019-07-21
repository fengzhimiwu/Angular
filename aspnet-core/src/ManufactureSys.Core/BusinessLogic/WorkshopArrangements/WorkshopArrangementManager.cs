using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using ManufactureSys.BusinessLogic.Workshops;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.WorkshopArrangements
{
    public class WorkshopArrangementManager : DomainService
    {
        private readonly IRepository<WorkshopArrangement, Guid> _repositoryWorkshopArrangement;
        private readonly IRepository<Workshop, Guid> _repositoryWorkshop;
        private readonly IRepository<WorkshopType, Guid> _repositoryWorkshopType;

        public WorkshopArrangementManager(
            IRepository<WorkshopArrangement, Guid> repositoryWorkshopArrangement,
            IRepository<Workshop, Guid> repositoryWorkshop,
            IRepository<WorkshopType, Guid> repositoryWorkshopType
        )
        {
            _repositoryWorkshopArrangement = repositoryWorkshopArrangement;
            _repositoryWorkshop = repositoryWorkshop;
            _repositoryWorkshopType = repositoryWorkshopType;
        }

        public async Task<WorkshopArrangement> CreateOrUpdate(IReadOnlyList<WorkshopArrangement> arrangements,
            IReadOnlyList<Workshop[]> layouts)
        {
            WorkshopArrangement arrangement = null;
            for (var i = 0; i < arrangements.Count(); i++)
            {
                arrangement = await _repositoryWorkshopArrangement.InsertAsync(arrangements[i]);
                foreach (var workshop in layouts[i])
                {
                    workshop.WorkshopArrangement = arrangement;
                    workshop.WorkshopType = await _repositoryWorkshopType.GetAsync(workshop.WorkshopTypeId);
                    await _repositoryWorkshop.InsertAsync(workshop);
                }
            }

            return arrangement;
        }

        public IQueryable<WorkshopArrangement> GetAll()
        {
            var arrangements = _repositoryWorkshopArrangement.GetAll()
                .GroupBy(v => v.LayoutWorkshopId).Select(v => v.FirstOrDefault());
            return arrangements;
        }

        public async Task<WorkshopArrangement> Get(Guid layoutWorkshopId)
        {
            return await _repositoryWorkshopArrangement.GetAll()
                .FirstOrDefaultAsync(v => v.LayoutWorkshopId == layoutWorkshopId);
        }

        public async Task<string[]> GetFlowLines(Guid layoutWorkshopId)
        {
            return await _repositoryWorkshopArrangement.GetAll().Where(v => v.LayoutWorkshopId == layoutWorkshopId)
                .Select(v => v.FlowLine).ToArrayAsync();
        }

        public async Task<Workshop[][]> GetWorkshops(Guid layoutWorkshopId)
        {
            return await _repositoryWorkshopArrangement.GetAll().Where(v => v.LayoutWorkshopId == layoutWorkshopId)
                .Select(arrangement => _repositoryWorkshop.GetAll()
                    .Where(v => v.WorkshopArrangementId == arrangement.Id).ToArray()).ToArrayAsync();
        }
    }
}