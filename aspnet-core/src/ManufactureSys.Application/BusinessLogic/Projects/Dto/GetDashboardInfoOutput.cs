namespace ManufactureSys.BusinessLogic.Projects.Dto
{
    public class GetBimModelDbIdsOutput
    {
        public int[] FinishedDbIds { get; set; }
        public int[] NoStateDbIds { get; set; }
        public int[] ProcessingDbIds { get; set; }
        public int[] CurrentStepFinishedDbIds { get; set; }
    }
}