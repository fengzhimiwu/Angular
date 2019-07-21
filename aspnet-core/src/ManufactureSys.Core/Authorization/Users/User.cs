using System;
using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Users;
using Abp.Extensions;

namespace ManufactureSys.Authorization.Users
{
    public class User : AbpUser<User>
    {
        public const string DefaultPassword = "123qwe";

        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }

        public static User CreateTenantAdminUser(int tenantId, string emailAddress, string mobileNumber)
        {
            var user = new User
            {
                TenantId = tenantId,
                UserName = AdminUserName,
                Name = AdminUserName,
                Surname = AdminUserName,
                EmailAddress = emailAddress,
                MobileNumber = mobileNumber
            };

            user.SetNormalizedNames();

            return user;
        }
        // business logic
        /// <summary>
        /// 手机号
        /// </summary>
        [Required]
        [StringLength(MaxPhoneNumberLength)]
        public string MobileNumber { get; set; }
        /// <summary>
        /// 头像文件
        /// </summary>
        public Guid? HeadFileItemId { get; set; }
    }
}
