using System;
using Abp.Domain.Entities;

namespace ManufactureSys.BusinessLogic.Material
{
    public class MaterialSetting: Entity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        public string Key { set; get; }
        public string Value { set; get; }
        public string Description { get; set; }
    }
}