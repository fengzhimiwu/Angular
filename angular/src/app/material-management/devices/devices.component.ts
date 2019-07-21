import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {AppComponentBase} from 'shared/components/app-component-base';
import {Component, OnInit, Injector} from '@angular/core';
import {DeviceDto, DeviceServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {DeviceDialogComponent} from './device-dialog/device-dialog.component';
import {appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  animations: [appModuleAnimation()]
})
export class DevicesComponent extends PagedListingComponentBase<DeviceDto> {
  devices: DeviceDto[];
  // 搜索关键字
  keyword: string;

  constructor(
    injector: Injector,
    private _deviceService: DeviceServiceProxy,
    private dialog: MatDialog) {
    super(injector);
  }
  // 创建、修改
  openDialog(deviceId: string = null) {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {width: '640px', data: {deviceId: deviceId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }
  // 使用设备
  useDeviceOnce(device: DeviceDto) {
    this._deviceService.useDeviceOnce(device.id).subscribe((result) => {
      this.snackBar.open('使用成功，可用次数减少', '关闭', {duration: 2_000});
      if (result.availableTimes <= result.warningTimes) {
        abp.message.info('使用次数到达临界值！');
      }
      this.refresh();
    });
  }
  // 搜索
  search(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._deviceService.getAll(this.keyword, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => finishedCallback())).subscribe(result => {
      this.devices = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(device: DeviceDto): void {
    abp.message.confirm('删除设备' + device.name + '?', (result: boolean) => {
      if (result) {
        this._deviceService.delete(device.id).subscribe(() => {
          this.snackBar.open('删除设备: ' + device.name, '关闭', {duration: 2000});
          this.refresh();
        });
      }
    });
  }
}
