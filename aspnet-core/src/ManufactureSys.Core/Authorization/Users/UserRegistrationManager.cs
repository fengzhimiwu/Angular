using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.IdentityFramework;
using Abp.Runtime.Session;
using Abp.UI;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.BusinessLogic.SystemSettings;
using ManufactureSys.MultiTenancy;

namespace ManufactureSys.Authorization.Users
{
    public class UserRegistrationManager : DomainService
    {
        public IAbpSession AbpSession { get; set; }

        private readonly TenantManager _tenantManager;
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<SystemSetting, Guid> _repositorySystemSetting;

        public UserRegistrationManager(
            TenantManager tenantManager,
            UserManager userManager,
            RoleManager roleManager, IRepository<SystemSetting, Guid> repositorySystemSetting)
        {
            _tenantManager = tenantManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _repositorySystemSetting = repositorySystemSetting;

            AbpSession = NullAbpSession.Instance;
        }

        public async Task<User> RegisterAsync(string name, string surname, string emailAddress, string mobileNumber, string userName, string plainPassword, bool isEmailConfirmed)
        {
            CheckForTenant();

            var tenant = await GetActiveTenantAsync();

            var user = new User
            {
                TenantId = tenant.Id,
                Name = name,
                Surname = surname,
                EmailAddress = emailAddress,
                MobileNumber = mobileNumber,
                IsActive = false, // default值true 初始注册，需要管理员审核： 授权、 激活
                UserName = userName,
                IsEmailConfirmed = isEmailConfirmed,
                Roles = new List<UserRole>()
            };

            user.SetNormalizedNames();
           
            foreach (var defaultRole in await _roleManager.Roles.Where(r => r.IsDefault).ToListAsync())
            {
                user.Roles.Add(new UserRole(tenant.Id, user.Id, defaultRole.Id));
            }

            await _userManager.InitializeOptionsAsync(tenant.Id);

            CheckErrors(await _userManager.CreateAsync(user, plainPassword));
            await CurrentUnitOfWork.SaveChangesAsync();

            return user;
        }
        /// <summary>
        /// 检查邀请码
        /// </summary>
        /// <param name="invitationCode"></param>
        /// <exception cref="UserFriendlyException"></exception>
        public void CheckInvitationCode(Guid invitationCode)
        {
            if (_repositorySystemSetting.GetAll().FirstOrDefault(v => v.Key == "InvitationCode" && v.Id == invitationCode) == null)
                throw new UserFriendlyException("邀请码不正确，无法完成注册");
        } 

        private void CheckForTenant()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new InvalidOperationException("Can not register host users!");
            }
        }

        private async Task<Tenant> GetActiveTenantAsync()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return null;
            }

            return await GetActiveTenantAsync(AbpSession.TenantId.Value);
        }

        private async Task<Tenant> GetActiveTenantAsync(int tenantId)
        {
            var tenant = await _tenantManager.FindByIdAsync(tenantId);
            if (tenant == null)
            {
                throw new UserFriendlyException(L("UnknownTenantId{0}", tenantId));
            }

            if (!tenant.IsActive)
            {
                throw new UserFriendlyException(L("TenantIdIsNotActive{0}", tenantId));
            }

            return tenant;
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
