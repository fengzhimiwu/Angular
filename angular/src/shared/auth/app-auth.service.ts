import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

// abp框架自带的登出服务
@Injectable()
export class AppAuthService {

    logout(reload?: boolean): void {
        abp.auth.clearToken();
        if (reload !== false) {
            location.href = AppConsts.appBaseUrl;
        }
    }
}
