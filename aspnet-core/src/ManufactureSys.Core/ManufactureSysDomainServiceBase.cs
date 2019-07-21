using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Runtime.Session;
using ManufactureSys.BusinessLogic.SubProjects;

namespace ManufactureSys
{
    public abstract class ManufactureSysDomainServiceBase: DomainService
    {
        
    }
    public abstract class ManufactureSysDomainServiceBase<TEntity, TPrimaryKey>: DomainService
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected IRepository<TEntity, TPrimaryKey> Repository { get; }
        protected ManufactureSysDomainServiceBase(
            IRepository<TEntity, TPrimaryKey> repository
        )
        {
            Repository = repository;
        }
        public virtual async Task<TEntity> GetAsync(TPrimaryKey input)
        {
            return await Repository.GetAsync(input);
        }
        public virtual IQueryable<TEntity> GetAll()
        {
            return Repository.GetAll();
        }
        public virtual async Task<TEntity> UpdateAsync(TEntity input)
        {
            return await Repository.UpdateAsync(input);
        }

        public virtual async Task<TEntity> InsertAsync(TEntity input)
        {
            var entity = await Repository.InsertAsync(input);
            return entity;
        }
        
        public virtual async Task DeleteAsync(TPrimaryKey input)
        {
            await Repository.DeleteAsync(input);
        }
        public virtual async Task DeleteAsync(Expression<Func<TEntity, bool>> predicate)
        {
            await Repository.DeleteAsync(predicate);
        }
        
    }
}