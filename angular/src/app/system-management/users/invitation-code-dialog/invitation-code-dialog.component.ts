import {Component, ElementRef, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {
  CreateSystemSettingInput,
  SystemSettingDto,
  SystemSettingServiceProxy,
  TenantLoginInfoDto
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/components/app-component-base';
import {AppConsts} from '@shared/AppConsts';
import * as ClipboardJS from 'clipboard';
import * as moment from '@node_modules/moment';
import {Router} from '@node_modules/@angular/router';

@Component({
  selector: 'app-invitation-code-dialog',
  templateUrl: './invitation-code-dialog.component.html',
  styleUrls: ['./invitation-code-dialog.component.css']
})
export class InvitationCodeDialogComponent extends AppComponentBase implements OnInit, OnDestroy {
  AppConsts = AppConsts;
  invitationCodes: SystemSettingDto[];
  clipboard: ClipboardJS;

  constructor(
    private _systemSetting: SystemSettingServiceProxy,
    injector: Injector,
    public dialogRef: MatDialogRef<InvitationCodeDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {},
  ) {
    super(injector);
  }

  ngOnInit() {
    // 初始化剪贴板工具
    this.clipboard = new ClipboardJS('.clipboardBtn', {
      text: (trigger) => trigger.getAttribute('value')
    });
    // 监听如果复制成功
    this.clipboard.on('success', (e) => {
      this.snackBar.open('复制注册链接成功', '关闭', {duration: 2_000});
      e.clearSelection();
    });
    // 获取所有的邀请链接
    this._systemSetting.getAll('InvitationCode', '').subscribe(result => this.invitationCodes = result.items);
  }

  // 添加一个邀请码
  addCode() {
    const input = new CreateSystemSettingInput();
    input.key = 'InvitationCode';
    input.value = moment.now.toString();
    this._systemSetting.create(input).subscribe(result => {
      this.snackBar.open('添加成功！', '关闭', {duration: 2_000});
      this.invitationCodes.push(result);
    });
  }

  // 删除一个邀请码
  deleteOne(dto: SystemSettingDto) {
    this._systemSetting.delete(dto.id).subscribe(() => {
      this.snackBar.open('删除成功，本邀请码无法再用来注册！', '关闭', {duration: 2_000});
      this.invitationCodes.splice(this.invitationCodes.indexOf(dto), 1);
    });
  }

  ngOnDestroy(): void {
    // 摧毁剪贴板
    this.clipboard.destroy();
  }

  // 生成邀请码放入html供给剪贴板工具使用
  getInvitationCode(i: SystemSettingDto) {
    const urls = this.router.createUrlTree(
      ['/account', {tenancyName: this.appSession.tenant ? this.appSession.tenant.tenancyName : ''}, 'register'],
      {queryParams: {invitationCode: i.id}}
    );
    return AppConsts.appBaseUrl + urls.toString();
  }
}
