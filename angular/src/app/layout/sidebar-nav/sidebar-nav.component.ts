import {Component, Injector, ViewEncapsulation, OnInit, Input, OnDestroy, ElementRef, ViewChildren, QueryList} from '@angular/core';
import {AppComponentBase} from '@shared/components/app-component-base';
import {MenuItem} from '@shared/models/menu-item';
import {ActivatedRoute, NavigationEnd, Router, UrlSegment} from '@node_modules/@angular/router';
import {PermissionNames, RouteNames, SidebarNavRoutesData} from '@shared/AppConsts';
import {filter, finalize} from '@node_modules/rxjs/operators';
import {Subscription} from '@node_modules/rxjs';

/*左侧导航栏*/
@Component({
  selector: 'sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarNavComponent extends AppComponentBase implements OnInit, OnDestroy {
  subscriptionRouter: Subscription;
  @Input() menuItems: MenuItem[] = [];

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(injector);
    this.subscriptionRouter = this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      finalize(() => {})
    ).subscribe((v: NavigationEnd) => {
      const path = v.urlAfterRedirects.split('/')[2];
      this.menuItems = SidebarNavRoutesData[path];
    });
  }

  ngOnInit() {
    this.route.firstChild.url.pipe(
    ).subscribe((v: UrlSegment[]) => this.menuItems = SidebarNavRoutesData[v[0].path]);
  }

  showMenuItem(menuItem): boolean {
    if (menuItem.permissionName) {
      return this.permission.isGranted(menuItem.permissionName);
    }
    return true;
  }
  ngOnDestroy() {
    this.subscriptionRouter.unsubscribe();
  }
}
