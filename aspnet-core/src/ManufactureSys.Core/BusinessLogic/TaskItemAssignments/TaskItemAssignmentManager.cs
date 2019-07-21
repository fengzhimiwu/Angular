using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.UI;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItems;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ManufactureSys.BusinessLogic.TaskItemAssignments
{
    public class TaskItemAssignmentManager : ManufactureSysDomainServiceBase<TaskItemAssignment, Guid>
    {
        private readonly IRepository<FileItem, Guid> _repositoryFileItem;
        private readonly IRepository<SubProject, Guid> _repositorySubProject;
        private readonly IRepository<ProcedureStep, Guid> _repositoryProcedureStep;
        private readonly IRepository<ProcedureStepTaskItem, Guid> _repositoryPt;
        private readonly IRepository<TaskItem, Guid> _repositoryTaskItem;
        private readonly IHostingEnvironment _hostingEnvironment;

        public TaskItemAssignmentManager(IRepository<TaskItemAssignment, Guid> repository,
            IRepository<FileItem, Guid> repositoryFileItem, IRepository<SubProject, Guid> repositorySubProject,
            IRepository<ProcedureStep, Guid> repositoryProcedureStep,
            IRepository<ProcedureStepTaskItem, Guid> repositoryPt, IHostingEnvironment hostingEnvironment,
            IRepository<TaskItem, Guid> repositoryTaskItem) : base(repository)
        {
            _repositoryFileItem = repositoryFileItem;
            _repositorySubProject = repositorySubProject;
            _repositoryProcedureStep = repositoryProcedureStep;
            _repositoryPt = repositoryPt;
            _hostingEnvironment = hostingEnvironment;
            _repositoryTaskItem = repositoryTaskItem;
        }

        /// <summary>
        /// 拍照照片名字为梁片编号-工序-工作项-时间
        /// </summary>
        /// <param name="file"></param>
        /// <param name="relationalId"></param>
        /// <param name="category"></param>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        public async Task<FileItem> UploadAssignmentFile(IFormFile file, Guid? relationalId, FileItemCategory category,
            int? tenantId)
        {
            var fileItem = FileItemManager.CreateFile(_hostingEnvironment, file, relationalId, category, tenantId);
            // 如果没有relationalId则返回空
            if (!fileItem.RelationalId.HasValue) return null;
            var assignment = await GetAsync((Guid) fileItem.RelationalId);
            // SubProjectId为空，则编号不会填入
            var subProject = assignment.SubProjectId.HasValue
                ? _repositorySubProject.Get((Guid) assignment.SubProjectId)
                : null;
            var pt = _repositoryPt.Get(assignment.ProcedureStepTaskItemId);
            var procedureStep = _repositoryProcedureStep.Get(pt.ProcedureStepId);
            var taskItem = _repositoryTaskItem.Get(pt.TaskItemId);
            // 填写文件的名字，然后再插入
            fileItem.FileName = subProject?.Code + "-" + procedureStep.Name + "-" + taskItem.Name + "-" +
                                DateTime.Now.ToString("yyMMddHHmmss");

            return await _repositoryFileItem.InsertAsync(fileItem);
        }
    }
}