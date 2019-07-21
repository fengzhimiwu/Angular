import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AbpHttpInterceptor} from '@abp/abpHttpInterceptor';

import * as ApiServiceProxies from './service-proxies';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {AsyncStateChangerService} from '@shared/service-proxies/async-state-changer.service';

/**
 * 本模块配置了所有的HTTP服务，即后端的接口。
 * 如果后端加入了新的服务（不是一个接口），使用nswagStudio生成新的service-proxies.ts文件后，需要将新接口注册在这里。
 */
@NgModule({
  providers: [
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.ConfigurationServiceProxy,
    // 自定义服务
    FileItemService,
    AsyncStateChangerService,
    // 自动生成的服务
    ApiServiceProxies.ProjectServiceProxy,
    ApiServiceProxies.SubProjectServiceProxy,
    ApiServiceProxies.ProcedureServiceProxy,
    ApiServiceProxies.ProcedureStepServiceProxy,
    ApiServiceProxies.WorkshopServiceProxy,
    ApiServiceProxies.WorkshopTypeServiceProxy,
    ApiServiceProxies.WorkshopLayoutServiceProxy,
    ApiServiceProxies.PedestalServiceProxy,
    ApiServiceProxies.TaskItemServiceProxy,
    ApiServiceProxies.ProjectMemberServiceProxy,
    ApiServiceProxies.WorkshopArrangementServiceProxy,
    ApiServiceProxies.SubProjectStageLogServiceProxy,
    ApiServiceProxies.TaskItemAssignmentServiceProxy,
    ApiServiceProxies.SystemSettingServiceProxy,
    ApiServiceProxies.MessageSystemServiceProxy,
    ApiServiceProxies.ProductionServiceProxy,
    ApiServiceProxies.HomeServiceProxy,
    ApiServiceProxies.ProcedureStepTaskItemsServiceProxy,
    ApiServiceProxies.StatementDataRefServiceProxy,
    ApiServiceProxies.StatementServiceProxy,
    ApiServiceProxies.DeviceServiceProxy,
    ApiServiceProxies.ProviderServiceProxy,
    ApiServiceProxies.InventoryServiceProxy,
    ApiServiceProxies.ExaminationServiceProxy,
    ApiServiceProxies.MaterialSettingServiceProxy,
    ApiServiceProxies.ProductionRoutineServiceProxy,
    {provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true}
  ]
})
export class ServiceProxyModule {
}
