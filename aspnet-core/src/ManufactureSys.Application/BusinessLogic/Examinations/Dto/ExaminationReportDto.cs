using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Inventories.Dto;
using ManufactureSys.Users.Dto;

namespace ManufactureSys.BusinessLogic.Examinations.Dto
{
    [AutoMap(typeof(ExaminationReport))]
    public class ExaminationReportDto: EntityDto<Guid>
    {
        public Guid InventoryId { get; set; }
        public InventoryDto Inventory { get; set; }
        public string Code { get; set; }
        /// <summary>
        /// 送检数量
        /// </summary>
        public int SampleAmount { get; set; }
        /// <summary>
        /// 批次
        /// </summary>
        public int BatchNum { get; set; }
        public long UserId { get; set; }
        public UserDto User {get;set;}
        /// <summary>
        /// 上传的附件
        /// </summary>
        public Guid? FileItemId { get; set; }
        /// <summary>
        /// 描述与检验结果
        /// </summary>
        public string Description { get; set; }
        public UserDto CreatorUser { get; set; }
        public DateTime? CreationTime { get; set; }
        public UserDto LastModifierUser { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }
}