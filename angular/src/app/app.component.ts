import {Component, ViewContainerRef, Injector, OnInit, AfterViewInit} from '@angular/core';
import {AppComponentBase} from '@shared/components/app-component-base';
import {SignalRAspNetCoreHelper} from '@shared/helpers/SignalRAspNetCoreHelper';
import {toolbarAnimation} from '@shared/animations/toolbar-animation';
@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [toolbarAnimation]
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
  private viewContainerRef: ViewContainerRef;
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // websocket配置
    SignalRAspNetCoreHelper.initSignalR();
    abp.event.on('abp.notifications.received', userNotification => {
      // Desktop notification
      Push.create('生产管理系统通知', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    });
  }

  ngAfterViewInit(): void {
    $.AdminBSB.activateAll();
    // $.AdminBSB.activateDemo();
  }

  onResize(event) {
    // exported from $.AdminBSB.activateAll
    // $.AdminBSB.leftSideBar.setMenuHeight();
    $.AdminBSB.leftSideBar.checkStatuForResize(false);

    // exported from $.AdminBSB.activateDemo
    // $.AdminBSB.demo.setSkinListHeightAndScroll();
    // $.AdminBSB.demo.setSettingListHeightAndScroll();
  }
}
