import {NgModule} from '@node_modules/@angular/core';
import {RouterModule, Routes} from '@node_modules/@angular/router';
import {AppRouteGuard} from '@shared/auth/auth-route-guard';
import {UsersComponent} from '@app/system-management/users/users.component';
import {RolesComponent} from '@app/system-management/roles/roles.component';
import {TenantsComponent} from '@app/system-management/tenants/tenants.component';
import {SystemManagementComponent} from '@app/system-management/system-management.component';
import {PermissionNames, RouteNames} from '@shared/AppConsts';
import {WorkshopTypesComponent} from '@app/system-management/workbenchs/workshop-types/workshop-types.component';
import {WorkshopLayoutComponent} from '@app/system-management/workbenchs/workshop-layout/workshop-layout.component';
import {ProceduresComponent} from '@app/system-management/procedures/procedures.component';
import {ProcedureStepsComponent} from '@app/system-management/procedures/procedure-steps/procedure-steps.component';
import {TaskItemsComponent} from '@app/system-management/task-items/task-items.component';
import {TaskItemFormComponent} from '@app/system-management/task-items/task-item-form/task-item-form.component';
import {SystemSettingComponent} from '@app/system-management/system-settings/system-setting.component';
import {MonitorComponent} from './monitor/monitor.component';
import {StatementTemplatesComponent} from '@app/system-management/statement-templates/statement-templates.component';
import {RoutinesComponent} from '@app/system-management/routines/routines.component';

const routes: Routes = [{
  path: '', component: SystemManagementComponent, children: [
    {path: '', redirectTo: RouteNames.systemUser, pathMatch: 'full'},
    {path: RouteNames.systemUser, component: UsersComponent, data: {permission: PermissionNames.systemUser}, canActivate: [AppRouteGuard]},
    {path: RouteNames.systemRole, component: RolesComponent, data: {permission: PermissionNames.systemRole}, canActivate: [AppRouteGuard]},
    { // 租户
      path: RouteNames.systemTenant, component: TenantsComponent,
      data: {permission: PermissionNames.systemTenant}, canActivate: [AppRouteGuard]
    },
    { // 台座类型 预留
      path: RouteNames.systemWorkshopType, component: WorkshopTypesComponent,
      data: {permission: PermissionNames.systemWorkshop}, canActivate: [AppRouteGuard]
    },
    { // 台座布局
      path: RouteNames.systemWorkshopLayout, component: WorkshopLayoutComponent,
      data: {permission: PermissionNames.systemWorkshop}, canActivate: [AppRouteGuard]
    },
    { // 工作项
      path: RouteNames.systemTaskItem, component: TaskItemsComponent,
      data: {permission: PermissionNames.systemTaskItem}, canActivate: [AppRouteGuard]
    },
    {
      path: RouteNames.systemTaskItem + '/:id', component: TaskItemFormComponent,
      data: {permission: PermissionNames.systemTaskItem}, canActivate: [AppRouteGuard]
    },
    { // 工序
      path: RouteNames.systemProcedure, component: ProceduresComponent,
      data: {permission: PermissionNames.systemProcedure}, canActivate: [AppRouteGuard],
    },
    {
      path: RouteNames.systemProcedure + '/:id', component: ProcedureStepsComponent,
      data: {permission: PermissionNames.systemProcedure}, canActivate: [AppRouteGuard],
    },
    { // 日常工作
      path: RouteNames.systemRoutines, component: RoutinesComponent,
      data: {permission: PermissionNames.systemProcedure}, canActivate: [AppRouteGuard],
    },
    { // 报表
      path: RouteNames.systemStatement,
      component: StatementTemplatesComponent,
      data: {permission: PermissionNames.systemStatement},
      canActivate: [AppRouteGuard]
    },
    { // 系统参数
      path: RouteNames.systemSetting,
      component: SystemSettingComponent,
      data: {permission: PermissionNames.systemSetting},
      canActivate: [AppRouteGuard]
    },
    { // 系统监测
      path: RouteNames.systemMonitor,
      component: MonitorComponent,
      data: {permission: PermissionNames.systemWorkshop},
      canActivate: [AppRouteGuard]
    },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SystemManagementRouting {
}
