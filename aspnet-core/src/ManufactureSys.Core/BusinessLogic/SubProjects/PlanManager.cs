using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.MultiTenancy;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.WorkshopLayouts;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.MultiTenancy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using QRCoder;

namespace ManufactureSys.BusinessLogic.SubProjects
{
    public class PlanManager : ManufactureSysDomainServiceBase<SubProject, Guid>
    {
        private readonly IRepository<Project, Guid> _repositoryProject;
        private readonly IRepository<Procedure, Guid> _repositoryProcedure;
        private readonly IRepository<WorkshopLayout, Guid> _repositoryWorkshopLayout;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly TenantManager _tenantManager;

        public PlanManager(
            IRepository<SubProject, Guid> repositorySubProject,
            IRepository<Project, Guid> repositoryProject,
            IRepository<Procedure, Guid> repositoryProcedure,
            IHostingEnvironment hostingEnvironment, IRepository<WorkshopLayout, Guid> repositoryWorkshopLayout, TenantManager tenantManager) : base(repositorySubProject)
        {
            _repositoryProject = repositoryProject;
            _repositoryProcedure = repositoryProcedure;
            _hostingEnvironment = hostingEnvironment;
            _repositoryWorkshopLayout = repositoryWorkshopLayout;
            _tenantManager = tenantManager;
        }

        /// <summary>
        /// 创建一批子项目
        /// </summary>
        /// <param name="count"></param>
        /// <param name="startNum"></param>
        /// <param name="subProject"></param>
        /// <param name="bimModelIds"></param>
        /// <returns></returns>
        public async Task CreateSubProjects(int count, int startNum, SubProject subProject, int?[] bimModelIds)
        {
            // 这里要进行一系列操作，例如排产编号，批次
            subProject.Code = subProject.Category;
            var tempNum = DateTime.Now.ToString("yyMMddHHmmss");
            subProject.Project = await _repositoryProject.GetAsync(subProject.ProjectId);
            subProject.Procedure = await _repositoryProcedure.GetAsync(subProject.ProcedureId);
            subProject.BatchNum = GetNextBatchNum(subProject.ProjectId);
            // 获取不同台座中的最小值
            var minPedestalsNum = 0;
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                if (subProject.Project.LayoutId.HasValue)
                {
                    var layout = await _repositoryWorkshopLayout.GetAsync((Guid) subProject.Project.LayoutId);
                    // 最小台座数=最少输入台座数*2*生产线数
                    minPedestalsNum = Math.Min(layout.BindRebar, layout.BeamPedestal) * 2 * layout.ProductionLine;
                }
            }
            // 获取最新梁片的估计时间
            var theLatestSub = await Repository.GetAll().Where(v => v.ProjectId == subProject.ProjectId)
                .OrderByDescending(v => v.EstimatedFinishedTime).FirstOrDefaultAsync();
            var latestDateTime = theLatestSub?.EstimatedFinishedTime ?? DateTime.Now;
            // 开始生成梁片
            for (var i = 0; i < count; i++)
            {
                var one = subProject.Clone();
                // 计算估计时间。
                if (minPedestalsNum != 0) one.EstimatedFinishedTime = latestDateTime.Add(
                        TimeSpan.FromDays((float)subProject.Procedure.TotalDuration * (1 + i / minPedestalsNum)));
                // 构件的一些信息
                one.Code += "_" + startNum.ToString("00000") + "_" + tempNum;
                one.BimModelDbId = bimModelIds.IsNullOrEmpty() ? null : bimModelIds[i];
                startNum++;
                await Repository.InsertAsync(one);
            }
        }

        /// <summary>
        /// 获取批次
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        private int GetNextBatchNum(Guid projectId)
        {
            var max = Repository.GetAll()
                .Where(v => v.ProjectId == projectId).Select(v => v.BatchNum).DefaultIfEmpty(0).Max();
            return max + 1;
        }

        /// <summary>
        /// 自动绑定构件与模型Id
        /// </summary>
        /// <param name="bimModelIds"></param>
        /// <param name="projectId"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public async Task<int> AutoBindBimModel(int[] bimModelIds, Guid projectId, string category)
        {
            var subProjects = await Repository.GetAll().Where(v => v.ProjectId == projectId)
                .WhereIf(!category.IsNullOrEmpty(), v => v.Category.Contains(category)).ToListAsync();
            for (var i = 0; i < subProjects.Count; i++)
            {
                if (i >= bimModelIds.Length)
                    break;
                subProjects[i].BimModelDbId = bimModelIds[i];
                await UpdateAsync(subProjects[i]);
            }

            // message为正数表明还有多的构件未绑定，为负数表明有模型多了
            var message = subProjects.Count - bimModelIds.Length;
            return message;
        }

        /// <summary>
        /// 自动解绑项目中的构件与模型
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public async Task AutoUnBindBimModel(Guid projectId)
        {
            var project = await _repositoryProject.GetAsync(projectId);
            var subProjects = await Repository.GetAll().Where(v => v.ProjectId == projectId).ToListAsync();
            foreach (var one in subProjects)
            {
                one.BimModelDbId = null;
                await UpdateAsync(one);
            }
        }

