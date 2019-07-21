using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using ManufactureSys.Authorization.Users;
using ManufactureSys.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys
{
    /// <summary>
    /// Derive your application services from this class.
    /// </summary>
    public abstract class ManufactureSysAppServiceBase : ApplicationService
    {
        public TenantManager TenantManager { get; set; }

        public UserManager UserManager { get; set; }

        protected ManufactureSysAppServiceBase()
        {
            LocalizationSourceName = ManufactureSysConsts.LocalizationSourceName;
        }
        /// <summary>
        /// 获取当前Session中的UserId
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UserFriendlyException">如果无UserId则丢出错误</exception>
        protected long GetSessionUserId()
        {
            var userId = AbpSession.UserId;
            if (userId == null)
                throw new UserFriendlyException(L("UserNotLoggedIn"));
            return (long)userId;
        }
        
        protected virtual Task<User> GetCurrentUserAsync()
        {
            var user = UserManager.FindByIdAsync(AbpSession.GetUserId().ToString());
            if (user == null)
            {
                throw new Exception("There is no current user!");
            }

            return user;
        }

        protected virtual Task<Tenant> GetCurrentTenantAsync()
        {
            return TenantManager.GetByIdAsync(AbpSession.GetTenantId());
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
        protected async Task<PagedResultDto<TDestination>> GetAllAsyncByQueryFilter<TDestination, TSource>(IQueryable<TSource> query)
        {
            var totalCount = await query.CountAsync();
            var entities = await query.ToListAsync();
            return new PagedResultDto<TDestination>(
                totalCount,
                entities.Select(v => v.MapTo<TDestination>()).ToList()
            );
        }
        
        protected async Task<PagedResultDto<TDestination>> GetAllPagedByQueryFilter<TDestination, TSource, TSourcePrimaryKey>(IQueryable<TSource> query, IPagedResultRequest input) where TSource : class, IEntity<TSourcePrimaryKey>
        {
            var totalCount = await query.CountAsync();
            query = ApplySorting<TSource, TSourcePrimaryKey>(query, input);
            query = ApplyPaging(query, input);
            var entities = await query.ToListAsync();
            return new PagedResultDto<TDestination>(
                totalCount,
                entities.Select(v => v.MapTo<TDestination>()).ToList()
            );
        }
        public IQueryable<TSource> ApplyPaging<TSource>(IQueryable<TSource> query, IPagedResultRequest input)
        {
            //Try to use paging if available
            var pagedInput = input as IPagedResultRequest;
            if (pagedInput != null)
            {
                return query.PageBy(pagedInput);
            }

            //Try to limit query result if available
            var limitedInput = input as ILimitedResultRequest;
            if (limitedInput != null)
            {
                return query.Take(limitedInput.MaxResultCount);
            }

            //No paging
            return query;
        }
        public IQueryable<TSource> ApplySorting<TSource, TSourcePrimaryKey>(IQueryable<TSource> query, IPagedResultRequest input) where TSource : class, IEntity<TSourcePrimaryKey>
        {
            //Try to sort query if available
            var sortInput = input as ISortedResultRequest;
            if (sortInput != null)
            {
                if (!sortInput.Sorting.IsNullOrWhiteSpace())
                {
                    return query.OrderBy(sortInput.Sorting);
                }
            }

            //IQueryable.Task requires sorting, so we should sort if Take will be used.
            if (input is ILimitedResultRequest)
            {
                return query.OrderByDescending(e => e.Id);
            }

            //No sorting
            return query;
        }
    }
    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto>
        : ManufactureSysAppServiceBase<TEntity, TEntityDto, int>
        where TEntity : class, IEntity<int>
        where TEntityDto : IEntityDto<int>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, int> repository)
            : base(repository)
        {
        }
    }

    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey>
        : ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, PagedAndSortedResultRequestDto>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
    }

    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput>
        : ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TEntityDto, TEntityDto>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
    }

    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput>
        : ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TCreateInput>
        where TGetAllInput : IPagedAndSortedResultRequest
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TCreateInput : IEntityDto<TPrimaryKey>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
    }

    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput,
            TUpdateInput>
        : ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TUpdateInput,
            EntityDto<TPrimaryKey>>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TUpdateInput : IEntityDto<TPrimaryKey>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
    }

    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput,
            TUpdateInput, TGetInput>
        : ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TUpdateInput,
            TGetInput, EntityDto<TPrimaryKey>>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TUpdateInput : IEntityDto<TPrimaryKey>
        where TGetInput : IEntityDto<TPrimaryKey>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
    }

    public abstract class ManufactureSysAppServiceBase<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput,
            TUpdateInput, TGetInput, TDeleteInput>
        : AsyncCrudAppService<TEntity, TEntityDto, TPrimaryKey, TGetAllInput, TCreateInput, TUpdateInput, TGetInput,
            TDeleteInput>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TUpdateInput : IEntityDto<TPrimaryKey>
        where TGetInput : IEntityDto<TPrimaryKey>
        where TDeleteInput : IEntityDto<TPrimaryKey>
    {
        protected ManufactureSysAppServiceBase(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
        /// <summary>
        /// 获取当前Session中的UserId
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UserFriendlyException">如果无UserId则丢出错误</exception>
        protected long GetAbpSessionUserId()
        {
            var userId = AbpSession.UserId;
            if (userId == null)
                throw new UserFriendlyException(L("UserNotLoggedIn"));
            return (long)userId;
        }
        /// <summary>
        /// 返回一个经过query删选过的GetAll，没有分页，没有排序
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        protected async Task<PagedResultDto<TEntityDto>> GetAllAsyncByQueryFilter(IQueryable<TEntity> query)
        {
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            var entities = await AsyncQueryableExecuter.ToListAsync(query);
            return new PagedResultDto<TEntityDto>(
                totalCount,
                entities.Select(MapToEntityDto).ToList()
            );
        }
        /// <summary>
        /// 返回经过分页的GetAll
        /// </summary>
        /// <param name="query"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        protected async Task<PagedResultDto<TEntityDto>> GetAllPagedByQueryFilter(IQueryable<TEntity> query, TGetAllInput input)
        {
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var entities = await AsyncQueryableExecuter.ToListAsync(query);
            return new PagedResultDto<TEntityDto>(
                totalCount,
                entities.Select(MapToEntityDto).ToList()
            );
        }

        private IQueryable<TSource> ApplyPaging<TSource>(IQueryable<TSource> query, TGetAllInput input)
        {
            //Try to use paging if available
            var pagedInput = input as IPagedResultRequest;
            if (pagedInput != null)
            {
                return query.PageBy(pagedInput);
            }

            //Try to limit query result if available
            var limitedInput = input as ILimitedResultRequest;
            if (limitedInput != null)
            {
                return query.Take(limitedInput.MaxResultCount);
            }

            //No paging
            return query;
        }
        private IQueryable<TSource> ApplySorting<TSource, TSourcePrimaryKey>(IQueryable<TSource> query, TGetAllInput input) where TSource : class, IEntity<TSourcePrimaryKey>
        {
            //Try to sort query if available
            var sortInput = input as ISortedResultRequest;
            if (sortInput != null)
            {
                if (!sortInput.Sorting.IsNullOrWhiteSpace())
                {
                    return query.OrderBy(sortInput.Sorting);
                }
            }

            //IQueryable.Task requires sorting, so we should sort if Take will be used.
            if (input is ILimitedResultRequest)
            {
                return query.OrderByDescending(e => e.Id);
            }

            //No sorting
            return query;
        }


        /// <summary>
        /// 返回需要转换为paged格式的列表dto，主要用于关联查询
        /// </summary>
        /// <param name="list"></param>
        /// <typeparam name="TDestination"></typeparam>
        /// <typeparam name="TSource"></typeparam>
        /// <returns></returns>
        protected async Task<PagedResultDto<TDestination>> GetAllAsyncFromList<TDestination, TSource>(IReadOnlyList<TSource> list)
        {
            return new PagedResultDto<TDestination>
            {
                TotalCount = list.Count,
                Items = list.Select(v => v.MapTo<TDestination>()).ToList()
            };
        }
    }
}
