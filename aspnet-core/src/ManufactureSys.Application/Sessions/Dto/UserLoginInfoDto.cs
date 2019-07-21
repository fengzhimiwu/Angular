using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ManufactureSys.Authorization.Users;

namespace ManufactureSys.Sessions.Dto
{
    [AutoMapFrom(typeof(User))]
    public class UserLoginInfoDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }
        // business logic
        public Guid? HeadFileItemId { get; set; }
    }
}
