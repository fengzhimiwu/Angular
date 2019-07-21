import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@node_modules/@angular/forms';
import {ChangePasswordInput, SessionServiceProxy} from '@shared/service-proxies/service-proxies';
import {MatSnackBar} from '@node_modules/@angular/material';

@Component({
  selector: 'app-personal-password-setting',
  templateUrl: './personal-password-setting.component.html',
  styleUrls: ['./personal-password-setting.component.css']
})
export class PersonalPasswordSettingComponent implements OnInit {
  // 修改密码control
  changePasswordForm = new FormGroup({
    currentPassword: new FormControl(),
    newPassword: new FormControl(),
    confirmedPassword: new FormControl()
  }, (g: FormGroup) => {
    const formValid = g.get('newPassword').value === g.get('confirmedPassword').value;
    // 获取当前错误
    const currentError = g.get('confirmedPassword').errors;
    // 添加确认密码的验证
    g.get('confirmedPassword').setErrors(
      formValid && !g.get('confirmedPassword').hasError('required')
      && !g.get('confirmedPassword').hasError('minlength') ? null : {notEqual: !formValid, ...currentError});
    return formValid ? null : {notEqual: true};
  });

  constructor(
    private _sessionService: SessionServiceProxy,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  // 修改密码
  changePassword() {
    const changePasswordInput = new ChangePasswordInput({
      currentPassword: this.changePasswordForm.get('currentPassword').value,
      newPassword: this.changePasswordForm.get('newPassword').value
    });
    this._sessionService.changePassword(changePasswordInput).subscribe(result => {
      if (result) {
        this.snackBar.open('修改密码成功！', '关闭');
      }
      // this.changePasswordForm.reset();
    });
  }

}
