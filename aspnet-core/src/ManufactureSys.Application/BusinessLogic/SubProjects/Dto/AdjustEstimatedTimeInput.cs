using System;

namespace ManufactureSys.BusinessLogic.SubProjects.Dto
{
    public class AdjustEstimatedTimeInput: GetAllSubProjectInput
    {
        public float DelayedDay { get; set; }
    }
}