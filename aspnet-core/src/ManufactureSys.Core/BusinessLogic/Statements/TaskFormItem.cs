namespace ManufactureSys.BusinessLogic.Statements
{
    public class TaskFormItem
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public TaskInputControlType Type { get; set; }
    }
    
    public enum TaskInputControlType {
        Selection,
        Checkbox,
        Number,
        Label,
        Picture,
    }
}