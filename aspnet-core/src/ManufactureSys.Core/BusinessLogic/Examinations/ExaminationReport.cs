using System;
using Abp.Domain.Entities.Auditing;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Inventories;

namespace ManufactureSys.BusinessLogic.Examinations
{
    public class ExaminationReport: FullAuditedEntity<Guid>
    {
        public Guid InventoryId { get; set; }
        public Inventory Inventory { get; set; }
        /// <summary>
        /// 报告号
        /// </summary>
        public string Code { get; set; }/// <summary>
        /// 送检数量
        /// </summary>
        public float SampleAmount { get; set; }
        /// <summary>
        /// 批次
        /// </summary>
        public int BatchNum { get; set; }
        /// <summary>
        /// 实验员，即接受消息的人
        /// </summary>
        public long UserId { get; set; }
        public User User {get;set;}
        /// <summary>
        /// 上传的附件
        /// </summary>
        public Guid? FileItemId { get; set; }
        public FileItem FileItem { get; set; }
        /// <summary>
        /// 描述与检验结果
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// 送检人
        /// </summary>
        public User CreatorUser { get; set; }
        /// <summary>
        /// 检验人
        /// </summary>
        public User LastModifierUser { get; set; }
        // 送检时间 CreationTime  
        // 检验时间 LastModificationTime
    }
}