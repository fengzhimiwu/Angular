import {Component, Injector, ElementRef, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponentBase} from '@shared/components/app-component-base';
import {LoginService} from './login.service';
import {accountModuleAnimation} from '@shared/animations/routerTransition';
import {AbpSessionService} from '@abp/session/abp-session.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.less'
  ],
  animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase implements OnInit {
  submitting = false;

  constructor(
    injector: Injector,
    public loginService: LoginService,
    private _router: Router,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
  }

  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    this.loginService.rememberMe = true;
  }

  login(): void {
    this.submitting = true;
    this.loginService.authenticate(
      () => this.submitting = false
    );
  }
}
