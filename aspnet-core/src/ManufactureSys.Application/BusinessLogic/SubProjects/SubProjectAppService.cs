using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using System;

//using ManufactureSys.Entities;
using AutoMapper;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using Abp.Extensions;
using Abp.Linq.Extensions;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.EntityFrameworkCore.Repositories;
using NPOI;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.OpenXmlFormats.Spreadsheet;
using NPOI.XSSF.UserModel;

namespace ManufactureSys.BusinessLogic.SubProjects
{
    /// <summary>
    /// 权限子项目
    /// </summary>
    [AbpAuthorize(PermissionNames.ProjectPlan)]
    public class SubProjectAppService : ManufactureSysAppServiceBase<SubProject, SubProjectDto, Guid,
        GetAllSubProjectInput, CreateSubProjectInput, SubProjectDto>
    {
        private readonly PlanManager _planManager;
        private readonly PedestalManager _pedestalManager;
        private readonly TaskItemAssignmentManager _taskItemAssignmentManager;
        public SubProjectAppService(
            IRepository<SubProject, Guid> repository,
            PlanManager planManager, PedestalManager pedestalManager, TaskItemAssignmentManager taskItemAssignmentManager): base(repository)
        {
            _planManager = planManager;
            _pedestalManager = pedestalManager;
            _taskItemAssignmentManager = taskItemAssignmentManager;
        }
        /// <summary>
        /// 创建一批子项目，即一批构件
        /// </summary>
        /// <param name="inputs"></param>
        /// <returns></returns>
        public async Task CreateMultiple(CreateSubProjectInput[] inputs)
        {
            foreach (var input in inputs)
            {
                var entity = MapToEntity(input);
                await _planManager.CreateSubProjects(input.NumCreating, input.StartNum, entity, input.BimModelIds);
            }
        }
        /// <summary>
        /// 通过一定的条件，获取所有的构件
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task<PagedResultDto<SubProjectDto>> GetAll(GetAllSubProjectInput input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input)
                .WhereIf(input.ProjectId.HasValue,v => v.ProjectId == input.ProjectId)
                .WhereIf(input.ProcedureId.HasValue, v => v.ProcedureId == input.ProcedureId)
                .Where(v => v.BimModelFileItemId == input.BimModelFileItemId)
                // 构件的BimDbId进行查询
                .WhereIf(!input.BimModelDbId.IsNullOrWhiteSpace(), v => v.BimModelDbId.ToString() == input.BimModelDbId)
                // 使用查询参数对Code Category
                .WhereIf(!input.SearchParam.IsNullOrWhiteSpace(), v => v.Code.Contains(input.SearchParam)
                         || v.Category.Contains(input.SearchParam));
            return await GetAllPagedByQueryFilter(query, input);
        }
        /// <summary>
        /// 获取所有构件的二维码
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task GetAllQrCodes(GetAllSubProjectInput input)
        {
            var query = await CreateFilteredQuery(input)
                .WhereIf(input.ProjectId.HasValue,v => v.ProjectId == input.ProjectId)
                .WhereIf(input.ProcedureId.HasValue, v => v.ProcedureId == input.ProcedureId)
                .Where(v => v.BimModelFileItemId == input.BimModelFileItemId)
                .WhereIf(!input.SearchParam.IsNullOrWhiteSpace(), v => v.Code.Contains(input.SearchParam))
                .Select(v => v.Id).ToArrayAsync();
            await _planManager.SaveQrCodes(query);
        }
        /// <summary>
        /// 构件删除方法，删除关联信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public override async Task Delete(EntityDto<Guid> input)
        {
            await _taskItemAssignmentManager.DeleteAsync(v => v.SubProjectId == input.Id);
            await base.Delete(input);
        }
        /// <summary>
        /// 调整计划时间
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<SubProjectDto>> AdjustEstimatedFinishedTime(AdjustEstimatedTimeInput input)
        {
            // 获取需要调整的构件，相关注释请参照GetAll方法，使用的是一样的筛选方法
            var query = CreateFilteredQuery(input)
                .WhereIf(input.ProjectId.HasValue, v => v.ProjectId == input.ProjectId)
                .WhereIf(input.ProcedureId.HasValue, v => v.ProcedureId == input.ProcedureId)
                .WhereIf(!input.BimModelDbId.IsNullOrWhiteSpace(), v => v.BimModelDbId.ToString() == input.BimModelDbId)
                .WhereIf(!input.SearchParam.IsNullOrWhiteSpace(), v => v.Code.Contains(input.SearchParam)
                                                                       || v.Category.Contains(input.SearchParam));
            foreach (var sub in query)
            {
                if (!sub.EstimatedFinishedTime.HasValue) continue;
                // 调整计划时间
                sub.EstimatedFinishedTime = sub.EstimatedFinishedTime.Value.Add(TimeSpan.FromDays(input.DelayedDay));
                await _planManager.UpdateAsync(sub);
            }
            // 返回受影响的构件
            return await GetAllAsyncByQueryFilter(query);
        }

        /// <summary>
        /// 废弃 自动绑定Bim模型
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<int> AutoBindBimModel(BimModelInput input)
        {
            return await _planManager.AutoBindBimModel(input.BimModelIds, input.ProjectId, input.SubProjectCategory);
        }
        /// <summary>
        /// 废弃 自动解绑
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task AutoUnBindBimModel(BimModelInput input)
        {
            await _planManager.AutoUnBindBimModel(input.ProjectId);
        }
        /// <summary>
        /// 废弃 Excel导入接口，discard废弃，无excel可供导入
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public SubProjectDto ExcleImport(string path)
        {
            SubProjectDto dto = new SubProjectDto();
            IWorkbook workbook = null;
            string fileName = path;
            FileStream fileStream = new FileStream(path, FileMode.Open, FileAccess.Read);
            if (fileName.IndexOf(".xlsx") > 0) // 2007版本
            {
                workbook = new XSSFWorkbook(fileStream);
            }
            else if (fileName.IndexOf(".xls") > 0) // 2003版本
            {
                workbook = new HSSFWorkbook(fileStream);
            }
            ISheet sheet = workbook.GetSheetAt(0);  
            IRow row;// = sheet.GetRow(0);          
            for (int i = 1; i < sheet.LastRowNum; i++)
            {
                row = sheet.GetRow(i);   
                if (row != null)
                {
                    //for (int j = 0; j < row.LastCellNum; j++)  
                    //{
                    //    string cellValue = row.GetCell(j).ToString(); 
                    //}
                    dto.Code = row.GetCell(0).ToString();
                    dto.Description = row.GetCell(1).ToString();
                }
            }
            fileStream.Close();
            workbook.Close();
            //SubProject obj = new SubProject();
            //obj = Mapper.Map<SubProject>(dto);
            return dto;
        }
    }
}
