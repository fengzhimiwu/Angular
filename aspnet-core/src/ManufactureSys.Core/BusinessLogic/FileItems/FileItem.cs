using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;
using Abp.Domain.Entities;

namespace ManufactureSys.BusinessLogic.FileItems
{
    /// <summary>
    /// 文件库 --- 可以保存 项目文件、工作项文件、 知识库文件、 BIM模型文件
    /// </summary>
    public class FileItem : CreationAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }
        public string FileName { get; set; }
        public long FileSize { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        /// <summary>
        /// 关联的 Id，但是没有关联关系，取决于 Category 的值
        /// 若是项目、BIM模型 相关的文件， 则 RelationId 是 Project 表的 Id
        /// 若是工作项的文件，则 RelationId 是 TaskItem 表的 Id
        /// 若是任务的文件，则 RelationId 是 TaskItemAssignments 表的 Id ---  TaskItemAssignments 表记录对应 subprojectid        
        /// </summary>
        public Guid? RelationalId { get; set; }
        /// <summary>
        /// 从 FileItemCategory 枚举 里面取值： Project、 TaskItem、 KnowledgeBase、 BimModel， 类别可扩充
        /// 应该将文件类型定义到 Setting  表中， 不需要关联 Id
        /// </summary>
        public FileItemCategory? Category { get; set; }
    }
}
