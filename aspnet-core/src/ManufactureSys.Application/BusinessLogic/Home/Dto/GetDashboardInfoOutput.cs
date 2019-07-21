using System;

namespace ManufactureSys.BusinessLogic.Home.Dto
{
    public class GetDashboardInfoOutput
    {
        // 已完成的计数
        public int FinishedCount { get; set; }
        // 未开始的计数
        public int NoStateCount { get; set; }
        // 正在处理中的计数
        public int ProcessingCount { get; set; }
        // 离开台座的计数
        public int OffStateCount { get; set; }
        // 计划进度计数
        public int PlanProgressCount { get; set; }
        // 总计划数
        public int PlanTotalCount { get; set; }
        // 开始时间
        public DateTime? StartedTime { get; set; }
        // 结束时间
        public DateTime? EndedTime { get; set; }
        // 当前进度时间
        public DateTime? CurrentProgress { get; set; }
        // 计划进度时间
        public DateTime? CurrentPlanProgress { get; set; }
    }
}