using Abp.Notifications;

namespace ManufactureSys.BusinessLogic.Notifications
{
    public class LinkUrlMessageNotificationData: MessageNotificationData
    {
        public string LinkUrl { get; set; }
        public LinkUrlMessageNotificationData(string message, string linkUrl): base(message)
        {
            Message = message;
            LinkUrl = linkUrl;
        }
    }
}