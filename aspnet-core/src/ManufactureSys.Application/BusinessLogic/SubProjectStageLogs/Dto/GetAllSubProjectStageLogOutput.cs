using System.Collections.Generic;
using Abp.Application.Services.Dto;
using ManufactureSys.BusinessLogic.ProcedureStepTaskItems.Dto;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.TaskItems.Dto;

namespace ManufactureSys.BusinessLogic.SubProjectStageLogs.Dto
{
    public class GetAllSubProjectStageLogOutput
    {
        public SubProjectDto SubProject { get; set; }
        public IReadOnlyList<SubProjectStageLogDto> SubProjectStageLogs { get; set; }
        public IReadOnlyList<PtStateDto> PtsState { get; set; }
        public IReadOnlyList<int> PriorityList { get; set; }
    }
}