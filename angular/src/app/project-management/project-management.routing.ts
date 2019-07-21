import {NgModule} from '@node_modules/@angular/core';
import {RouterModule, Routes} from '@node_modules/@angular/router';
import {ProjectsComponent} from '@app/project-management/projects/projects.component';
import {ProjectManagementComponent} from '@app/project-management/project-management.component';
import {ProjectDetailComponent} from '@app/project-management/projects/project-detail/project-detail.component';
import {PermissionNames, RouteNames} from '@shared/AppConsts';
import {PlansComponent} from '@app/project-management/plans/plans.component';
import {QualityComponent} from '@app/project-management/quality/quality.component';
import {AppRouteGuard} from '@shared/auth/auth-route-guard';
import {ProjectMembersComponent} from '@app/project-management/projects/project-members/project-members.component';
import {ProjectModelComponent} from '@app/project-management/projects/project-model/project-model.component';
import {ProjectWorkshopComponent} from '@app/project-management/projects/project-workshop/project-workshop.component';
import {BindSubProjectComponent} from '@app/project-management/plans/bind-sub-project/bind-sub-project.component';
import {StatementsComponent} from '@app/project-management/statements/statements.component';
import {AdjustSubProjectComponent} from '@app/project-management/plans/adjust-sub-project/adjust-sub-project.component';

const routes: Routes = [{
  path: '', component: ProjectManagementComponent, children: [
    {path: '', redirectTo: RouteNames.projectManagement, pathMatch: 'full'},
    // 项目列表与详情
    {
      path: RouteNames.projectManagement,
      component: ProjectsComponent,
      data: {permission: PermissionNames.projectManagement},
      canActivate: [AppRouteGuard],
    },
    {
      path: RouteNames.projectManagement + '/:id', component: ProjectDetailComponent,
      data: {permission: PermissionNames.projectManagement},
      canActivate: [AppRouteGuard],
    },
    // 项目模型
    {
      path: RouteNames.projectBimModel, component: ProjectModelComponent,
      data: {permission: PermissionNames.projectManagement},
      canActivate: [AppRouteGuard],
    },
    // 项目成员
    {
      path: RouteNames.projectMember, component: ProjectMembersComponent,
      data: {permission: PermissionNames.projectManagement},
      canActivate: [AppRouteGuard],
    },
    // 项目台座管理
    {
      path: RouteNames.projectWorkshop, component: ProjectWorkshopComponent,
      data: {permission: PermissionNames.projectManagement},
      canActivate: [AppRouteGuard],
    },
    // 手工生成构件
    {
      path: RouteNames.projectPlan,
      component: PlansComponent,
      data: {permission: PermissionNames.projectPlan},
      canActivate: [AppRouteGuard]
    },
    // 模型生成构件
    {
      path: RouteNames.projectBindSubProject,
      component: BindSubProjectComponent,
      data: {permission: PermissionNames.projectPlan},
      canActivate: [AppRouteGuard]
    },
    // 调整计划
    {
      path: RouteNames.projectAdjustSubProject,
      component: AdjustSubProjectComponent,
      data: {permission: PermissionNames.projectPlan},
      canActivate: [AppRouteGuard]
    },
    // 报表打印
    {
      path: RouteNames.projectStatements,
      component: StatementsComponent,
      data: {permission: PermissionNames.projectStatements},
      canActivate: [AppRouteGuard]
    },
    {
      path: RouteNames.projectQuality,
      component: QualityComponent,
      data: {permission: PermissionNames.projectQuality},
      canActivate: [AppRouteGuard]
    }
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectManagementRouting {
}
