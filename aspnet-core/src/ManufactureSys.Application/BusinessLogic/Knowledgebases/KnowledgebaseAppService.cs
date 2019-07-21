using System;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.Knowledgebases.Dto;
//using ManufactureSys.Entities;

namespace ManufactureSys.BusinessLogic.Knowledgebases
{
    /// <summary>
    ///   
    /// </summary>
    /// <remarks>
    ///     2018-08-31: 创建。 fzh <br/>   
    /// </remarks>

    public class KnowledgeBaseAppService : AsyncCrudAppService<KnowledgeBase, KnowledgebaseDto, Guid,
                     PagedResultRequestDto, CreateKnowledgebaseDto, KnowledgebaseDto>, IKnowledgebaseAppService
    {
        private readonly IRepository<KnowledgeBase, Guid> _knowledgeBaseRepository;

        public KnowledgeBaseAppService(IRepository<KnowledgeBase, Guid> knowledgeBaseRepository)
             : base(knowledgeBaseRepository)
        {
            _knowledgeBaseRepository = knowledgeBaseRepository;
        }


    }
}
