import {Component, Injector, ElementRef, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountServiceProxy, RegisterInput, RegisterOutput} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/components/app-component-base';
import {LoginService} from '../login/login.service';
import {accountModuleAnimation} from '@shared/animations/routerTransition';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: './register.component.html',
  animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  model: RegisterInput = new RegisterInput();
  saving = false;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private readonly _loginService: LoginService,
    private _route: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // 从地址栏获取邀请码信息
    this.model.invitationCode = this._route.snapshot.queryParamMap.get('invitationCode');
  }

  save(): void {
    this.saving = true;
    // 自动填入姓 自动填入email
    this.model.surname = this.model.name[0];
    this.model.emailAddress = this.model.name + this.model.mobileNumber + '@email.com';
    this._accountService.register(this.model).pipe(finalize(() => this.saving = false)).subscribe(result => {
      if (!result.canLogin) {
        this.snackBar.open('注册成功，请等待管理员审核', '关闭', {duration: 4_000});
        this._router.navigate(['/account/login']).then();
        return;
      }
      // Autheticate
      this.saving = true;
      this._loginService.authenticateModel.userNameOrEmailAddress = this.model.userName;
      this._loginService.authenticateModel.password = this.model.password;
      this._loginService.authenticate(() => {
        this.saving = false;
      });
    });
  }
}
