using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using ManufactureSys.Authorization.Roles;
using ManufactureSys.Authorization.Users;
using ManufactureSys.BusinessLogic.SubProjects;
using ManufactureSys.MultiTenancy;
using ManufactureSys.BusinessLogic.Procedures;
using ManufactureSys.BusinessLogic.Projects;
using ManufactureSys.BusinessLogic.Workshops;
using ManufactureSys.BusinessLogic.TaskItems;
using ManufactureSys.BusinessLogic.Devices;
using ManufactureSys.BusinessLogic.FileItems;
using ManufactureSys.BusinessLogic.Examinations;
using ManufactureSys.BusinessLogic.Inventories;
using ManufactureSys.BusinessLogic.Knowledgebases;
using ManufactureSys.BusinessLogic.Material;
using ManufactureSys.BusinessLogic.MessageSystem;
using ManufactureSys.BusinessLogic.Pedestals;
using ManufactureSys.BusinessLogic.Statements;
using ManufactureSys.BusinessLogic.SystemSettings;
using ManufactureSys.BusinessLogic.TaskItemAssignments;
using ManufactureSys.BusinessLogic.WorkshopArrangements;
using ManufactureSys.BusinessLogic.WorkshopLayouts;

namespace ManufactureSys.EntityFrameworkCore
{
    public class ManufactureSysDbContext : AbpZeroDbContext<Tenant, Role, User, ManufactureSysDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<FileItem> FileItems { get; set; }
        public DbSet<Procedure> Procedures { get; set; }
        public DbSet<ProcedureStep> ProcedureSteps { get; set; }
        public DbSet<ProcedureStepTaskItem> ProcedureStepTaskItems { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }
        public DbSet<SubProject> SubProjects { get; set; }
        public DbSet<SubProjectStageLog> SubProjectStageLogs { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<TaskItemAssignment> TaskItemAssignments { get; set; }
        public DbSet<WorkshopLayout> WorkshopLayouts { get; set; }
        public DbSet<Pedestal> Pedestals { get; set; }
        public DbSet<MessageLog> MessageLogs { get; set; }
        public DbSet<RecentMessageLog> RecentMessageLogs { get; set; }
        // 耗材模块
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceLog> DeviceLogs { get; set; }
        public DbSet<ExaminationReport> ExaminationReports { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<MaterialSetting> MaterialSettings { get; set; }
        public DbSet<StatementDataRef> StatementDataRefs { get; set; }
        // 暂时未使用
        public DbSet<WorkshopType> WorkshopTypes { get; set; }
        public DbSet<WorkshopArrangement> WorkshopArrangements { get; set; }
        public DbSet<Workshop> Workshops { get; set; }
        public DbSet<KnowledgeBase> KnowledgeBases { get; set; }
        
        public ManufactureSysDbContext(DbContextOptions<ManufactureSysDbContext> options)
            : base(options)
        {
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
//            // ===>Tenant外键处理
//            modelBuilder.Entity<ProjectMember>().HasOne(v => v.Tenant)
//                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>Project外键处理
            // 检查SubProject丢出错误
            modelBuilder.Entity<SubProject>().HasOne(v => v.Project)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ProjectMember>().HasOne(v => v.Project)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Pedestal>().HasOne(v => v.Project)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>SubProject外键处理
            modelBuilder.Entity<Pedestal>().HasOne(v => v.SubProject)
                .WithMany().OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<SubProjectStageLog>().HasOne(v => v.SubProject)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<TaskItemAssignment>().HasOne(v => v.SubProject)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>Pedestal外键处理
            modelBuilder.Entity<SubProjectStageLog>().HasOne(v => v.Pedestal)
                .WithMany().OnDelete(DeleteBehavior.SetNull);
            //===> Procedure外键处理
            // 检查SubProject丢出错误
            modelBuilder.Entity<SubProject>().HasOne(v => v.Procedure)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ProcedureStep>().HasOne(v => v.Procedure)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>ProcedureStep外键处理
            modelBuilder.Entity<ProcedureStepTaskItem>().HasOne(v => v.ProcedureStep)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>TaskItem外键处理
            modelBuilder.Entity<ProcedureStepTaskItem>().HasOne(v => v.TaskItem)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<TaskItemAssignment>().HasOne(v => v.TaskItem)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>ProcedureStepTaskItem外键处理
            modelBuilder.Entity<TaskItemAssignment>().HasOne(v => v.ProcedureStepTaskItem)
                .WithMany(v => v.TaskItemAssignments).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<StatementDataRef>().HasOne(v => v.ProcedureStepTaskItem)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>TaskItemAssignment外键处理
            modelBuilder.Entity<SubProjectStageLog>().HasOne(v => v.TaskItemAssignment)
                .WithMany().OnDelete(DeleteBehavior.SetNull);
            // ===>FileItem外键处理
            modelBuilder.Entity<ExaminationReport>().HasOne(v => v.FileItem)
                .WithMany().OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<StatementDataRef>().HasOne(v => v.FileItem)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>WorkshopLayout外键处理
            modelBuilder.Entity<Pedestal>().HasOne(v => v.WorkshopLayout)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            // ===>Device外键处理
            modelBuilder.Entity<DeviceLog>().HasOne(v => v.Device)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ExaminationReport>().HasOne(v => v.Inventory)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Inventory>().HasOne(v => v.Provider)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<DeviceLog>().HasOne(v => v.Device)
                .WithMany().OnDelete(DeleteBehavior.Cascade);
        }

    }
}