using System;
using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.ProjectMembers.Dto
{
    public class GetAllProjectMemberInput: PagedResultRequestDto
    {
        public Guid? ProjectId { get; set; }
        public string SearchParameters { get; set; }
    }
}