using Abp.AutoMapper;
using Abp.UI.Inputs;
using ManufactureSys.BusinessLogic.FileItems;

namespace ManufactureSys.BusinessLogic.Projects.Dto
{
    [AutoMapFrom(typeof(FileItem))]
    public class BimModelDto: FileItem
    {
        public string BimModelUrl { get; set; }
    }
}