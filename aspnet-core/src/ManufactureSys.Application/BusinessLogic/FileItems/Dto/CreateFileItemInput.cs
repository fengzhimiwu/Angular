using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ManufactureSys.BusinessLogic.FileItems.Dto
{
    public class CreateFileItemInput
    {
        // 本id表示要删除某一项，一般用不到，主要为了防止重复上传文件
        public Guid? Id { get; set; }
        public IFormFile FormFile { get; set; }
        public Guid? RelationalId{ get; set; }
        public FileItemCategory FileItemCategory { get; set; }
    }
}