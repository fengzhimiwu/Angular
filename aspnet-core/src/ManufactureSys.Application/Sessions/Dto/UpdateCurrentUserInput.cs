using System;
using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using ManufactureSys.Authorization.Users;

namespace ManufactureSys.Sessions.Dto
{
    [AutoMapTo(typeof(User))]
    public class UpdateCurrentUserInput
    {
        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        public string FullName { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxPhoneNumberLength)]
        public string MobileNumber { get; set; }
        public Guid? HeadFileItemId { get; set; }

    }
}