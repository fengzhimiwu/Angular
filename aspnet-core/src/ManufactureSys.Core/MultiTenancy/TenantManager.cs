using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Features;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.MultiTenancy;
using ManufactureSys.Authorization.Users;
using ManufactureSys.Editions;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.MultiTenancy
{
    public class TenantManager : AbpTenantManager<Tenant, User>
    {
        public TenantManager(
            IRepository<Tenant> tenantRepository, 
            IRepository<TenantFeatureSetting, long> tenantFeatureRepository, 
            EditionManager editionManager,
            IAbpZeroFeatureValueStore featureValueStore) 
            : base(
                tenantRepository, 
                tenantFeatureRepository, 
                editionManager,
                featureValueStore)
        {
        }
        /// <summary>
        /// 搜索显示名字获取Tenant不是公司用户名
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<IReadOnlyList<Tenant>> GetTenantsByName(string name)
        {
            // 不显示host用户
            var query = Tenants;//.Where(v => v.Id != 1);
            if (!name.IsNullOrEmpty())
            {
                query = query.Where(v => v.Name == name);
            }

            query = query.Take(ManufactureSysConsts.MaxResultCount);
            return await query.ToListAsync();
        }
    }
}
