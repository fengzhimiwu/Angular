import {NgModule} from '@node_modules/@angular/core';
import {RouterModule, Routes} from '@node_modules/@angular/router';
import {MaterialManagementComponent} from '@app/material-management/material-management.component';
import {PermissionNames, RouteNames} from '@shared/AppConsts';
import {AppRouteGuard} from '@shared/auth/auth-route-guard';
import {DevicesComponent} from '@app/material-management/devices/devices.component';
import {ProvidersComponent} from '@app/material-management/providers/providers.component';
import {ExaminationsComponent} from '@app/material-management/examinations/examinations.component';
import {MaterialSettingsComponent} from '@app/material-management/material-settings/material-settings.component';
import {InventoriesComponent} from '@app/material-management/inventories/inventories.component';

const routes: Routes = [
  {
    path: '', component: MaterialManagementComponent, children: [
      {path: '', redirectTo: RouteNames.materialDevices, pathMatch: 'full'},
      {
        path: RouteNames.materialDevices,
        component: DevicesComponent,
        canActivate: [AppRouteGuard],
        data: {permission: PermissionNames.materialDevices}
      },
      {
        path: RouteNames.materialProviders,
        component: ProvidersComponent,
        canActivate: [AppRouteGuard],
        data: {permission: PermissionNames.materialProviders}
      },
      {
        path: RouteNames.materialInventories,
        component: InventoriesComponent,
        canActivate: [AppRouteGuard],
        data: {permission: PermissionNames.materialInventories}
      },
      {
        path: RouteNames.materialExaminations,
        component: ExaminationsComponent,
        canActivate: [AppRouteGuard],
        data: {permission: PermissionNames.materialExaminations}
      },
      {
        path: RouteNames.materialSettings,
        component: MaterialSettingsComponent,
        canActivate: [AppRouteGuard],
        data: {permission: PermissionNames.materialSettings}
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MaterialManagementRouting {

}
