using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Organizations;
using Abp.Runtime.Caching;
using ManufactureSys.Authorization.Roles;
using System.Threading.Tasks;
using Abp;
using Abp.Threading;
using Abp.Collections.Extensions;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.Authorization.Users
{
    public class UserManager : AbpUserManager<Role, User>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<User,long> _userRepository;

        public UserManager(
            RoleManager roleManager,
            UserStore store, 
            IOptions<IdentityOptions> optionsAccessor, 
            IPasswordHasher<User> passwordHasher, 
            IEnumerable<IUserValidator<User>> userValidators, 
            IEnumerable<IPasswordValidator<User>> passwordValidators,
            ILookupNormalizer keyNormalizer, 
            IdentityErrorDescriber errors, 
            IServiceProvider services, 
            ILogger<UserManager<User>> logger, 
            IPermissionManager permissionManager, 
            IUnitOfWorkManager unitOfWorkManager, 
            ICacheManager cacheManager, 
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IRepository<UserOrganizationUnit, long> userOrganizationUnitRepository, 
            IOrganizationUnitSettings organizationUnitSettings, 
            ISettingManager settingManager,
            IRepository<User, long> userRepository
            ): base(
                roleManager, 
                store, 
                optionsAccessor, 
                passwordHasher, 
                userValidators, 
                passwordValidators, 
                keyNormalizer, 
                errors, 
                services, 
                logger, 
                permissionManager, 
                unitOfWorkManager, 
                cacheManager,
                organizationUnitRepository, 
                userOrganizationUnitRepository, 
                organizationUnitSettings, 
                settingManager)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _userRepository = userRepository;
        }
        /// <summary>
        /// 重写了修改密码的方法，把密码的要求验证给删除了
        /// </summary>
        /// <param name="user"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public override async Task<IdentityResult> ChangePasswordAsync(User user, string newPassword)
        {
            if (newPassword.IsNullOrWhiteSpace()) throw new UserFriendlyException("新密码不能为空");
            if (newPassword.Length < 6) throw new UserFriendlyException("新密码不能少于6位");
            await AbpUserStore.SetPasswordHashAsync(user, PasswordHasher.HashPassword(user, newPassword));
            return IdentityResult.Success;
        }
        /// <summary>
        /// 通过关键词搜索用户，通过名字、角色名
        /// </summary>
        /// <param name="query"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        public IQueryable<User> SearchUserByKeyword(IQueryable<User> query, string keyword)
        {
            return query.Include(user => user.Roles)
                .WhereIf(!keyword.IsNullOrWhiteSpace(), user =>
                    user.Name.Contains(keyword) || RoleManager.Roles
                        .Where(r => user.Roles.Any(ur => ur.RoleId == r.Id))
                        .Any(r => r.DisplayName.Contains(keyword)));
        }
    }
}
