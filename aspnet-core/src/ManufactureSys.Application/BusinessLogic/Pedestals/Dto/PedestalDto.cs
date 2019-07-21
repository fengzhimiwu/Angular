using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.WorkshopLayouts.Dto;
using System;
using ManufactureSys.BusinessLogic.SubProjects.Dto;

namespace ManufactureSys.BusinessLogic.Pedestals.Dto
{
    [AutoMap(typeof(Pedestal))]
    public class PedestalDto :EntityDto<Guid>
    {
        /// <summary>
        /// 编码
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 布局Id
        /// </summary>
        public Guid WorkshopLayoutId { get; set; }
        /// <summary>
        /// 所属生产线
        /// </summary>
        public int ProductionLine { get; set; }
        /// <summary>
        /// 台座类型
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 台座所属区域
        /// </summary>
        public string Area { get; set; }
        /// <summary>
        /// 所属项目Id
        /// </summary>
        public Guid ProjectId { get; set; }
        // 标记台座目前被哪个梁片占用，只记录最新的那个
        public Guid? SubProjectId { get; set; }
        public SubProjectDto SubProject { get; set; }

        public PedestalDto Clone()
        {
            return MemberwiseClone() as PedestalDto;
        }
    }
}
