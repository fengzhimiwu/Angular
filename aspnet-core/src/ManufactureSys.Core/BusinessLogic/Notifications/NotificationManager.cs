using System;
using System.Threading.Tasks;
using Abp;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Notifications;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.TaskItems;

namespace ManufactureSys.BusinessLogic.Notifications
{
    public class NotificationManager: DomainService
    {
        private readonly INotificationPublisher _notificationPublisher;
        private readonly UserManager _userManager;
        private readonly IRepository<TaskItem, Guid> _repositoryTaskItem;

        public NotificationManager(
            INotificationPublisher notificationPublisher,
            UserManager userManager,
            IRepository<TaskItem, Guid> repositoryTaskItem
            )
        {
            _notificationPublisher = notificationPublisher;
            _userManager = userManager;
            _repositoryTaskItem = repositoryTaskItem;
        }
        /// <summary>
        /// 发送任务分派消息
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="taskItemId"></param>
        /// <param name="severity"></param>
        /// <returns></returns>
        public async Task SendAssignmentNotification(long userId, Guid taskItemId, NotificationSeverity severity = NotificationSeverity.Info)
        {
            var userIdentifier = new UserIdentifier((await _userManager.GetUserByIdAsync(userId)).TenantId, userId);
            var message = "您被分派了任务：" + _repositoryTaskItem.Get(taskItemId).Name + "。点击打开任务页面";
            await _notificationPublisher.PublishAsync(
                NotificationNames.AssignTaskItem,
                new LinkUrlMessageNotificationData(message, MessageLinkUrlsInfo.TaskItemAssignmentPrefix + taskItemId),
                severity: severity,
                userIds: new[] { userIdentifier }
            );
        }
        /// <summary>
        /// 发送其他链接消息
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="linkUrl"></param>
        /// <param name="severity"></param>
        /// <returns></returns>
        public async Task SendLinkUrlNotification(long userId, string linkUrl, NotificationSeverity severity = NotificationSeverity.Info)
        {
            var userIdentifier = new UserIdentifier((await _userManager.GetUserByIdAsync(userId)).TenantId, userId);
            await _notificationPublisher.PublishAsync(
                NotificationNames.LinkUrl,
                new LinkUrlMessageNotificationData("您有新跳转消息，点击跳转相应工作页面", linkUrl),
                severity: severity,
                userIds: new[] { userIdentifier }
            );
        }

    }
}