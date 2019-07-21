using System;
using Abp.Domain.Entities;

namespace ManufactureSys.BusinessLogic.Knowledgebases
{
    /// <summary>
    /// 知识库实体类  --- 管理系统中的知识库
    /// </summary> 
        public class KnowledgeBase : Entity<Guid>
    {
        public virtual string Code { get; set; }
        public virtual string Title { get; set; }
        public virtual string ProjectType { get; set; }
        public virtual string Category { get; set; }
        public virtual string SubCategory { get; set; }
        public virtual string SubItemDir { get; set; }
        public virtual string Level { get; set; }
        public virtual string Content { get; set; }
        public virtual string AttachedFile { get; set; }
        public virtual string ExampleImg { get; set; }
        public virtual string ExampleVideo { get; set; }
        public virtual string Remark { get; set; }
        public virtual int CreatorUserId { get; set; }
        public virtual DateTime CreatorTime { get; set; }
        public virtual int LastModifierUserId { get; set; }
        public virtual string LastModificationTime { get; set; }
        public virtual bool IsPublic { get; set; }
        public virtual bool IsActive { get; set; }

    }
}
