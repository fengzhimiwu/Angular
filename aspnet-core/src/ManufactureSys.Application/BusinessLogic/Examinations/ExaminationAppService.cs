using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using ManufactureSys.Authorization;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Examinations.Dto;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.Notifications;
using ManufactureSys.Net.DtoBase;
using ManufactureSys.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Examinations
{
    [AbpAuthorize(PermissionNames.MaterialExaminations)]
    public class ExaminationAppService : ManufactureSysAppServiceBase<ExaminationReport, ExaminationReportDto, Guid,
        GetAllSearchInputBase, CreateExaminationReportInput, ExaminationReportDto>
    {
        private readonly ExaminationManager _examinationManager;
        private readonly UserManager _userManager;
        private readonly NotificationManager _notificationManager;
        private readonly MessageManager _messageManager;

        public ExaminationAppService(IRepository<ExaminationReport, Guid> repositoryInspectionReport,
            ExaminationManager examinationManager, UserManager userManager, NotificationManager notificationManager, MessageManager messageManager) : base(repositoryInspectionReport)
        {
            _examinationManager = examinationManager;
            _userManager = userManager;
            _notificationManager = notificationManager;
            _messageManager = messageManager;
        }

        /// <summary>
        /// 获取所有检验项：报告编号、存库编号
        /// </summary>
        /// <param name="searchInput"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<ExaminationReportDto>> GetAll(GetAllSearchInputBase searchInput)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(searchInput).WhereIf(!searchInput.Keywords.IsNullOrWhiteSpace(), v =>
                    v.Code.Contains(searchInput.Keywords))
                .Include(v => v.Inventory)
                .ThenInclude(v => v.Provider)
                .Include(v => v.User)
                .Include(v => v.CreatorUser)
                .Include(v => v.LastModifierUser);
            return await GetAllPagedByQueryFilter(query, searchInput);
        }
        /// <summary>
        /// 获取单独一个report，把用户信息加入了进去
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ExaminationReportDto> Get(EntityDto<Guid> input)
        {
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            entity.User = await _userManager.GetUserByIdAsync(entity.UserId);
            if (entity.CreatorUserId.HasValue)
            entity.CreatorUser = await _userManager.GetUserByIdAsync((long)entity.CreatorUserId);
            return MapToEntityDto(entity);
        }

        /// <summary>
        /// 完成检验上传文件
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<ExaminationReportDto> Update(ExaminationReportDto input)
        {
            CheckUpdatePermission();
            // 更新文件和修改时间
            var entity = await _examinationManager.UpdateAsync(input.MapTo<ExaminationReport>());
            if (!entity.CreatorUserId.HasValue) return MapToEntityDto(entity);
            // 通知分派对象，发送检验完成消息
            var linkUrl = MessageLinkUrlsInfo.ExaminationReportPrefix + entity.Id;
            // 给送检的创建者发送消息和通知
            await _notificationManager.SendLinkUrlNotification((long)entity.CreatorUserId, linkUrl);
            await _messageManager.SendMessage(new MessageLog
            {
                Content = MessageLinkUrlsInfo.ExaminationReportFinishedContent,
                ReceiverUserId = (long)entity.CreatorUserId,
                CreatorUserId = GetAbpSessionUserId(),
                TenantId = AbpSession.TenantId,
                LinkUrl = linkUrl,
            });
            return MapToEntityDto(entity);
        }
    }
}