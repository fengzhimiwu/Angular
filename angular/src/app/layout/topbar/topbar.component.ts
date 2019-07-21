import {Component, Injector, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {AppComponentBase} from '@shared/components/app-component-base';
import {AppConsts, PermissionNames, SidebarNavRoutesData} from '@shared/AppConsts';
import {filter, finalize, first, map, tap} from '@node_modules/rxjs/operators';
import {NavigationEnd, Router} from '@node_modules/@angular/router';
import {Subscription} from '@node_modules/rxjs';
import {HomeServiceProxy, MessageSystemServiceProxy} from '@shared/service-proxies/service-proxies';
import {fadeIn} from '@shared/animations/data-animation';
import {toolbarAnimation} from '@shared/animations/toolbar-animation';

/*顶部导航栏*/
@Component({
  templateUrl: './topbar.component.html',
  selector: 'top-bar',
  styleUrls: ['topbar.component.css'],
  animations: [toolbarAnimation]
  // encapsulation: ViewEncapsulation.None
})
export class TopBarComponent extends AppComponentBase implements OnInit, OnDestroy {
  messageNum = 0;
  private listener: () => void;

  constructor(
    injector: Injector,
    private router: Router,
    private _homeService: HomeServiceProxy,
    private _messageService: MessageSystemServiceProxy,
    private render: Renderer2,
  ) {
    super(injector);
    // 初始化接收消息事件
    this.stateChanger.init('messageNum', 0, () => {
      // 从服务器取消息数量
      this._messageService.getMessageNum().subscribe((result) => this.messageNum = result);
    });
    this.stateChanger.states['isToolbarHidden'] = false;
  }

  ngOnInit(): void {
    // 模板自带的代码
    $('body').addClass('theme-' + this.setting.get('App.UiTheme'));
    // 监听滚动事件
    let previousYOffset = window.pageYOffset;
    this.listener = this.render.listen('window', 'scroll', (event) => {
      // console.log(event.path[1].pageYOffset)
      const position = event.path[1].pageYOffset + event.path[0].body.clientHeight;
      // 向下滚动
      if (window.pageYOffset - previousYOffset > 0) {
        this.stateChanger.states['isToolbarHidden'] = true;
      // 向上滚动
      } else if (window.pageYOffset - previousYOffset < 0) {
        this.stateChanger.states['isToolbarHidden'] = false;
      }
      previousYOffset = window.pageYOffset;
    });
  }
  // 用于判断是否显示该模组
  ifShowModule(routeName: string): boolean {
    if (PermissionNames[routeName]) {
      return this.permission.isGranted(PermissionNames[routeName]);
    }
    return true;
  }

  ngOnDestroy() {
    // 释放资源
    this.stateChanger.destroy('messageNum');
    this.listener();
  }
}
