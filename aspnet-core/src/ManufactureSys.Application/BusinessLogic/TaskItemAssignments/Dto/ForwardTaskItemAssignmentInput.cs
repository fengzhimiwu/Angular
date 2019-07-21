using ManufactureSys.BusinessLogic.Production.Dto;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments.Dto
{
    public class ForwardTaskItemAssignmentInput
    {
        public CreateTaskItemAssignmentInput CreateTaskItemAssignmentInput { get; set; }
        public UpdateTaskItemAssignmentDto UpdateTaskItemAssignmentDto { get; set; }
    }
}