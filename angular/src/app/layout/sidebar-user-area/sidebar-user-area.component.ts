import {Component, OnInit, Injector, ViewEncapsulation} from '@angular/core';
import {AppComponentBase} from '@shared/components/app-component-base';
import {AppAuthService} from '@shared/auth/app-auth.service';
import {RouteNames} from '@shared/AppConsts';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';

/*左侧导航栏的user信息部分*/
@Component({
  templateUrl: './sidebar-user-area.component.html',
  selector: 'sidebar-user-area',
  encapsulation: ViewEncapsulation.None
})
export class SideBarUserAreaComponent extends AppComponentBase implements OnInit {
  RouteNames = RouteNames;
  shownLoginName = '';

  constructor(
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AppAuthService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.shownLoginName = this.appSession.getShownLoginName();
  }

  logout(): void {
    this._authService.logout();
  }

  gotoPersonalSetting() {
    this.router.navigate([RouteNames.home, RouteNames.homePersonalSetting], {relativeTo: this.route}).then();
  }
}
