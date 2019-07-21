using System.ComponentModel.DataAnnotations;

namespace ManufactureSys.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}