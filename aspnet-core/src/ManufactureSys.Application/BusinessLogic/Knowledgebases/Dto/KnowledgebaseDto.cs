using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

//using ManufactureSys.Entities;

namespace ManufactureSys.BusinessLogic.Knowledgebases.Dto
{

    /// <summary>
    ///2018-8-31: ������ fzh <br/>
    /// </summary>
    [AutoMapFrom(typeof(KnowledgeBase))]
    public class KnowledgebaseDto : EntityDto<Guid>
    {
        public virtual int TenantId { get; set; }
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
