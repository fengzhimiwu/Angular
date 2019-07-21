import {Component, Injector, Inject} from '@angular/core';
import {AppComponentBase} from '@shared/components/app-component-base';
import {AccountServiceProxy} from '@shared/service-proxies/service-proxies';
import {IsTenantAvailableInput, IsTenantAvailableOutput} from '@shared/service-proxies/service-proxies';
import {AppTenantAvailabilityState} from '@shared/AppEnums';
import {finalize} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {AbpEventNames} from '@shared/AppConsts';

@Component({
  selector: 'tenantChangeModal',
  templateUrl: './tenant-change-modal.component.html'
})
export class TenantChangeModalComponent extends AppComponentBase {
  tenancyName = '';
  saving = false;

  constructor(
    private _accountService: AccountServiceProxy,
    injector: Injector,
    private dialogRef: MatDialogRef<TenantChangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
  ) {
    super(injector);
  }

  save(): void {
    if (!this.tenancyName) {
      abp.multiTenancy.setTenantIdCookie(undefined);
      this.close();
      // 触发tenant信息更新
      abp.event.trigger(AbpEventNames.sessionInit);
      return;
    }
    // 判断租户是否可用，并切换租户
    const input = new IsTenantAvailableInput({tenancyName: this.tenancyName});
    this.saving = true;
    this._accountService.isTenantAvailable(input).pipe(finalize(() => this.saving = false)).subscribe(result => {
      switch (result.state) {
        case AppTenantAvailabilityState.Available:
          // 如果可用
          abp.multiTenancy.setTenantIdCookie(result.tenantId);
          this.close();
          // 触发tenant信息更新
          abp.event.trigger(AbpEventNames.sessionInit);
          return;
        case AppTenantAvailabilityState.InActive:
          // 如果未激活
          this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
          break;
        case AppTenantAvailabilityState.NotFound: // NotFound
          // 如果不存在
          this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));
          break;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
