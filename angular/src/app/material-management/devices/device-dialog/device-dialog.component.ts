import { AppComponentBase } from 'shared/components/app-component-base';
import { CreateDeviceInput, DeviceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeviceDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.css']
})
export class DeviceDialogComponent extends AppComponentBase implements OnInit {
  device: DeviceDto | CreateDeviceInput;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<DeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {deviceId: string},
    private _deviceService: DeviceServiceProxy,
  ) {
    super(injector);
   }

  ngOnInit() {
    if (this.data.deviceId) {
      this._deviceService.get(this.data.deviceId).subscribe(result => this.device = result);
    } else {
      this.device = new CreateDeviceInput();
    }
  }
  save() {
    if (this.device instanceof DeviceDto) {
      this._deviceService.update(this.device).subscribe(() => {
        this.snackBar.open('更新成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    } else {
      this._deviceService.create(this.device).subscribe(() => {
        this.snackBar.open('创建成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    }
  }
}
