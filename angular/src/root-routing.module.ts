import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

// 配置了两个二级模块的路由
const routes: Routes = [
  {path: '', redirectTo: '/app/home', pathMatch: 'full'},
  {
    path: 'account',
    loadChildren: 'account/account.module#AccountModule', // Lazy load account module
    data: {preload: true}
  },
  {
    path: 'app',
    loadChildren: 'app/app.module#AppModule', // Lazy load account module
    data: {preload: true}
  },
  {
    path: 'public',
    loadChildren: 'public-pages/public-pages.module#PublicPagesModule', // Lazy load account module
    data: {preload: true}
  }
];

@NgModule({
  // 根模块路由{preloadingStrategy: PreloadAllModules}配置了子模块预加载
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
  providers: []
})
export class RootRoutingModule {
}
