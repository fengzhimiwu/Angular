import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, Injector, APP_INITIALIZER, LOCALE_ID} from '@angular/core';
import {PlatformLocation, registerLocaleData} from '@angular/common';

import {AbpModule} from '@abp/abp.module';
import {AbpHttpInterceptor} from '@abp/abpHttpInterceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {SharedModule} from '@shared/shared.module';
import {ServiceProxyModule} from '@shared/service-proxies/service-proxy.module';
import {RootRoutingModule} from './root-routing.module';

import {AbpEventNames, AppConsts} from '@shared/AppConsts';
import {AppSessionService} from '@shared/session/app-session.service';
import {API_BASE_URL} from '@shared/service-proxies/service-proxies';

import {RootComponent} from './root.component';
import {AppPreBootstrap} from './AppPreBootstrap';
import {ModalModule} from 'ngx-bootstrap';
import {HttpClientModule} from '@angular/common/http';

import * as _ from 'lodash';
import {environment} from './environments/environment';
import {ServiceWorkerModule} from '@node_modules/@angular/service-worker';

// abp框架自带，启动时进行各种参数配置。除了有注释的地方，其他地方不要随意修改
export function appInitializerFactory(injector: Injector,
                                      platformLocation: PlatformLocation): Function {
  return () => {    // 返回的是一个方法，是一个匿名的方法，没有方法名，只有方法体

    abp.ui.setBusy();
    return new Promise<boolean>((resolve, reject) => {
      AppConsts.appBaseHref = getBaseHref(platformLocation);
      const appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

      AppPreBootstrap.run(appBaseUrl, () => {
        abp.event.trigger('abp.dynamicScriptsInitialized');
        const appSessionService: AppSessionService = injector.get(AppSessionService);
        appSessionService.init().then((result) => {
          abp.ui.clearBusy();

          if (shouldLoadLocale()) {
            const angularLocale = convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
            import(`@angular/common/locales/${angularLocale}.js`).then(module => {
              registerLocaleData(module.default);
              resolve(result);
            }, reject);
          } else {
            resolve(result);
          }
        }, (err) => {
          abp.ui.clearBusy();
          reject(err);
        });
        // 注册appSessionService.init事件，方便更新user和tenant数据
        abp.event.on(AbpEventNames.sessionInit, () => appSessionService.refresh());
      });
    });
  };
}

export function convertAbpLocaleToAngularLocale(locale: string): string {
  if (!AppConsts.localeMappings) {
    return locale;
  }

  const localeMapings = _.filter(AppConsts.localeMappings, {from: locale});
  if (localeMapings && localeMapings.length) {
    return localeMapings[0]['to'];
  }

  return locale;
}

export function shouldLoadLocale(): boolean {
  return abp.localization.currentLanguage.name && abp.localization.currentLanguage.name !== 'en-US';
}

export function getRemoteServiceBaseUrl(): string {
  return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
  return abp.localization.currentLanguage.name;
}

// abp框架自带，启动时进行各种参数配置。除了有注释的地方，其他地方不要随意修改
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // pwa支持。上一级目录的ngsw-config.json定义了pwa的运作方式，即配置了哪些路由不经过angular
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    // 引入一些模块
    SharedModule.forRoot(),
    ModalModule.forRoot(),
    AbpModule,
    ServiceProxyModule,
    RootRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    RootComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true},
    {provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl},
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [Injector, PlatformLocation],
      multi: true
    },
    {
      provide: LOCALE_ID,
      useFactory: getCurrentLanguage
    }
  ],
  bootstrap: [RootComponent]
})
export class RootModule {
}

export function getBaseHref(platformLocation: PlatformLocation): string {
  const baseUrl = platformLocation.getBaseHrefFromDOM();
  if (baseUrl) {
    return baseUrl;
  }

  return '/';
}

function getDocumentOrigin() {
  if (!document.location.origin) {
    return document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '');
  }

  return document.location.origin;
}
