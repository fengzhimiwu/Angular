using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.UI.Inputs;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Home.Dto;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Home
{
    /// <summary>
    /// 首页服务，不做任何验证，应该设置一个首页权限，所有人默认选中
    /// </summary>
    public class HomeAppService: ManufactureSysAppServiceBase
    {
        private readonly IRepository<MessageLog, Guid> _repositoryMessageLog;
        private readonly PlanManager _planManager;
        private readonly TaskItemAssignmentManager _taskItemAssignmentManager;
        private readonly UserManager _userManager;


        public HomeAppService(IRepository<MessageLog, Guid> repositoryMessageLog, PlanManager planManager, TaskItemAssignmentManager taskItemAssignmentManager, UserManager userManager)
        {
            _repositoryMessageLog = repositoryMessageLog;
            _planManager = planManager;
            _taskItemAssignmentManager = taskItemAssignmentManager;
            _userManager = userManager;
        }
        /// <summary>
        /// 获取项目构件处于不同状态的个数
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public async Task<GetDashboardInfoOutput> GetDashboardInfo(Guid projectId)
        {
            var query = _planManager.GetAll().Where(v => v.ProjectId == projectId);
            return new GetDashboardInfoOutput
            {
                // 完成，且没离开台座的
                FinishedCount = await query.Where(v => v.IsFinished && !v.OffPedestalTime.HasValue).CountAsync(),
                // 状态码为空
                NoStateCount = await query.Where(v => v.StageCode.IsNullOrWhiteSpace()).CountAsync(),
                // 如果"未完成"且"状态码"不为空
                ProcessingCount = await query.Where(v => !v.IsFinished && !v.StageCode.IsNullOrWhiteSpace()).CountAsync(),
                // 如果"离开台座时间"有值
                OffStateCount = await query.Where(v => v.OffPedestalTime.HasValue).CountAsync(),
                // 估计时间小于当前时间
                PlanProgressCount = await query.CountAsync(v => v.EstimatedFinishedTime < DateTime.Now),
                PlanTotalCount = await query.CountAsync(),
                // 当前进度时间：取所有完成的构件数，对该构件数计算预估所消耗时间
                CurrentProgress = await query.Where(v => v.IsFinished).Select(v => v.FinishingTime).OrderByDescending(v => v).FirstOrDefaultAsync(),
                CurrentPlanProgress = DateTime.Now,
                // 开始时间：顺序排取第一个
                StartedTime = await query.Select(v => v.EstimatedFinishedTime).OrderBy(v => v).FirstOrDefaultAsync(),
                // 结束时间：倒序排取第一个
                EndedTime = await query.Select(v => v.EstimatedFinishedTime).OrderByDescending(v => v).FirstOrDefaultAsync(),
            };
        }
        /// <summary>
        /// 获取首页项目的数据统计
        /// </summary>
        /// <returns></returns>
        public async Task<GetDashboardTaskOutput> GeDashboardTask()
        {
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var query = _taskItemAssignmentManager.GetAll().Where(q => q.UserId == GetSessionUserId());
            return new GetDashboardTaskOutput
            {
                MyTaskCount = await query.Where(v => !v.LastModificationTime.HasValue && !v.IsForwarded).CountAsync(),
                MyCommentCount = await query.Where(v => !v.LastModificationTime.HasValue && v.IsForwarded).CountAsync(),
                AvailableCount = 0
            };
        }
    }
}