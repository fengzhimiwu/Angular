using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp.Domain.Repositories;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.TaskItems;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NPOI.XWPF.UserModel;

namespace ManufactureSys.BusinessLogic.Statements
{
    public class StatementManager : ManufactureSysDomainServiceBase<StatementDataRef, Guid>
    {
        public const string StatementsPath = "Statements";
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IRepository<TaskItemAssignment, Guid> _repositoryTa;
        private readonly IRepository<FileItem, Guid> _repositoryFileItem;
        private readonly IRepository<SubProject, Guid> _repositorySubProject;
        private readonly IRepository<Project, Guid> _repositoryProject;

        public StatementManager(IRepository<StatementDataRef, Guid> repository, IHostingEnvironment hostingEnvironment,
            IRepository<TaskItemAssignment, Guid> repositoryTa, IRepository<FileItem, Guid> repositoryFileItem, IRepository<SubProject, Guid> repositorySubProject, IRepository<Project, Guid> repositoryProject) : base(
            repository)
        {
            _hostingEnvironment = hostingEnvironment;
            _repositoryTa = repositoryTa;
            _repositoryFileItem = repositoryFileItem;
            _repositorySubProject = repositorySubProject;
            _repositoryProject = repositoryProject;
        }

        /// <summary>
        /// 输出模板docx文档(使用字典)
        /// </summary>
        /// <param name="fileItemId">docx文件路径</param>
        /// <param name="subProjectId">构件编号</param>
        /// <param name="taskFormData">预览的json数据</param>
        public async Task<string> Export(Guid fileItemId, Guid subProjectId, string taskFormData = null)
        {
            var fileItem = await _repositoryFileItem.GetAsync(fileItemId);
            // 字典数据源，如果dataJson为空，则从数据库里取Json数据，否则通过传入数据
            var data = taskFormData == null ? GetDictData(fileItem.Id, subProjectId) : GetDictDataFromJson(taskFormData);
            using (var stream = File.OpenRead(Path.Join(_hostingEnvironment.ContentRootPath, fileItem.FilePath)))
            {
                // TODO 考虑加入excel支持
                
                var doc = new XWPFDocument(stream);
                //遍历段落                  
                foreach (var para in doc.Paragraphs)
                {
                    ReplaceKey(para, data);
                }

                //遍历表格      
                foreach (var table in doc.Tables)
                {
                    foreach (var row in table.Rows)
                    {
                        foreach (var cell in row.GetTableCells())
                        {
                            foreach (var para in cell.Paragraphs)
                            {
                                ReplaceKey(para, data);
                            }
                        }
                    }
                }

                // outPath输出文件路径
                var outPath = Path.Join(_hostingEnvironment.WebRootPath, StatementsPath);
                if (!Directory.Exists(outPath)) Directory.CreateDirectory(outPath);
                // 写文件，前缀，对使用url安全的名字（方便预览）
                var prefix = DateTime.Now.ToString("yyyyMMddHHmmss") + "_";
                var fileName = prefix + fileItem.Id + fileItem.FileType;
                var outFile = new FileStream(Path.Join(outPath, fileName), FileMode.Create);
                doc.Write(outFile);
                outFile.Close();
                return Path.Join(StatementsPath, fileName);
            }
        }

        private Dictionary<string, string> GetDictData(Guid fileItemId, Guid subProjectId)
        {
            var query = Repository.GetAll().Where(v => v.FileItemId == fileItemId);
            var dict = new Dictionary<string, string>();
            // 遍历模板所关联的工作项
            foreach (var oneSd in query)
            {
                // 获取相应的数据
                // TODO 考虑用TaskItemAssignmentId来生成表单
                var ta = _repositoryTa.GetAll().Where(v =>
                    v.IsForwarded == false && v.ProcedureStepTaskItemId == oneSd.ProcedureStepTaskItemId &&
                    v.SubProjectId == subProjectId)
                    .Include(v => v.User).Include(v => v.CreatorUser)
                    .FirstOrDefault();
                if (ta == null) continue;
                // 通用任务数据部分，字段名字请看实体类
                dict.Add("User.Name", ta.User.Name);
                dict.Add("CreatorUser.Name", ta.User.Name);
                // 转换为数组
                var taskFormItems = JsonConvert.DeserializeObject<TaskFormItem[]>(ta.TaskFormData);
                // 添加为字典
                foreach (var item in taskFormItems)
                {
                    dict.Add(item.Name, item.Value);
                }
            }
            // 通用数据部分，字段名字请看实体类
            var subProject = _repositorySubProject.Get(subProjectId);
            var project = _repositoryProject.Get(subProject.ProjectId);
            dict.Add("Project.Name", project.Name);
            dict.Add("Project.UnitName", project.UnitName);
            dict.Add("SubProject.Category", subProject.Category);
            dict.Add("SubProject.Code", subProject.Code);
            dict.Add("DataTime.Now", DateTime.Now.ToString("yyyy-MM-dd"));
            dict.Add("Project.Supervisor", project.Supervisor);
            return dict;
        }
        
        private Dictionary<string, string> GetDictDataFromJson(string taskFormData)
        {
            var dict = new Dictionary<string, string>();
            // 转换为数组
            var taskFormItems = JsonConvert.DeserializeObject<TaskFormItem[]>(taskFormData);
            // 添加为字典
            foreach (var item in taskFormItems)
            {
                dict.Add(item.Name, item.Value);
            }

            return dict;
        }

        private static void ReplaceKey(XWPFParagraph para, Dictionary<string, string> data)
        {
            var textString = para.ParagraphText;
            foreach (var key in data.Keys)
            {
                // $$模板中数据占位符为$KEY$
                if (textString.Contains($"${key}$"))
                {
                    para.ReplaceText($"${key}$", data[key] ?? "");
                }
                // 如果没有这个值也进行替换
                else para.ReplaceText($"${key}$", "");

            }

//            foreach (var run in para.Runs)
//            {
//                var textString = run.ToString();
//                foreach (var key in data.Keys)
//                {
//                    //$$模板中数据占位符为$KEY$
//                    if (textString.Contains($"${key}$"))
//                    {
//                        textString = textString.Replace($"${key}$", data[key]);
//                        /*if (data.TryGetValue(key, out var value))
//                        {
//                            textString = textString.Replace($"${{{key}}}", value);
//                        } // 正则测试 ${宽度} ${宽度12312}  ${[32]12312} ${数量[0]} ${数量[1]} ${数量[2]} ${数量[222]}
//                        else if (Regex.IsMatch(textString, @"\$\{[^\}]+\[\d+\]\}"))
//                        {
//                            
//                        }*/
//                        para.ReplaceText();
//                    }
//                }
//
//                run.SetText(textString, 0);
//            }
        }
    }
}