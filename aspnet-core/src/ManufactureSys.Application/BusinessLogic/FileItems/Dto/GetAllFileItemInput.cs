using System;

namespace ManufactureSys.BusinessLogic.FileItems.Dto
{
    public class GetAllFileItemInput
    {
        public Guid? RelationalId { get; set; }
        public FileItemCategory FileItemCategory { get; set; }
    }
}