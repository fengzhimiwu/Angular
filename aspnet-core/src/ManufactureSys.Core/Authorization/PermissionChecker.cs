using Abp.Authorization;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.Authorization.Users;

namespace ManufactureSys.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
