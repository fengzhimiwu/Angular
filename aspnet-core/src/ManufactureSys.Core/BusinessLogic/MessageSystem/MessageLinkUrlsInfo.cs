namespace ManufactureSys.BusinessLogic.MessageSystem
{
    public class MessageLinkUrlsInfo
    {
        // 链接消息的地址前缀
        public const string TaskItemAssignmentPrefix = "/app/production/my-task/";
        public const string ExaminationReportPrefix = "/app/material/examinations?id=";
        
        // 链接消息的内容
        public const string TaskItemAssignmentContent = "[任务]";
        public const string ExaminationReportContent = "[送检]";
        public const string ExaminationReportFinishedContent = "[化验完成]";
    }
}