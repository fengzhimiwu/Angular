using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.BusinessLogic.FileItems
{
    public class FileItemManager : ManufactureSysDomainServiceBase<FileItem, Guid>
    {
        public const string FileItemsPath = "File_Items/";
        private readonly IHostingEnvironment _hostingEnvironment;

        public FileItemManager(
            IRepository<FileItem, Guid> repository,
            IHostingEnvironment hostingEnvironment
        ): base(repository)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// 在指定路径下存放文件，若不存在则创建，可以创建多个
        /// </summary>
        /// <param name="file"></param>
        /// <param name="relationalId"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public async Task<FileItem> Create(IFormFile file, Guid? relationalId, FileItemCategory category)
        {
            var obj = CreateFile(_hostingEnvironment, file, relationalId, category, CurrentUnitOfWork.GetTenantId());
            return await Repository.InsertAsync(obj);
        }
        /// <summary>
        /// 创建唯一一个
        /// </summary>
        /// <param name="file"></param>
        /// <param name="relationalId"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public async Task<FileItem> CreateOnly(IFormFile file, Guid? relationalId, FileItemCategory category)
        {
            // 先删除原有的，包括数据库部分与文件部分
            if (!relationalId.HasValue) throw new UserFriendlyException("请提供RelationalId");
            await DeleteAll((Guid)relationalId, category);
            CurrentUnitOfWork.SaveChanges();
            // 再创建
            var obj = CreateFile(_hostingEnvironment, file, relationalId, category, CurrentUnitOfWork.GetTenantId());
            return await Repository.InsertAsync(obj);
        }
        /// <summary>
        /// 获取唯一一个
        /// </summary>
        /// <param name="relationalId"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public async Task<FileItem> GetOnly(Guid relationalId, FileItemCategory category)
        {
            var fileItem = await Repository.GetAll().FirstOrDefaultAsync(v =>
                v.RelationalId == relationalId && v.Category == category);
            return fileItem;
        }
        /// <summary>
        /// 删除单个文件
        /// </summary>
        /// <param name="fileItemId"></param>
        /// <returns></returns>
        public override async Task DeleteAsync(Guid fileItemId)
        {
            var fileItem = await Repository.FirstOrDefaultAsync(v => v.Id == fileItemId);
            if (fileItem == null) return;
            // 删除实体文件
            if (File.Exists(fileItem.FilePath))
                File.Delete(fileItem.FilePath);
            // 删除实体目录
            else if (Directory.Exists(fileItem.FilePath))
                Directory.Delete(fileItem.FilePath, true);
            // 删除数据库的内容
            await Repository.DeleteAsync(fileItemId);
        }

        /// <summary>
        /// 取得相关的所有FileItem
        /// </summary>
        /// <param name="relationalId"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public IQueryable<FileItem> GetAll(Guid? relationalId, FileItemCategory category)
        {
            return Repository.GetAll()
                .Where(v => v.Category == category)
                .WhereIf(relationalId.HasValue, v => v.RelationalId == relationalId);
        }

        /// <summary>
        /// 删除所有关联的文件
        /// </summary>
        /// <param name="relationalId"></param>
        /// <param name="fileItemCategory"></param>
        /// <returns></returns>
        public async Task DeleteAll(Guid relationalId, FileItemCategory fileItemCategory)
        {
            foreach (var one in GetAll(relationalId, fileItemCategory))
            {
                await DeleteAsync(one.Id);
            }
        }

        /// <summary>
        /// 获取相应文件夹地址
        /// </summary>
        /// <param name="hostingEnvironment"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public static string GetFileFolder(IHostingEnvironment hostingEnvironment, FileItemCategory category)
        {
            var folderPath = Path.Join(hostingEnvironment.ContentRootPath, FileItemsPath + Enum.GetName(typeof(FileItemCategory), category));
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            return folderPath;
        }
        /// <summary>
        /// 创建一个文件的静态方法
        /// </summary>
        /// <param name="hostingEnvironment"></param>
        /// <param name="file"></param>
        /// <param name="relationalId"></param>
        /// <param name="category"></param>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        public static FileItem CreateFile(IHostingEnvironment hostingEnvironment, IFormFile file, Guid? relationalId, FileItemCategory category, int? tenantId)
        {
            // 重命名未guid名字
            var id = Guid.NewGuid();
            var guidFilePath = "/" + id + Path.GetExtension(file.FileName);
            using (var stream = new FileStream(
                GetFileFolder(hostingEnvironment, category) + guidFilePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            // 插入数据库
            return new FileItem
            {
                Id = id,
                TenantId = tenantId,
                FileName = file.FileName,
                // 这里使用的是相对地址
                FilePath = FileItemsPath + category + guidFilePath,
                FileSize = file.Length,
                FileType = Path.GetExtension(file.FileName), //含“.”
                RelationalId = relationalId,
                Category = category
            };
        }
    }
}