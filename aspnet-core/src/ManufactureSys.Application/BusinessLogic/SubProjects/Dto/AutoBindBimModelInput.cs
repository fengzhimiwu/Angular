using System;

namespace ManufactureSys.BusinessLogic.SubProjects.Dto
{
    public class BimModelInput
    {
        public int[] BimModelIds { get; set; }
        public string SubProjectCategory { get; set; }
        public Guid ProjectId { get; set; }
    }
}