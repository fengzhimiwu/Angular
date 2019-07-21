using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItems;
using System;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Pedestals.Dto;
using ManufactureSys.BusinessLogic.TaskItemAssignments.Dto;
using ManufactureSys.Users.Dto;


namespace ManufactureSys.BusinessLogic.SubProjectStageLogs.Dto
{
    [AutoMap(typeof(SubProjectStageLog))]
    public class SubProjectStageLogDto : EntityDto<Guid>
    {
        public Guid SubProjectId { get; set; }
        public Guid? TaskItemAssignmentId { get; set; }
        public TaskItemAssignmentDto TaskItemAssignment { get; set; }
        public Guid? PedestalId { get; set; }
        public PedestalDto Pedestal { get; set; }
        public virtual DateTime CreationTime { get; set; }
        public virtual long? CreatorUserId { get; set; }
        public virtual UserDto CreatorUser { get; set; }
        public string StageCode { get; set; }
        // 预留
        public Guid? WorkshopId { get; set; }
    }
}
