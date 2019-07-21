using Abp.Application.Services.Dto;

namespace ManufactureSys.Net.DtoBase
{
    public class GetAllSearchInputBase: PagedResultRequestDto
    {
        public string Keywords { get; set; }
    }
}