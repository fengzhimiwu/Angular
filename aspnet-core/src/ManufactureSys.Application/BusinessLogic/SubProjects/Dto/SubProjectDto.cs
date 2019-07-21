using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.Pedestals.Dto;

namespace ManufactureSys.BusinessLogic.SubProjects.Dto
{
    /// <summary>
    /// 子项目
    /// </summary>
    [AutoMap(typeof(SubProject))]
    public class SubProjectDto : EntityDto<Guid>
    {
        public virtual Guid ProjectId { get; set; }
        public Guid? BimModelFileItemId { get; set; }
        /// <summary>
        /// 子项目编码（梁片编码） ----  系统内部按某种规则定义的一种编码
        /// </summary>
        public string Code { get; set; }
        public int BatchNum { get; set; }
        /// <summary>
        /// 该片梁对应 BIM 模型上 的ID ，通过此 编码，可以定位到 BIM 模型--- 
        /// </summary>
        public int BimModelDbId { get; set; }
        /// <summary>
        /// 该片梁对应 BIM 模型上 的编码 ，通过此 编码，可以定位到 BIM 模型--- 
        /// </summary>
        public string BimCode { get; set; }
        public virtual string Description { get; set; }
        public Guid? ProcedureId { get; set; }
        public virtual Guid? WorkshopId { get; set; }
        public PedestalDto PedestalDto { get; set; }
        public string StageCode { get; set; }
        public bool IsFinished { get; set; }
        public DateTime EstimatedFinishedTime { get; set; }
        public DateTime CreationTime { get; set; }

        /// <summary>
        /// 梁片类别： T梁、 30米T梁、  24米T梁 等  ---- 此类别应该定义到 Settings 表中去
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// 每片梁，都对应一个二维码
        /// </summary>
        public string QrCodeFileId { get; set; }

    }
}
