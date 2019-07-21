using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Extensions;
using Abp.Linq.Extensions;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.StatementDataRefs.Dto;
using ManufactureSys.BusinessLogic.Statements.Dto;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.SubProjects.Dto;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItemAssignments.Dto;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Statements
{
    [AbpAuthorize(PermissionNames.ProjectStatements)]
    public class StatementAppService : ManufactureSysAppServiceBase
    {
        private readonly SubProjectManager _subProjectManager;
        private readonly StatementManager _statementManager;
        private readonly TaskItemAssignmentManager _taskItemAssignmentManager;

        public StatementAppService(SubProjectManager subProjectManager, StatementManager statementManager,
            TaskItemAssignmentManager taskItemAssignmentManager)
        {
            _subProjectManager = subProjectManager;
            _statementManager = statementManager;
            _taskItemAssignmentManager = taskItemAssignmentManager;
        }

        /// <summary>
        /// 生成表单
        /// TODO 考虑用TaskItemAssignmentId来生成表单
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<string> GenerateStatement(GenerateStatementInput input)
        {
            // 生成表单，本接口调用完毕后直接调用下载接口
            return await _statementManager.Export(input.FileItemId, input.SubProjectId);
        }

        /// <summary>
        /// 预览表单，传入的json数据预览
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<string> PreviewStatement(PreviewStatementInput input)
        {
            // 预览表单
            return await _statementManager.Export(input.FileItemId, input.SubProjectId, input.TaskFormData);
        }

        /// <summary>
        /// 获取所有的构件
        /// PAGE: 项目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<SubProjectDto>> GetAll(GetAllSubProjectInput input)
        {
            var query = _subProjectManager.GetAll()
                .WhereIf(input.ProjectId.HasValue, v => v.ProjectId == input.ProjectId)
                .WhereIf(input.ProcedureId.HasValue, v => v.ProcedureId == input.ProcedureId)
                .WhereIf(input.BimModelFileItemId.HasValue, v => v.BimModelFileItemId == input.BimModelFileItemId)
                .WhereIf(!input.SearchParam.IsNullOrWhiteSpace(), v => v.Code.Contains(input.SearchParam));
            query = query.Take(10);
            return new PagedResultDto<SubProjectDto>(
                await query.CountAsync(),
                await query.Select(v => v.MapTo<SubProjectDto>()).ToListAsync()
            );
        }

        /// <summary>
        /// 获取某个任务里面可以预览的表格
        /// PAGE: 任务详情页面
        /// </summary>
        /// <param name="ptId"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<StatementDataRefDto>> GetStatementTemplates(Guid ptId)
        {
            var statementDataRefs = _statementManager.GetAll().Where(v => v.ProcedureStepTaskItemId == ptId)
                .Include(v => v.FileItem);
            return new PagedResultDto<StatementDataRefDto>(await statementDataRefs.CountAsync(),
                await statementDataRefs.Select(v => v.MapTo<StatementDataRefDto>()).ToListAsync());
        }

        /// <summary>
        /// 获取某个模板里面可以下载和预览的任务，通过subProjectId筛选
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<TaskItemAssignmentDto>> GetStatementAssignments(GenerateStatementInput input)
        {
            var ptIds = await _statementManager.GetAll().Where(v => v.FileItemId == input.FileItemId)
                .Select(v => v.ProcedureStepTaskItemId).ToListAsync();
            var assignments = _taskItemAssignmentManager.GetAll()
                .Where(v => ptIds.Contains(v.ProcedureStepTaskItemId) && v.Id == v.RootAssignmentId &&
                            v.SubProjectId == input.SubProjectId)
                .Include(v => v.TaskItem).Include(v => v.User);
            return new PagedResultDto<TaskItemAssignmentDto>(await assignments.CountAsync(),
                await assignments.Select(v => v.MapTo<TaskItemAssignmentDto>()).ToListAsync());
        }
    }
}