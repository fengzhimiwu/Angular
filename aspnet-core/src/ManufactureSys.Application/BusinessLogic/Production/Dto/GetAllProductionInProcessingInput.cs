using System;
using Abp.Application.Services.Dto;

namespace ManufactureSys.BusinessLogic.Production.Dto
{
    public class GetAllProductionBase: PagedResultRequestDto
    {
        public Guid? ProjectId { get; set; }
    }
}