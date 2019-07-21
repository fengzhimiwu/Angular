using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Procedures.Dto;

namespace ManufactureSys.BusinessLogic.Procedures
{
    [AbpAuthorize(PermissionNames.SystemProcedure)]
    public class ProcedureAppService : ManufactureSysAppServiceBase<Procedure, ProcedureDto, Guid, PagedResultRequestDto,
        CreateProcedureInput, ProcedureDto>, IProcedureAppService
    {
        private readonly ProcedureManager _procedureManager;
        public ProcedureAppService(
            IRepository<Procedure, Guid> repository,
            ProcedureManager procedureManager
            ): base(repository)
        {
            _procedureManager = procedureManager;
        }
        /// <summary>
        /// 获取全部工序，非日常的
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<ProcedureDto>> GetAll(PagedResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input).Where(v => !v.IsRoutine);
            return await GetAllPagedByQueryFilter(query, input);
        }

        /// 创建工序
        public override async Task<ProcedureDto> Create(CreateProcedureInput input)
        {
            CheckCreatePermission();
            var entity = MapToEntity(input);
            entity.TenantId = CurrentUnitOfWork.GetTenantId();
            await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }
        /// <summary>
        /// 通过name取得项目文件
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<ProcedureDto>> GetAllByName(string name)
        {
            var query = Repository.GetAll().Where(v => !v.IsRoutine);
            if (!name.IsNullOrEmpty())
                query = query.Where(v => v.Name.Contains(name));
            ApplyPaging(query, new PagedResultRequestDto
            {
                MaxResultCount = 10,
                SkipCount = 0
            });
            return await GetAllAsyncByQueryFilter(query);
        }
        /// 检查工序模板是否被占用
        public override Task Delete(EntityDto<Guid> input)
        {
            _procedureManager.CheckOccupation(input.Id);
            return base.Delete(input);
        }
    }
}