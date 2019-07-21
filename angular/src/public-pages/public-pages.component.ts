import {Component, Injector, OnInit} from '@angular/core';
import {AbpEventNames} from '@shared/AppConsts';
import {AccountServiceProxy, IsTenantAvailableInput} from '@shared/service-proxies/service-proxies';
import {AppTenantAvailabilityState} from '@shared/AppEnums';
import {LoginService} from '../account/login/login.service';
import {AbpSessionService} from '@abp/session/abp-session.service';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {AppComponentBase} from '@shared/components/app-component-base';
@Component({
  template: `<router-outlet></router-outlet>`,
})
export class PublicComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private route: ActivatedRoute,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // 设置租户部分
    const tenancyName = this.route.snapshot.paramMap.get('tenancyName');
    const current = this.appSession.tenant;
    // url无tenancyName则跳过，当前和url的tenancyName相同也跳过
    console.log(tenancyName);
    if (tenancyName == null) {
    } else if (tenancyName === (current ? current.tenancyName : '')) {
    } else if (tenancyName === '') {
      // 当url的tenancyName为Host时
      abp.multiTenancy.setTenantIdCookie(undefined);
      // 触发tenant信息更新
      abp.event.trigger(AbpEventNames.sessionInit);
    } else if (tenancyName != null) {
      // 当url的tenancyName为其他时，并判断租户是否可用，然后切换租户
      const input = new IsTenantAvailableInput({tenancyName: tenancyName});
      this._accountService.isTenantAvailable(input).subscribe(result => {
        switch (result.state) {
          case AppTenantAvailabilityState.Available:
            // 如果可用
            abp.multiTenancy.setTenantIdCookie(result.tenantId);
            // 触发tenant信息更新
            abp.event.trigger(AbpEventNames.sessionInit);
            return;
          case AppTenantAvailabilityState.InActive:
            // 如果未激活
            this.message.warn(this.l('TenantIsNotActive', tenancyName));
            break;
          case AppTenantAvailabilityState.NotFound: // NotFound
            // 如果不存在
            this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', tenancyName));
            break;
        }
      });
    }
  }
}
