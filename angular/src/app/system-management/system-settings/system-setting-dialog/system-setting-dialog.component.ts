import {Component, Inject, Injectable, Injector, OnInit} from '@angular/core';
import {CreateSystemSettingInput, SystemSettingDto, SystemSettingServiceProxy} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/components/app-component-base';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';

@Component({
  selector: 'app-system-setting-dialog',
  templateUrl: './system-setting-dialog.component.html',
  styleUrls: ['./system-setting-dialog.component.css']
})
export class SystemSettingDialogComponent extends AppComponentBase implements OnInit {
  item: SystemSettingDto | CreateSystemSettingInput;
  saving = false;

  constructor(
    injector: Injector,
    private _systemSettingService: SystemSettingServiceProxy,
    private dialogRef: MatDialogRef<SystemSettingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {key: string, item: SystemSettingDto},
  ) {
  super(injector);
  }

  ngOnInit() {
    if (this.data.item == null) {
      this.item = new CreateSystemSettingInput();
    } else {
      this.item = this.data.item;
    }
    // 添加key值
    if (this.data.key) {
      this.item.key = this.data.key;
    }
  }
  save(): void {
    this.saving = true;
    if (this.item instanceof CreateSystemSettingInput) {
      this._systemSettingService.create(this.item).subscribe(() => {
        this.snackBar.open('创建成功', '关闭', {duration: 2000});
        this.dialogRef.close(true);
        this.saving = false;
      });
    } else {
      this._systemSettingService.update(this.item).subscribe(() => {
        this.snackBar.open(this.l('修改成功'), '关闭', {duration: 2000});
        this.dialogRef.close(true);
        this.saving = false;
      });
    }
  }
}
