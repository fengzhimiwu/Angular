using System;
using System.Collections.Generic;
using System.Text;

namespace ManufactureSys.BusinessLogic.Pedestals.Dto
{
    public class PedestalInput
    {
        /// <summary>
        /// 布局Id
        /// </summary>
        public Guid LayoutId { get; set; }
        /// <summary>
        /// 所属项目Id
        /// </summary>
        public Guid ProjectId { get; set; }
    }
}
