using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using ManufactureSys.Authorization;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.Examinations;
using ManufactureSys.BusinessLogic.Examinations.Dto;
using ManufactureSys.BusinessLogic.Inventories.Dto;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.Notifications;
using ManufactureSys.Net.DtoBase;
using ManufactureSys.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Inventories
{
    [AbpAuthorize(PermissionNames.MaterialInventories)]
    public class InventoryAppService : ManufactureSysAppServiceBase<Inventory, InventoryDto, Guid,
        GetAllSearchInputBase, CreateInventoryInput, InventoryDto>
    {
        private readonly UserManager _userManager;
        private readonly InventoryManager _inventoryManager;
        private readonly ExaminationManager _examinationManager;
        private readonly NotificationManager _notificationManager;
        private readonly MessageManager _messageManager;

        public InventoryAppService(IRepository<Inventory, Guid> repositoryInventory, InventoryManager inventoryManager,
            ExaminationManager examinationManager, UserManager userManager, NotificationManager notificationManager,
            MessageManager messageManager) : base(repositoryInventory)
        {
            _inventoryManager = inventoryManager;
            _examinationManager = examinationManager;
            _userManager = userManager;
            _notificationManager = notificationManager;
            _messageManager = messageManager;
        }

        /// <summary>
        /// 获取所有存库信息：存库编号、供应商编号、供应商名字
        /// </summary>
        /// <param name="searchInput"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<InventoryDto>> GetAll(GetAllSearchInputBase searchInput)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(searchInput).Include(v => v.Provider)
                    .WhereIf(!searchInput.Keywords.IsNullOrWhiteSpace(), v =>
                        v.Code.Contains(searchInput.Keywords)); // || v.Provider.ProviderName.Contains(searchInput.Keywords)
            return await GetAllPagedByQueryFilter(query, searchInput);
        }

        /// <summary>
        /// 确认到货操作
        /// </summary>
        /// <param name="inventoryId"></param>
        /// <returns></returns>
        public async Task<InventoryDto> CheckMaterialArrive(Guid inventoryId)
        {
            return MapToEntityDto(await _inventoryManager.CheckMaterialArrive(inventoryId));
        }

        /// <summary>
        /// 将货物送检
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<ExaminationReportDto> SendToExamination(CreateExaminationReportInput input)
        {
            var entity = await _examinationManager.SendToExamination(input.MapTo<ExaminationReport>());
            CurrentUnitOfWork.SaveChanges();
            // 通知分派对象，发送送检消息
            var linkUrl = MessageLinkUrlsInfo.ExaminationReportPrefix + entity.Id;
            await _notificationManager.SendLinkUrlNotification(input.UserId, linkUrl);
            await _messageManager.SendMessage(new MessageLog
            {
                Content = MessageLinkUrlsInfo.ExaminationReportContent,
                ReceiverUserId = input.UserId,
                CreatorUserId = GetAbpSessionUserId(),
                TenantId = AbpSession.TenantId,
                LinkUrl = linkUrl
            });
            return entity.MapTo<ExaminationReportDto>();
        }

        /// <summary>
        /// 搜索租户中的用户，通过名字、角色名
        /// </summary>
        /// <param name="searchInput"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<UserDto>> GetUsersInTenant(GetAllSearchInputBase searchInput)
        {
            var query = _userManager.SearchUserByKeyword(_userManager.Users, searchInput.Keywords);
            return new PagedResultDto<UserDto>(await query.CountAsync(),
                await query.Select(v => v.MapTo<UserDto>()).ToListAsync());
        }
    }
}