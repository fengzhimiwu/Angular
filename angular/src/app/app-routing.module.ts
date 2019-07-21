import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {AppRouteGuard} from '@shared/auth/auth-route-guard';
import {PermissionNames, RouteNames} from '@shared/AppConsts';

const routes: Routes = [{
  path: '',
  component: AppComponent,
  children: [
    {
      path: RouteNames.home,
      loadChildren: './home-dashboard/home-dashboard.module#HomeDashboardModule',
      data: {preload: true},
      canActivate: [AppRouteGuard]
    },
    {
      path: RouteNames.production,
      loadChildren: './production-management/production-management.module#ProductionManagementModule',
      data: {preload: true, permission: PermissionNames.production},
      canActivate: [AppRouteGuard]
    },
    {
      path: RouteNames.project,
      loadChildren: './project-management/project-management.module#ProjectManagementModule',
      data: {preload: true, permission: PermissionNames.project},
      canActivate: [AppRouteGuard]
    },
    {
      path: RouteNames.system,
      loadChildren: './system-management/system-management.module#SystemManagementModule',
      data: {preload: true, permission: PermissionNames.system},
      canActivate: [AppRouteGuard]
    },
    {
      path: RouteNames.material,
      loadChildren: './material-management/material-management.module#MaterialManagementModule',
      data: {preload: true, permission: PermissionNames.material},
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
export class AppRoutingModule {
}
