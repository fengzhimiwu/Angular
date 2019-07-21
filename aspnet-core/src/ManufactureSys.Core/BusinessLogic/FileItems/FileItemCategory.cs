namespace ManufactureSys.BusinessLogic.FileItems
{
    /// <summary>
    /// 表示文件类型，需要拿到类型的时候必须从这里面取值
    /// 千万不要有重复的值！！！如果有值被使用过，千万不要修改值！！！
    /// </summary>
    public enum FileItemCategory
    {
        Others = 0,
        Project = 1,
        TaskItem = 2,
        KnowledgeBase = 3,
        BimModel = 4,
        TaskAssignment = 5,
        Message = 6,
        UserHead = 7,
        QrCode = 8, // A single data not in database
        QrCodesZip = 9, // A single data not in database
        ProjectVideo = 10,
        StatementTemplate = 11,
        ExaminationReport = 12
    }
}