import * as moment from 'moment';
import {AppConsts} from '@shared/AppConsts';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Type, CompilerOptions, NgModuleRef} from '@angular/core';
import {environment} from './environments/environment';

// abp框架自带，启动时进行各种参数配置。除了有注释的地方，其他地方不要随意修改
export class AppPreBootstrap {

  static run(appRootUrl: string, callback: () => void): void {
    AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
      AppPreBootstrap.getUserConfiguration(callback);
    });
  }

  static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
  }

  private static getApplicationConfig(appRootUrl: string, callback: () => void) {
    return abp.ajax({
      url: appRootUrl + 'assets/' + environment.appConfig,
      method: 'GET',
      headers: {
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
      }
    }).done(result => {
      AppConsts.appBaseUrl = result.appBaseUrl;
      AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl;
      AppConsts.localeMappings = result.localeMappings;
      callback();
    });
  }

  private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  private static getUserConfiguration(callback: () => void): JQueryPromise<any> {
    return abp.ajax({
      url: AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + abp.auth.getToken(),
        '.AspNetCore.Culture': abp.utils.getCookieValue('Abp.Localization.CultureName'),
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
      }
    }).done(result => {
      $.extend(true, abp, result);
      abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);
      // 设置时间语言与时区
      // moment.locale(abp.localization.currentLanguage.name);
      moment.locale('zh-cn');
      if (abp.clock.provider.supportsMultipleTimezone) {
        moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
      }
      callback();
    }).fail(() => {
      abp.message.error('服务器未响应，请刷新重试');
    });
  }
}
