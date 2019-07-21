import {NgModule} from '@node_modules/@angular/core';
import {RouterModule, Routes} from '@node_modules/@angular/router';
import {ProductionManagementComponent} from '@app/production-management/production-management.component';
import {PermissionNames, RouteNames} from '@shared/AppConsts';
import {MyTasksComponent} from '@app/production-management/my-tasks/my-tasks.component';
import {AppRouteGuard} from '@shared/auth/auth-route-guard';
import {TaskDetailComponent} from '@app/production-management/my-tasks/task-detail/task-detail.component';
import {MyTasksFinishedComponent} from '@app/production-management/my-tasks-finished/my-tasks-finished.component';
import {MyTasksCooperatedComponent} from '@app/production-management/my-tasks-cooperated/my-tasks-cooperated.component';
import {ProductionDistributionStep3Component
} from '@app/production-management/production-distribution/production-distribution-step3/production-distribution-step3.component';
import {ProductionDistributionStep1Component
} from '@app/production-management/production-distribution/production-distribution-step1/production-distribution-step1.component';
import {ProductionDistributionStep2Component
} from '@app/production-management/production-distribution/production-distribution-step2/production-distribution-step2.component';
import {MyTasksPublishedComponent} from '@app/production-management/my-tasks-published/my-tasks-published.component';
import {ProductionRoutineComponent} from '@app/production-management/production-routine/production-routine.component';

const routes: Routes = [{
  path: '', component: ProductionManagementComponent, children: [{
    path: '', redirectTo: RouteNames.productionMyTask, pathMatch: 'full'
  }, { // 我的任务
    path: RouteNames.productionMyTask,
    component: MyTasksComponent,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionMyTask}
  }, {
    path: RouteNames.productionMyTask + '/:id',
    component: TaskDetailComponent,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionMyTask}
  }, { // 已完成任务
    path: RouteNames.productionTaskFinished,
    component: MyTasksFinishedComponent,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionMyTask}
  }, { // 合作任务
    path: RouteNames.productionTaskCooperated,
    component: MyTasksCooperatedComponent,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionMyTask}
  }, { // 我发布的任务
    path: RouteNames.productionTaskPublished,
    component: MyTasksPublishedComponent,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionMyTask}
  }, { // 台座分派
    path: RouteNames.productionPedestalAssignment,
    component: ProductionDistributionStep1Component,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionManagement}
  }, { // 任务分派
    path: RouteNames.productionTaskAssignment,
    component: ProductionDistributionStep2Component,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionManagement}
  }, { // 已完成管理
    path: RouteNames.productionCompletionAssignment,
    component: ProductionDistributionStep3Component,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionManagement}
  }, { // 日常任务
    path: RouteNames.productionRoutine,
    component: ProductionRoutineComponent,
    canActivate: [AppRouteGuard],
    data: {permission: PermissionNames.productionManagement}
  }]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProductionManagementRouting {

}
