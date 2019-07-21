import {InventoryDto} from './../../../shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {AppComponentBase} from 'shared/components/app-component-base';
import {Component, OnInit, Injector} from '@angular/core';
import {InventoryServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {InventoriesDialogComponent} from './inventories-dialog/inventories-dialog.component';
import {ExaminationsDialogComponent} from '@app/material-management/examinations/examinations-dialog/examinations-dialog.component';
import {appModuleAnimation} from '@shared/animations/routerTransition';


@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css'],
  animations: [appModuleAnimation()]
})
export class InventoriesComponent extends PagedListingComponentBase<InventoryDto> {
  inventories: InventoryDto[]; // 设备数据
  // 搜索关键字
  keyword: string;
  constructor(
    injector: Injector,
    private _inventoryService: InventoryServiceProxy,
    private dialog: MatDialog) {
    super(injector);
  }
  // 修改操作
  openInventoryDialog(inventoryId: string = null) {
    const dialogRef = this.dialog.open(InventoriesDialogComponent, {width: '640px', data: {inventoryId: inventoryId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  // 送检操作
  openExaminationDialog(inventory: InventoryDto) {
    const dialogRef = this.dialog.open(ExaminationsDialogComponent, {width: '640px', data: {inventory: inventory}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }
  // 确认到货操作
  checkArrive(inventoryId: string) {
    this._inventoryService.checkMaterialArrive(inventoryId).subscribe(() => {
      this.snackBar.open('确认收货成功！', '关闭', {duration: 2_000});
      this.refresh();
    });
  }
  // 搜索
  search(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._inventoryService.getAll(this.keyword, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => finishedCallback())).subscribe(result => {
      this.inventories = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(inventory: InventoryDto): void {
    abp.message.confirm('删除库存材料' + inventory.providerId + '?',
      (result: boolean) => {
        if (result) {
          this._inventoryService.delete(inventory.id)
            .subscribe(() => {
              this.snackBar.open('删除库存材料: ' + inventory.providerId, '关闭', {duration: 2000});
              this.refresh();
            });
        }
      }
    );
  }
}
