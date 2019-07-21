import {Component, OnInit, Injector} from '@angular/core';
import {AccountServiceProxy, TenantLoginInfoDto} from '@shared/service-proxies/service-proxies';
import {TenantChangeModalComponent} from './tenant-change-modal.component';
import {AppComponentBase} from '@shared/components/app-component-base';
import {MatDialog} from '@node_modules/@angular/material';

@Component({
  selector: 'tenant-change',
  templateUrl: './tenant-change.component.html'
})
export class TenantChangeComponent extends AppComponentBase implements OnInit {
  tenant: TenantLoginInfoDto;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit() {
    // 页面加载时初始化tenant数据
    this.tenant = this.appSession.tenant;
    // 订阅tenant的更改
    this.appSession.tenantSubject.subscribe(v => this.tenant = v);
  }

  get isMultiTenancyEnabled(): boolean {
    return abp.multiTenancy.isEnabled;
  }

  showChangeModal(): void {
    this.dialog.open(TenantChangeModalComponent, {width: '640px', data: null});
  }
}
