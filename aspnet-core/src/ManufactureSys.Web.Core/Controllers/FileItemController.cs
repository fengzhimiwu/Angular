using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using ManufactureSys.Authorization;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.FileItems.Dto;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.Controllers
{
    public class FileItemController : ManufactureSysControllerBase
    {
        private readonly FileItemManager _fileItemManager;
        private readonly PlanManager _planManager;
        private readonly ProjectManager _projectManager;
        private readonly TaskItemAssignmentManager _taskItemAssignmentManager;

        public FileItemController(
            FileItemManager fileItemManager,
            PlanManager planManager, ProjectManager projectManager, TaskItemAssignmentManager taskItemAssignmentManager)
        {
            _fileItemManager = fileItemManager;
            _planManager = planManager;
            _projectManager = projectManager;
            _taskItemAssignmentManager = taskItemAssignmentManager;
        }
        /// <summary>
        /// 上传文件接口
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        [RequestSizeLimit(100_000_000)] //最大100m左右
        public async Task<FileItem> Create(CreateFileItemInput input)
        {
            // 可能废弃 如果出现了id值，表示要删除某个文件
            if (input.Id.HasValue) await _fileItemManager.DeleteAsync((Guid)input.Id);
            switch (input.FileItemCategory)
            {
                case FileItemCategory.BimModel:
                    return await _projectManager.InsertBimModel(input.FormFile, input.RelationalId, AbpSession.TenantId);
                case FileItemCategory.TaskAssignment:
                    return await _taskItemAssignmentManager.UploadAssignmentFile(input.FormFile, input.RelationalId, input.FileItemCategory, AbpSession.TenantId);
                // 单文件，即一个RelationalId对应一个数据库行
//                case FileItemCategory.Message:
                // case FileItemCategory.UserHead: // user表Id是long类型的
                case FileItemCategory.ProjectVideo:
                case FileItemCategory.ExaminationReport:
                    return await _fileItemManager.CreateOnly(input.FormFile, input.RelationalId, input.FileItemCategory);
                // 默认多文件
                default:
                    return await _fileItemManager.Create(input.FormFile, input.RelationalId, input.FileItemCategory);
            }
        }
        /// <summary>
        /// 下载文件接口
        /// </summary>
        /// <param name="id">这个id可为relationalId | 文件Id | subProjectId </param>
        /// <param name="types">针对不同类型做不同处理</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<FileResult> Get(Guid? id, FileItemCategory types = 0)
        {
            var fileItem = new FileItem();
            switch (types)
            {
                case FileItemCategory.QrCode:
                {
                    if (!id.HasValue) throw new UserFriendlyException("请提供id");
                    // 边生成边下载，这里的id是subProjectId
                    fileItem.FilePath = await _planManager.SaveQrCode((Guid)id);
                    fileItem.FileName = Path.GetFileName(fileItem.FilePath);
                    break;
                }
                case FileItemCategory.QrCodesZip:
                {
                    // 提前生成了zip，这里只做了下载操作
                    fileItem.FilePath = _planManager.GetQrCodesZipPath();
                    fileItem.FileName = DateTime.Now.ToString("yyMMddhhmmss")+Path.GetFileName(fileItem.FilePath);
                    break;
                }
                case FileItemCategory.ProjectVideo:
                case FileItemCategory.ExaminationReport:
                {
                    if (!id.HasValue) throw new UserFriendlyException("请提供id");
                    // 这里的id是relationalId，即projectId
                    // 为什么？因为可能video部分要改成多行模式
                    fileItem = await _fileItemManager.GetOnly((Guid)id, types);
                    break;
                }
                default:
                {
                    if (!id.HasValue) throw new UserFriendlyException("请提供id");
                    // 默认情况，只用id来进行下载
                    fileItem = await _fileItemManager.GetAsync((Guid)id);
                    break;
                }
            }

            if (fileItem.FilePath == null) throw new UserFriendlyException("下载出错错误");
            //获取文件流
            var stream = System.IO.File.OpenRead(fileItem.FilePath);
            //获取文件的ContentType
            var provider = new FileExtensionContentTypeProvider();
            var memi = provider.Mappings[Path.GetExtension(fileItem.FilePath)];
            return File(stream, memi, fileItem.FileName);
        }
        /// <summary>
        /// 获取文件信息，只提供给fileItem类别
        /// </summary>
        /// <param name="fileItemId"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<FileItem> GetInfo(Guid fileItemId)
        {
            return await _fileItemManager.GetAsync(fileItemId);
        }

        /// <summary>
        /// 取得某个类别所有相关的文件
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<PagedResultDto<FileItem>> GetAll(GetAllFileItemInput input)
        {
            var query = _fileItemManager.GetAll(input.RelationalId, input.FileItemCategory);
            return new PagedResultDto<FileItem>
            {
                TotalCount = await query.CountAsync(),
                Items = await query.ToListAsync()
            };
        }
        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task Delete(EntityDto<Guid> input)
        {
            await _fileItemManager.DeleteAsync(input.Id);
        }
        
        /// <summary>
        /// 检查权限的方法
        /// </summary>
        /// <param name="fileItemCategory"></param>
        /// <exception cref="AbpAuthorizationException"></exception>
        private void CheckPermission(FileItemCategory fileItemCategory)
        {
            switch (fileItemCategory)
            {
                case FileItemCategory.Project:
                    if (!PermissionChecker.IsGranted(PermissionNames.ProjectManagement))
                        throw new AbpAuthorizationException("你没有权限上传文件!");
                    break;
                case FileItemCategory.BimModel:
                    if (!PermissionChecker.IsGranted(PermissionNames.ProjectManagementModify))
                        throw new AbpAuthorizationException("你没有权限上传模型文件!");
                    break;

            }
        }
    }
}