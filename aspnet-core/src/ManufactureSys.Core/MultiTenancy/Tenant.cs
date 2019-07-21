using System;
using Abp.MultiTenancy;
using ManufactureSys.Authorization.Users;

namespace ManufactureSys.MultiTenancy
{
    public class Tenant : AbpTenant<User>
    {
        public Tenant()
        {            
        }

        public Tenant(string tenancyName, string name)
            : base(tenancyName, name)
        {
        }
    }
}
