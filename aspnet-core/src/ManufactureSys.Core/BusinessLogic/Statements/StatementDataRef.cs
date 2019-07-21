using System;
using Abp.Domain.Entities;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.Statements
{
    /// <summary>
    /// 使用ProcedureStepTaskItemId和构件Id可以定位一个任务
    /// </summary>
    public class StatementDataRef: Entity<Guid>
    {
        public Guid FileItemId { get; set; }
        public FileItem FileItem { get; set; }
        public Guid ProcedureStepTaskItemId { get; set; }
        public ProcedureStepTaskItem ProcedureStepTaskItem { get; set; }
    }
}