        /// <summary>
        /// 手动绑定构件与模型Id
        /// </summary>
        /// <param name="bimModelId"></param>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        public async Task<SubProject> BindBimModel(int bimModelId, Guid subProjectId)
        {
            var subProject = await GetAsync(subProjectId);
            subProject.BimModelDbId = bimModelId;
            return await UpdateAsync(subProject);
        }

        /// <summary>
        /// 手动解绑
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <returns></returns>
        public async Task<SubProject> UnBindBimModel(Guid subProjectId)
        {
            var subProject = await GetAsync(subProjectId);
            subProject.BimModelDbId = null;
            return await UpdateAsync(subProject);
        }

        /// <summary>
        /// 生成单个二维码
        /// </summary>
        /// <param name="subProjectId"></param>
        /// <param name="pixel"></param>
        /// <returns></returns>
        public Task<string> SaveQrCode(Guid subProjectId, int pixel = 4)
        {
            var generator = new QRCodeGenerator();
            var filePath = GetQrCodePath(subProjectId);
            // 如果存在就不生成
            if (File.Exists(filePath)) return Task.FromResult(filePath);
            // 生成二维码
//            var url = "https://dotnet.holacodes.com/app/home/relational-info?id=" + subProjectId;
            // 获取租户信息
            var tenantId = CurrentUnitOfWork.GetTenantId();
            var tenancyName = tenantId.HasValue ? _tenantManager.GetById((int) tenantId).TenancyName : null;
            // 在url里面填入租户名字
            var url = $"https://dotnet.holacodes.com/public;tenancyName={tenancyName}/relational-info?id=" + subProjectId;
            var qrCode = new QRCode(generator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M, true));
            var bitmap = qrCode.GetGraphic(pixel, Color.Black, Color.White, true);
            bitmap.Save(filePath, ImageFormat.Jpeg);
            // 释放资源
            qrCode.Dispose();
            bitmap.Dispose();
            generator.Dispose();
            return Task.FromResult(filePath);
        }

        public string GetQrCodePath(Guid subProjectId)
        {
            var qrFolderPath = Path.Join(_hostingEnvironment.ContentRootPath, FileItemManager.FileItemsPath,
                "QRCodes/");
            var filePath = Path.Join(qrFolderPath, subProjectId + ".jpg");
            return filePath;
        }

        /// <summary>
        /// 批量生成二维码并下载，要把生成和下载分开的原因是：在文件下载的位置查询数据库，不建议这样做
        /// </summary>
        /// <param name="subProjectIds"></param>
        /// <param name="pixel"></param>
        /// <returns></returns>
        public Task SaveQrCodes(IEnumerable<Guid> subProjectIds, int pixel = 4)
        {
            var generator = new QRCodeGenerator();
            // 生成二维码，操作时间较长，获取hash名字做临时文件夹
            var hashName = MD5.Create().ComputeHash(Encoding.Default.GetBytes(DateTime.Now.ToLongTimeString()))
                .ToString();
            var qrFolderPath = Path.Join(_hostingEnvironment.ContentRootPath, FileItemManager.FileItemsPath, hashName);
            Directory.CreateDirectory(qrFolderPath);
            foreach (var id in subProjectIds)
            {
//                var url = "https://dotnet.holacodes.com/app/home/relational-info?id=" + id;
                // 获取租户信息
                var tenantId = CurrentUnitOfWork.GetTenantId();
                var tenancyName = tenantId.HasValue ? _tenantManager.GetById((int) tenantId).TenancyName : null;
                // 在url里面填入租户名字
                var url = $"https://dotnet.holacodes.com/public;tenancyName={tenancyName}/relational-info?id=" + id;
                var qrCode = new QRCode(generator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M, true));
                var bitmap = qrCode.GetGraphic(pixel, Color.Black, Color.White, true);
                bitmap.Save(Path.Join(qrFolderPath, id + ".jpg"), ImageFormat.Jpeg);
                qrCode.Dispose();
                bitmap.Dispose();
            }

            generator.Dispose();
            // 创建压缩文件
            var qrZipFile = GetQrCodesZipPath();
            if (File.Exists(qrZipFile)) File.Delete(qrZipFile);
            System.IO.Compression.ZipFile.CreateFromDirectory(qrFolderPath, qrZipFile);
            // 删除临时文件
            if (Directory.Exists(qrFolderPath)) Directory.Delete(qrFolderPath, true);
            return Task.CompletedTask;
        }

        /// <summary>
        /// 获取压缩文件地址
        /// </summary>
        /// <returns></returns>
        public string GetQrCodesZipPath()
        {
            var qrZipFile = Path.Join(_hostingEnvironment.ContentRootPath, FileItemManager.FileItemsPath, "QRCodes");
            qrZipFile = Path.Join(qrZipFile, "QRCodes" + ".zip");
            return qrZipFile;
        }
    }
}