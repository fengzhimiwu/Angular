using Abp.AutoMapper;

namespace ManufactureSys.BusinessLogic.TaskItems.Dto
{
    [AutoMapTo(typeof(TaskItem))]
    public class CreateTaskItemInput   //: IShouldNormalize
    {
        public virtual string Name { get; set; }
        public virtual string Remark { get; set; }
    }
}
