using Abp.AutoMapper;
using Abp.Domain.Entities;

namespace ManufactureSys.BusinessLogic.Procedures.Dto
{
    [AutoMapTo(typeof(Procedure)), AutoMapFrom(typeof(Procedure))]
    public class CreateProcedureInput
    {
        public virtual string Name { get; set; }
    }
}