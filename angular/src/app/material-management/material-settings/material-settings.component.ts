import {MaterialSettingDialogComponent} from './material-setting-dialog/material-setting-dialog.component';
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {MaterialSettingDto, MaterialSettingServiceProxy} from '@shared/service-proxies/service-proxies';
import {MatDialog} from '@angular/material';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-material-settings',
  templateUrl: './material-settings.component.html',
  styleUrls: ['./material-settings.component.css'],
  animations: [appModuleAnimation()]
})
// extends  PagedListingComponentBase<SystemSettingDto>
export class MaterialSettingsComponent extends PagedListingComponentBase<MaterialSettingDto> implements OnInit {
  keys: string[];
  // 表示当前选择的key
  currentKey: string;
  values: MaterialSettingDto[];
  // 搜索关键字
  keyword: string;

  constructor(
    injector: Injector,
    private _materialSettingService: MaterialSettingServiceProxy,
    private dialog: MatDialog,
    /*protected route: ActivatedRoute,*/
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.keys = ['设备类别', '设备使用单位', '材料类别', '材料单位', '材料规格'];
    // this.route.paramMap.pipe(
    //  switchMap((params: ParamMap) => this._materialSettingService.get(params.get('name')))
    // ).subscribe((value: MaterialSettingDto) => {
    //   this.values.push(value) ;
    // });

  }

  openDialog(materialId: string = null) {
      // 此处将data传入到子组件中去
    const dialogRef = this.dialog.open(MaterialSettingDialogComponent, {width: '900px', data: {
      materialId: materialId, key: this.currentKey}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectionChange(this.currentKey);
      }
    });

  }

  // 获得values
  selectionChange(msd: string) {
    this.currentKey = msd;
    this.refresh();
  }
  // 搜索
  search(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }
  // 获得值的列表
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._materialSettingService.getAll(this.currentKey, this.keyword).subscribe(result => {
      this.values = result.items;
      finishedCallback();
    });
  }

  protected delete(entity: MaterialSettingDto): void {
    abp.message.confirm('删除这个参数', (result: boolean) => {
      if (result) {
        this._materialSettingService.delete(entity.id).subscribe(() => {
          this.snackBar.open('删除成功', '关闭', {duration: 2000});
          this.refresh();
        });
      }
    });
  }
}
