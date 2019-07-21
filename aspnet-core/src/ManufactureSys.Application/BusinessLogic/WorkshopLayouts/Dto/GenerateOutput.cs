using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;
using ManufactureSys.BusinessLogic.Pedestals.Dto;

namespace ManufactureSys.BusinessLogic.WorkshopLayouts.Dto
{
    public class GenerateOutput
    {
        /// <summary>
        /// 生产线
        /// </summary>
        public string ProductionLine { get; set; }
        /// <summary>
        /// 左部或上部的钢筋绑扎区域
        /// </summary>
        public List<PedestalDto> LU_BindRebar { get; set; }
        /// <summary>
        /// 左部或上部的制梁台区域
        /// </summary>
        public List<PedestalDto> LU_BeamPedestal { get; set; }
        /// <summary>
        /// 左部或上部的存梁台区域
        /// </summary>
        public List<PedestalDto> LU_SaveBeam { get; set; }
        /// <summary>
        /// 右部或下部的钢筋绑扎区域
        /// </summary>
        public List<PedestalDto> RD_BindRebar { get; set; }
        /// <summary>
        /// 右部或下部的制梁台区域
        /// </summary>
        public List<PedestalDto> RD_BeamPedestal { get; set; }
        /// <summary>
        /// 右部或下部的存梁台区域
        /// </summary>
        public List<PedestalDto> RD_SaveBeam { get; set; }
    }
}
