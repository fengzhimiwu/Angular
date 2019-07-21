using System;
using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.SubProjectStageLogs.Dto
{
    public class GetAllSubProjectStageLogInput: PagedResultRequestDto
    {
        public Guid SubProjectId { get; set; }
    }
}