import {Injectable} from '@angular/core';
import {PermissionCheckerService} from '@abp/auth/permission-checker.service';
import {AppSessionService} from '../session/app-session.service';

import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import {PermissionNames, RouteNames, SidebarNavRoutesData} from '@shared/AppConsts';
import {UrlHelper} from '@shared/helpers/UrlHelper';

// abp框架自带的路由守卫
@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {

  constructor(
    private _permissionChecker: PermissionCheckerService,
    private _router: Router,
    private _sessionService: AppSessionService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this._sessionService.user) {
      this._router.navigate(['/account/login']).catch();
      UrlHelper.setInitialUrl(state.url);
      return false;
    }

    if (!route.data || !route.data['permission']) {
      return true;
    }

    if (this._permissionChecker.isGranted(route.data['permission'])) {
      return true;
    }

    this._router.navigate([this.selectBestRoute(route, state)]).catch();
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  selectBestRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
    if (!this._sessionService.user) {
      return '/account/login';
    }

    if (this._permissionChecker.isGranted('Pages.Users')) {
      return '/app/admin/users';
    }
    const urls = state.url.split('/');
    console.log(state.url);
    // urls的第3位是大模块下面的页面，即urls[2]；第2位表模块，即urls[1]
    for (const menu of SidebarNavRoutesData[urls[2]]) {
      if (this._permissionChecker.isGranted(menu.permissionName)) {
        return '/app/' + menu.route;
      }
    }
    // 选择权限能够进入菜单
    // let secondRoute = '';
    // for (const permission in PermissionNames) {
    //   if (permission) {
    //     if (permission === urls[2]) {
    //       secondRoute = urls[2];
    //     }
    //     if (PermissionNames[permission].split('.').length > 1) {
    //       // 检查是否允许，构建路由
    //       if (this._permissionChecker.isGranted(PermissionNames[permission])) {
    //         return `/app/${secondRoute}/${RouteNames[permission]}`;
    //       }
    //     }
    //   }
    // }
    // if (this._permissionChecker.isGranted())
    abp.message.info('您暂时没有权限访问该模块！请向管理员申请。');
    return '/app/home';
  }
}
