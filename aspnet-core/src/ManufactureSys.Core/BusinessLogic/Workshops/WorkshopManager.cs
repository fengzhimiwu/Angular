using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.WorkshopArrangements;
using Microsoft.EntityFrameworkCore;
using Nito.AsyncEx;

namespace ManufactureSys.BusinessLogic.Workshops
{
    public class WorkshopManager: DomainService
    {
        private readonly IRepository<Workshop, Guid> _repositoryWorkshop;
        private readonly IRepository<WorkshopType, Guid> _repositoryWorkshopType;
        private readonly IRepository<SubProject, Guid> _repositorySubProject;
        public WorkshopManager(
            IRepository<Workshop, Guid> repositoryWorkshop,
            IRepository<WorkshopType, Guid> repositoryWorkshopType,
            IRepository<SubProject, Guid> repositorySubProject
            )
        {
            _repositoryWorkshop = repositoryWorkshop;
            _repositoryWorkshopType = repositoryWorkshopType;
            _repositorySubProject = repositorySubProject;
        }
        public async Task<bool> AssignWorkshopAsync(Workshop workshop)
        {
            if (workshop.SubProjectId.HasValue)
            {
                workshop.SubProject = await _repositorySubProject.GetAsync((Guid)workshop.SubProjectId);
                await _repositoryWorkshop.UpdateAsync(workshop);
                return true;
            }

            throw new UserFriendlyException("必须提供子项目id");
        }

        public async Task<List<WorkshopType>> GetAllTypeNames()
        {
            return  await _repositoryWorkshopType.GetAll().ToListAsync();;
        }
    }
}