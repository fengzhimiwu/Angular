using System.ComponentModel;
using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments.Dto
{
    public class GetAllTaskAssignmentInput : PagedResultRequestDto
    {
        public long UserId { get; set; }
        [DefaultValue(false)]
        public bool IsFinished { get; set; }
    }
}
