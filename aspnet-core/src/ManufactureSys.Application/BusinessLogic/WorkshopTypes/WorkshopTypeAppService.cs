using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Castle.Core.Internal;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.WorkshopArrangements;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.BusinessLogic.WorkshopTypes.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.WorkshopTypes
{
    [AbpAuthorize(PermissionNames.SystemWorkshop)]
    public class WorkshopTypeAppService : ManufactureSysAppServiceBase<WorkshopType, WorkshopTypeDto, Guid, PagedResultWorkshopTypeInput,
        CreateWorkshopTypeInput, WorkshopTypeDto>, IWorkshopTypeAppService
    {
        public WorkshopTypeAppService(IRepository<WorkshopType, Guid> repository) 
            : base(repository)
        {
        }
        /// <summary>
        /// 取得所有的类型，不分页，因为比较少
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<WorkshopTypeDto>> GetAll(PagedResultWorkshopTypeInput input)
        {
            var query = CreateFilteredQuery(input);
            return await GetAllAsyncByQueryFilter(query);
        }
    }
}