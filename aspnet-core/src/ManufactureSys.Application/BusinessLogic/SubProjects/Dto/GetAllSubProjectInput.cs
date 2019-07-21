using System;
using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.SubProjects.Dto
{
    public class GetAllSubProjectInput: PagedResultRequestDto
    {
        public Guid? ProjectId { get; set; }
        public Guid? ProcedureId { get; set; }
        public Guid? BimModelFileItemId { get; set; }
        public string SearchParam { get; set; }
        public string BimModelDbId { get; set; }
    }
}