using Abp.Authorization;
using Abp.Localization;
using Abp.Notifications;

namespace ManufactureSys.BusinessLogic.Notifications
{
    public class ManufactureSysNotificationProvider: NotificationProvider
    {
        public override void SetNotifications(INotificationDefinitionContext context)
        {
//            permissionDependency: new SimplePermissionDependency("App.Pages.UserManagement")
            context.Manager.Add(new NotificationDefinition(NotificationNames.AssignTaskItem));
            context.Manager.Add(new NotificationDefinition(NotificationNames.LinkUrl));
        }
    }
}