import {Injector, ElementRef, OnDestroy} from '@angular/core';
import {AppConsts} from '../AppConsts';
import {LocalizationService} from '@abp/localization/localization.service';
import {PermissionCheckerService} from '@abp/auth/permission-checker.service';
import {FeatureCheckerService} from '@abp/features/feature-checker.service';
import {NotifyService} from '@abp/notify/notify.service';
import {SettingService} from '@abp/settings/setting.service';
import {MessageService} from '@abp/message/message.service';
import {AbpMultiTenancyService} from '@abp/multi-tenancy/abp-multi-tenancy.service';
import {AppSessionService} from '../session/app-session.service';
import {MatDialog, MatSnackBar} from '@node_modules/@angular/material';
import {AsyncStateChangerService} from '@shared/service-proxies/async-state-changer.service';
import {ActivatedRouteSnapshot} from '@node_modules/@angular/router';
import {LoadingDialogComponent} from '@shared/components/loading-dialog/loading-dialog.component';
import {Subscription} from '@node_modules/rxjs';

// abp框架自带的组件基类
export abstract class AppComponentBase implements OnDestroy {
  // 订阅列表会在destroy调用后清空订阅
  subscriptions: Subscription[] = [];
  // 通用的底部通知栏
  snackBar: MatSnackBar;
  stateChanger: AsyncStateChangerService;
  // abp框架自带的一些服务注入
  localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  localization: LocalizationService;
  permission: PermissionCheckerService;
  feature: FeatureCheckerService;
  notify: NotifyService;
  setting: SettingService;
  message: MessageService;
  multiTenancy: AbpMultiTenancyService;
  appSession: AppSessionService;
  elementRef: ElementRef;

  protected constructor(injector: Injector) {
    this.snackBar = injector.get(MatSnackBar);
    this.stateChanger = injector.get(AsyncStateChangerService);
    this.localization = injector.get(LocalizationService);
    this.permission = injector.get(PermissionCheckerService);
    this.feature = injector.get(FeatureCheckerService);
    this.notify = injector.get(NotifyService);
    this.setting = injector.get(SettingService);
    this.message = injector.get(MessageService);
    this.multiTenancy = injector.get(AbpMultiTenancyService);
    this.appSession = injector.get(AppSessionService);
    this.elementRef = injector.get(ElementRef);
  }

  l(key: string, ...args: any[]): string {
    let localizedText = this.localization.localize(key, this.localizationSourceName);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, args);
  }

  isGranted(permissionName: string): boolean {
    return this.permission.isGranted(permissionName);
  }

  openLoadingDialog(dialog: MatDialog) {
    return dialog.open(LoadingDialogComponent, {width: '480px', disableClose: true});
  }
  // when component destroyed, subscription will unsubscribe
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
