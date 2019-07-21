import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {SystemSettingDto, SystemSettingServiceProxy} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {MatDialog} from '@node_modules/@angular/material';
import {SystemSettingDialogComponent} from '@app/system-management/system-settings/system-setting-dialog/system-setting-dialog.component';

@Component({
  selector: 'app-parameter',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.css'],
  animations: [appModuleAnimation()]

})
export class SystemSettingComponent extends PagedListingComponentBase<SystemSettingDto> implements OnInit {
  settings: string[];
  // 当前key
  currentKey: string;
  // 值列表
  values: SystemSettingDto[];
  // 搜索的关键字
  keyword: string;

  constructor(
    injector: Injector,
    private _systemSettingService: SystemSettingServiceProxy,
    private dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.settings = ['项目类别', '构件类别'];
    // for (const i in SystemSettingKeys) {
    //   if (i) {
    //     this.settings.push(SystemSettingKeys[i]);
    //   }
    // }
  }
  // 切换参数类别方法
  selectionChange(event) {
    this.currentKey = event;
    this.refresh();
  }
  // 打开参数创建/修改框
  openSettingDialog(item: SystemSettingDto = null) {
    const dialogRef = this.dialog.open(SystemSettingDialogComponent, {width: '640px', data: {key: this.currentKey, item: item}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }
  // 搜索方法
  search(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }
  // 获取值列表方法
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._systemSettingService.getAll(this.currentKey, this.keyword).subscribe(result => {
      this.values = result.items;
      finishedCallback();
    });
  }

  protected delete(entity: SystemSettingDto): void {
    abp.message.confirm('删除这个参数', (result: boolean) => {
      if (result) {
        this._systemSettingService.delete(entity.id).subscribe(() => {
          this.snackBar.open('删除成功', '关闭', {duration: 2000});
          this.refresh();
        });
      }
    });
  }
}
