using System;
using System.ComponentModel;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace ManufactureSys.BusinessLogic.WorkshopArrangements
{
    /// <summary>
    /// 工作台类型 实体 ---  系统参数， 定义 钢筋绑扎台、 制梁台、  存梁台 及其属性   ----------- 预留
    /// </summary>
    public class WorkshopType : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }  // 公司Id， 不同公司， 工作台类别定义不一定相同
        public string Name { get; set; }    // 工作台座名称
        public string Color { get; set; }   // 不同颜色 标记 不同台座
        [DefaultValue(0)]
        public int OrderId { get; set; }    // 序号
    }
}