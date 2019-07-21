using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.MultiTenancy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.Projects
{
    public class ProjectManager : ManufactureSysDomainServiceBase<Project, Guid>
    {
        public const string BimModelsPath = "/ForgeModels/";
        private readonly IRepository<FileItem, Guid> _repositoryFileItem;
        private readonly IRepository<ProjectMember, Guid> _repositoryProjectMember;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly TenantManager _tenantManager;
        private readonly IRepository<Project, Guid> _repositoryProject;
        private readonly IRepository<FileItem, Guid> _fileItemRepository;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProjectManager(
            IRepository<FileItem, Guid> repositoryFileItem,
            IRepository<ProjectMember, Guid> repositoryProjectMember,
            IRepository<User, long> repositoryUser,
            TenantManager tenantManager,
            IRepository<Project, Guid> repositoryProject, IHostingEnvironment hostingEnvironment,
            IRepository<FileItem, Guid> fileItemRepository) : base(repositoryProject)
        {
            _repositoryFileItem = repositoryFileItem;
            _repositoryProjectMember = repositoryProjectMember;
            _repositoryUser = repositoryUser;
            _tenantManager = tenantManager;
            _repositoryProject = repositoryProject;
            _fileItemRepository = fileItemRepository;
            _hostingEnvironment = hostingEnvironment;
        }
        /// <summary>
        /// Bim模型插入方法
        /// </summary>
        /// <param name="file"></param>
        /// <param name="relationalId"></param>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        public async Task<FileItem> InsertBimModel(IFormFile file, Guid? relationalId, int? tenantId)
        {
            // 创建获取到的zip文件
            var zipFilePath = FileItemManager.GetFileFolder(_hostingEnvironment, FileItemCategory.BimModel) + "/" + Guid.NewGuid() + Path.GetExtension(file.FileName);
            using (var stream = new FileStream(zipFilePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            // 建立bimModel的文件夹，及插入数据库的信息
            var bimModelName = Path.GetFileNameWithoutExtension(file.FileName) + DateTime.Now.ToString("yyMMddHHmmss");
            // BIM地址在webRoot
            var bimModelPath = _hostingEnvironment.WebRootPath + BimModelsPath + bimModelName;
            if (!Directory.Exists(bimModelPath))
                Directory.CreateDirectory(bimModelPath);
            var fileItem = new FileItem
            {
                TenantId = tenantId,
                FileName = bimModelName + "/3d.svf",
                // 使用相对地址
                FilePath = "wwwroot" + BimModelsPath + bimModelName,
                FileSize = file.Length,
                FileType = ".svf",
                RelationalId = relationalId,
                Category = FileItemCategory.BimModel
            };
            // BimModel需要解压
            System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, bimModelPath);
            // 删除压缩文件
            if (File.Exists(zipFilePath)) File.Delete(zipFilePath);
            return await _fileItemRepository.InsertAsync(fileItem);
        }

        /// <summary>
        /// 删除bim模型和文件
        /// </summary>
        /// <param name="fileItemId"></param>
        /// <returns></returns>
        public async Task DeleteBimModel(Guid fileItemId)
        {
            var fileItem = await _repositoryFileItem.GetAll()
                .FirstOrDefaultAsync(v => v.Category == FileItemCategory.BimModel && v.Id == fileItemId);
            if (Directory.Exists(fileItem.FilePath))
                Directory.Delete(fileItem.FilePath, true);
            await _repositoryFileItem.DeleteAsync(fileItem.Id);
        }

        /// <summary>
        /// 所有租户中剩下的人
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="projectId"></param>
        /// <param name="searchKey"></param>
        /// <param name="currentTenantId"></param>
        /// <returns></returns>
        public IQueryable<ProjectMember> GetAllMember(Guid? projectId, string searchKey,
            int? currentTenantId)
        {
//            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var query = _repositoryProjectMember.GetAll();
            // 筛选已分配的人
            query = query.Where(v => v.TenantId == CurrentUnitOfWork.GetTenantId());
            if (projectId.HasValue) query = query.Where(v => v.ProjectId == projectId);
            query = query.Include(i => i.User).ThenInclude(v => v.Roles)
                .Include(i => i.Tenant).Include(i => i.Project);
            // 筛选出本租户才有的项目，两个queryable对象没法使用contains，所以需要toList
            var projectQuery = _repositoryProject.GetAll().Where(p => p.TenantId == currentTenantId).Select(v => v.Id);
            query = query.Where(v => projectQuery.Contains(v.ProjectId));
            // 筛选搜索的关键字
            if (!searchKey.IsNullOrWhiteSpace())
                query = query.Where(v => v.User.Name.Contains(searchKey));
            return query;
        }

        /// <summary>
        /// 通过TenantId取得用户，不在项目中的
        /// </summary>
        /// <param name="memberQuery"></param>
        /// <param name="tenantId"></param>
        /// <param name="searchKey"></param>
        /// <returns></returns>
        public async Task<IEnumerable<ProjectMember>> GetAllMemberNotInProject(string searchKey,
            IQueryable<User> memberQuery = null)
        {
            var tenantId = CurrentUnitOfWork.GetTenantId();
            var tenant = tenantId.HasValue ? await _tenantManager.GetByIdAsync((int) tenantId) : null;
            // 取得整个公司的人
//            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var query = _repositoryUser.GetAll();//.Where(v => v.TenantId == tenantId);
            // 筛选未在项目组中的人
            if (memberQuery != null)
                query = query.Where(v => !memberQuery.Contains(v)).Include(v => v.Roles);
            // 转换为member类型方便显示
            var projectMembers = new List<ProjectMember>();
            foreach (var one in query)
            {
                var member = new ProjectMember
                {
                    User = one,
                    Tenant = tenant
                };
                projectMembers.Add(member);
            }

            // 筛选搜索的关键字
            if (!searchKey.IsNullOrWhiteSpace())
                projectMembers = projectMembers.Where(v => v.User.Name.Contains(searchKey)).ToList();
            return projectMembers;
        }

        /// <summary>
        /// 取得所有在项目中的人
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="projectId"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public IQueryable<User> GetAllMemberInProject(Guid projectId, int? tenantId = null, string name = null)
        {
            CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant);
            var query = _repositoryProjectMember.GetAll();
            query = query.Where(v => v.ProjectId == projectId);
            query = query.WhereIf(tenantId.HasValue, v => v.TenantId == tenantId)
                .Include(v => v.User)
                .WhereIf(!name.IsNullOrWhiteSpace(), member => member.User.Name.Contains(name));
            return query.Select(v => v.User);
        }

        /// <summary>
        /// 获取登陆用户参加的项目列表ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IReadOnlyList<Guid> GetProjectsJoined(long userId)
        {
            return _repositoryProjectMember.GetAll().Where(v => v.UserId == userId).Select(v => v.ProjectId).ToList();
        }
    }
}