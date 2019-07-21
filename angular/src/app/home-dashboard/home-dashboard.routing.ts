import {NgModule} from '@node_modules/@angular/core';
import {RouterModule, Routes} from '@node_modules/@angular/router';
import {HomeDashboardComponent} from './home-dashboard.component';
import {RouteNames} from '@shared/AppConsts';
import {SubProjectRelationalInfoComponent} from '@app/home-dashboard/sub-project-relational-info/sub-project-relational-info.component';
import {PersonalSettingComponent} from '@app/home-dashboard/personal-setting/personal-setting.component';

const routes: Routes = [
  {path: '', component: HomeDashboardComponent},
  {path: RouteNames.homeRelationalInfo, component: SubProjectRelationalInfoComponent},
  {path: RouteNames.homePersonalSetting, component: PersonalSettingComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeDashboardRouting { }
