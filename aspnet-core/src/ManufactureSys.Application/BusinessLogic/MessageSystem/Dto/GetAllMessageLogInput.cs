using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.MessageSystem.Dto
{
    public class GetAllMessageLogInput: PagedResultRequestDto
    {
        public long ReceiverId { get; set; }
    }
}