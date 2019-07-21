using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Workshops.Dto;

namespace ManufactureSys.BusinessLogic.Workshops
{
    [AbpAuthorize(PermissionNames.SystemWorkshop)]
    public class WorkshopAppService :
        ManufactureSysAppServiceBase<Workshop, WorkshopDto, Guid, PagedWorkshopInput, CreateWorkshopInput,
            WorkshopDto, EntityDto<Guid>, EntityDto<Guid>>, IWorkshopAppService
    {
        private readonly WorkshopManager _workshopManager;

        public WorkshopAppService(
            IRepository<Workshop, Guid> repository,
            WorkshopManager workshopManager
        ) : base(repository)
        {
            _workshopManager = workshopManager;
        }
        /// <summary>
        /// 分配工作台
        /// </summary>
        /// <param name="workshopDto"></param>
        /// <returns></returns>
        public async Task<bool> AssignWorkshop(WorkshopDto workshopDto)
        {
            return await _workshopManager.AssignWorkshopAsync(workshopDto.MapTo<Workshop>());
        }
        /// <summary>
        /// 取得同一类型的工作台
        /// </summary>
        /// <param name="workshopTypeId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<WorkshopDto>> GetAllByWorkshopTypeId(Guid? workshopTypeId)
        {
            var query = workshopTypeId.HasValue
                ? Repository.GetAll().Where(p => p.WorkshopTypeId == workshopTypeId)
                : Repository.GetAll();
            return await GetAllAsyncByQueryFilter(query);
        }
        /// <summary>
        /// 创建多个工作台
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<WorkshopDto>> CreateWorkshops(CreateWorkshopInput input)
        {
            var entity = MapToEntity(input);
            var entities = new List<Workshop>();
            for (var i = 0; i < input.NumCreating; i++)
            {
                var one = await Repository.InsertAsync(entity);
                entities.Add(one);
            }
            await CurrentUnitOfWork.SaveChangesAsync();
            return new PagedResultDto<WorkshopDto>
            {
                TotalCount = entities.Count,
                Items = entities.Select(MapToEntityDto).ToList()
            };
        }
    }
}