using AutoMapper;

//using ManufactureSys.Entities;

namespace ManufactureSys.BusinessLogic.Knowledgebases.Dto
{
    public class KnowledgebaseMapProfile : Profile
    {
        public KnowledgebaseMapProfile()
        {
            CreateMap<KnowledgebaseDto, KnowledgeBase>();

            CreateMap<CreateKnowledgebaseDto, KnowledgeBase>();
        }
    }
}
