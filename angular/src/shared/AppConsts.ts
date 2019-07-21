import {MenuItem} from '@shared/models/menu-item';

// 存放系统内使用的各种常量
export class AppConsts {

  static remoteServiceBaseUrl: string;
  static appBaseUrl: string;
  static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

  static localeMappings: any = [
    {
      'from': 'pt-BR',
      'to': 'pt'
    },
    {
      'from': 'zh-CN',
      'to': 'zh'
    },
    {
      'from': 'he-IL',
      'to': 'he'
    }
  ];

  static readonly userManagement = {
    defaultAdminUserName: 'admin'
  };

  static readonly localization = {
    defaultLocalizationSourceName: 'ManufactureSys'
  };

  static readonly authorization = {
    encrptedAuthTokenName: 'enc_auth_token'
  };
}
// 路由
export class RouteNames {
  readonly [index: string]: string

  // 主页在生产下面，但是无权限控制
  static readonly home = 'home';
  static readonly homeRelationalInfo = 'relational-info';
  static readonly homePersonalSetting = 'personal-setting';
  // 材料
  static readonly material = 'material';
  static readonly materialProviders = 'providers';
  static readonly materialInventories = 'inventories';
  static readonly materialDevices = 'devices';
  static readonly materialExaminations = 'examinations';
  static readonly materialSettings = 'settings';
  // 系统相关
  static readonly system = 'system';
  static readonly systemTenant = 'tenants';
  static readonly systemUser = 'users';
  static readonly systemRole = 'roles';
  static readonly systemProcedure = 'procedure';
  static readonly systemRoutines = 'routine';
  static readonly systemWorkshopLayout = 'workshop/workshopLayout';
  static readonly systemWorkshopType = 'workshop-types';
  static readonly systemTaskItem = 'task-item';
  // 参数配置管理
  static readonly systemSetting = 'setting';
  static readonly systemStatement = 'statement';
  // 系统监测管理 systemMonitor
  static readonly systemMonitor = 'monitor';
  // 项目管理
  static readonly project = 'project';
  static readonly projectManagement = 'management';
  static readonly projectBimModel = 'bim-model';
  static readonly projectMember = 'member';
  static readonly projectWorkshop = 'workshop';
  static readonly projectPlan = 'plan';
  static readonly projectBindSubProject = 'bind-sub-project';
  static readonly projectAdjustSubProject = 'adjust-sub-project';
  static readonly projectQuality = 'quality';
  static readonly projectStatements = 'statements';
  // 生产路由
  static readonly production = 'production';
  static readonly productionMyTask = 'my-task';
  static readonly productionTaskFinished = 'tasks-finished';
  static readonly productionTaskCooperated = 'tasks-cooperated';
  static readonly productionTaskPublished = 'tasks-published';
  static readonly productionPedestalAssignment = 'pedestal-assignment';
  static readonly productionTaskAssignment = 'task-assignment';
  static readonly productionCompletionAssignment = 'completion-assignment';
  static readonly productionRoutine = 'routine-maintenance';
}

export class PermissionNames {
  readonly [index: string]: string

  // 材料权限
  static readonly material = 'Material';
  static readonly materialProviders = 'Material.Providers';
  static readonly materialInventories = 'Material.Inventories';
  static readonly materialDevices = 'Material.Devices';
  static readonly materialExaminations = 'Material.Examinations';
  static readonly materialSettings = 'Material.Settings';
  // 系统权限
  static readonly system = 'System';
  static readonly systemTenant = 'System.Tenants';
  static readonly systemUser = 'System.Users';
  static readonly systemRole = 'System.Roles';
  static readonly systemProcedure = 'System.Procedure';
  static readonly systemWorkshop = 'System.Workshop';
  static readonly systemTaskItem = 'System.TaskItem';
  static readonly systemStatement = 'System.StatementTemplate';
  static readonly systemSetting = 'System.Setting';
  // 项目权限
  static readonly project = 'Project';
  static readonly projectManagement = 'Project.Management';
  static readonly projectPlan = 'Project.Plan';
  static readonly projectQuality = 'Project.Quality';
  static readonly projectStatements = 'Project.Statements';
  // 生产权限
  static readonly production = 'Production';
  static readonly productionMyTask = 'Production.MyTask';
  static readonly productionManagement = 'Production.Management';
}

export class ColorConsts {
  // 梁片：蓝色#03a9f4等待分派台座，（起始）深蓝#2196f3等待分派任务，黄色#ff9800正在生产，（结束）绿色#4caf50完成，
  static readonly waitWorkshop = '#9C27B0';
  static readonly waitWorkshopClass = 'bg-purple';
  static readonly waitAssignment = '#2196f3';
  static readonly waitAssignmentClass = 'bg-blue';
  static readonly inProcessing = '#ff9800';
  static readonly inProcessingClass = 'bg-orange';
  static readonly inCompleting = '#4caf50';
  static readonly inCompletingClass = 'bg-green';
}

export class SidebarNavRoutesData {
  readonly [index: string]: MenuItem[]

