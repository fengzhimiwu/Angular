import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '../session/app-session.service';

// abp框架自带，url的一个服务，用于url的各种处理。除了有注释的地方，其他地方不要随意修改
@Injectable()
export class AppUrlService {

    static tenancyNamePlaceHolder: string = '{TENANCY_NAME}';

    constructor(
        private readonly _appSessionService: AppSessionService
    ) {

    }

    get appRootUrl(): string {
        if (this._appSessionService.tenant) {
            return this.getAppRootUrlOfTenant(this._appSessionService.tenant.tenancyName);
        } else {
            return this.getAppRootUrlOfTenant(null);
        }
    }

    /**
     * Returning url ends with '/'.
     */
    getAppRootUrlOfTenant(tenancyName?: string): string {
        let baseUrl = this.ensureEndsWith(AppConsts.appBaseUrl, '/');

        if (baseUrl.indexOf(AppUrlService.tenancyNamePlaceHolder) < 0) {
            return baseUrl;
        }

        if (baseUrl.indexOf(AppUrlService.tenancyNamePlaceHolder + '.') >= 0) {
            baseUrl = baseUrl.replace(AppUrlService.tenancyNamePlaceHolder + ".", AppUrlService.tenancyNamePlaceHolder);
            if (tenancyName) {
                tenancyName = tenancyName + '.';
            }
        }

        if (!tenancyName) {
            return baseUrl.replace(AppUrlService.tenancyNamePlaceHolder, '');
        }

        return baseUrl.replace(AppUrlService.tenancyNamePlaceHolder, tenancyName);
    }

    private ensureEndsWith(str: string, c: string) {
        if (str.charAt(str.length - 1) !== c) {
            str = str + c;
        }

        return str;
    }

    private removeFromEnd(str: string, c: string) {
        if (str.charAt(str.length - 1) === c) {
            str = str.substr(0, str.length - 1);
        }

        return str;
    }
}