  static readonly 'material': MenuItem[] = [
    new MenuItem('设备管理', PermissionNames.materialDevices, 'device_hub', `${RouteNames.material}/${RouteNames.materialDevices}`),
    new MenuItem('供应商', PermissionNames.materialProviders, 'local_shipping', `${RouteNames.material}/${RouteNames.materialProviders}`),
    new MenuItem('材料库存', PermissionNames.materialInventories, 'storage', `${RouteNames.material}/${RouteNames.materialInventories}`),
    new MenuItem('送检信息', PermissionNames.materialExaminations, 'colorize', `${RouteNames.material}/${RouteNames.materialExaminations}`),
    new MenuItem('材料参数', PermissionNames.materialSettings, 'settings', `${RouteNames.material}/${RouteNames.materialSettings}`),
  ];
  static readonly 'system': MenuItem[] = [
    new MenuItem('用户管理', PermissionNames.systemUser, 'people', `${RouteNames.system}/${RouteNames.systemUser}`),
    new MenuItem('角色管理', PermissionNames.systemRole, 'local_offer', `${RouteNames.system}/${RouteNames.systemRole}`),
    new MenuItem('租户管理', PermissionNames.systemTenant, 'business', `${RouteNames.system}/${RouteNames.systemTenant}`),
    new MenuItem('工作项管理', PermissionNames.systemTaskItem, 'assignment', `${RouteNames.system}/${RouteNames.systemTaskItem}`),
    new MenuItem('工序管理', PermissionNames.systemProcedure, 'timeline', `${RouteNames.system}/${RouteNames.systemProcedure}`),
    new MenuItem('日常任务管理', PermissionNames.systemProcedure, 'update', `${RouteNames.system}/${RouteNames.systemRoutines}`),
    // 如果有了台座类型管理，可能会变为2级菜单
    new MenuItem('工作台管理', PermissionNames.systemWorkshop, 'view_week', `${RouteNames.system}/${RouteNames.systemWorkshopLayout}`),
    // new MenuItem('工作台管理', PermissionNames.systemWorkshop, 'view_week', '', [
      // new MenuItem('类别管理', '', '', `${RouteNames.system}/${RouteNames.systemWorkshopType}`, []),
      // new MenuItem('布局管理', '', '', `${RouteNames.system}/${RouteNames.systemWorkshopLayout}`, []),
    // ]),
    // new MenuItem('生产监测', PermissionNames.systemWorkshop, 'pageview', `${RouteNames.system}/${RouteNames.systemMonitor}`),
    new MenuItem('报表模板', PermissionNames.systemStatement, 'library_books', `${RouteNames.system}/${RouteNames.systemStatement}`),
    new MenuItem('系统参数', PermissionNames.systemSetting, 'settings_brightness', `${RouteNames.system}/${RouteNames.systemSetting}`),
  ];
  static readonly 'project': MenuItem[] = [
    new MenuItem('项目管理', PermissionNames.projectManagement, 'toc', '', [
      new MenuItem('项目列表', '', '', `${RouteNames.project}/${RouteNames.projectManagement}`),
      new MenuItem('模型管理', '', '', `${RouteNames.project}/${RouteNames.projectBimModel}`),
      new MenuItem('人员管理', '', '', `${RouteNames.project}/${RouteNames.projectMember}`),
      new MenuItem('布局选择', '', '', `${RouteNames.project}/${RouteNames.projectWorkshop}`),
    ]),
    new MenuItem('构件与排产', PermissionNames.projectPlan, 'book', '', [
      new MenuItem('手工管理构件', '', '', `${RouteNames.project}/${RouteNames.projectPlan}`),
      new MenuItem('通过模型管理构件', '', '', `${RouteNames.project}/${RouteNames.projectBindSubProject}`),
      new MenuItem('调整计划', '', '', `${RouteNames.project}/${RouteNames.projectAdjustSubProject}`),
    ]),
    new MenuItem('报表生成', PermissionNames.projectStatements, 'print', `${RouteNames.project}/${RouteNames.projectStatements}`),
    // new MenuItem('质量管理', PermissionNames.projectQuality, 'donut_large', `${RouteNames.project}/${RouteNames.projectQuality}`),
  ];
  static readonly 'home': MenuItem[] = [
    new MenuItem('首页', '', 'home', RouteNames.home),
    new MenuItem('我的任务', PermissionNames.productionMyTask, 'event_note', '', [
      new MenuItem('待完成', '', '', `${RouteNames.production}/${RouteNames.productionMyTask}`),
      new MenuItem('合作任务', '', '', `${RouteNames.production}/${RouteNames.productionTaskCooperated}`),
      new MenuItem('已完成', '', '', `${RouteNames.production}/${RouteNames.productionTaskFinished}`),
      new MenuItem('我派发的', '', '', `${RouteNames.production}/${RouteNames.productionTaskPublished}`),
    ]),
    new MenuItem('施工管理', PermissionNames.productionManagement, 'work', '', [
      new MenuItem('台座分派', '', '', `${RouteNames.production}/${RouteNames.productionPedestalAssignment}`),
      new MenuItem('任务分派', '', '', `${RouteNames.production}/${RouteNames.productionTaskAssignment}`),
      new MenuItem('管理已完成', '', '', `${RouteNames.production}/${RouteNames.productionCompletionAssignment}`),

    ]),
    new MenuItem('日常维护', PermissionNames.productionManagement, 'today', `${RouteNames.production}/${RouteNames.productionRoutine}`),
  ];
  static readonly 'production': MenuItem[] = SidebarNavRoutesData['home'];
  static readonly 'communication': MenuItem[] = SidebarNavRoutesData['production'];
}

export class AbpEventNames {
  // 收到消息事件
  static readonly messageReceived = 'app.message.messageReceived';
  // singlaR链接状态改变事件
  static readonly connectionStateChange = 'app.message.connectionStateChange';
  // 侧边栏打开事件
  static readonly rightSideBarOpen = 'app.layout.rightSideBarOpen';
  // user或tenant数据初始化事件。一般用于更新租户信息或者用户信息
  static readonly sessionInit = 'app.session.sessionInit';
}
