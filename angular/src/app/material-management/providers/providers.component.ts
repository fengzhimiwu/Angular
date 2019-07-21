import { Component, Injector } from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {ProviderDto, ProviderServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {ProviderDialogComponent} from './provider-dialog/provider-dialog.component';
import {InventoriesDialogComponent} from '@app/material-management/inventories/inventories-dialog/inventories-dialog.component';
import {appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css'],
  animations: [appModuleAnimation()]
})
export class ProvidersComponent extends PagedListingComponentBase<ProviderDto> {
  providers: ProviderDto[];
  // 搜索关键字
  keyword: string;

  constructor(
    injector: Injector,
    private _providerService: ProviderServiceProxy,
    private dialog: MatDialog) {
    super(injector);
  }
  // 修改操作
  openProviderDialog(providersId: string = null) {
    const dialogRef = this.dialog.open(ProviderDialogComponent, {width: '640px', data: {providersId: providersId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }
  // 进货
  openInventoryDialog(provider: ProviderDto = null) {
    this.dialog.open(InventoriesDialogComponent, {width: '640px', data: {provider: provider}});
  }
  // 搜索
  search(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._providerService.getAll(this.keyword, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => finishedCallback())).subscribe(result => {
      this.providers = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(Materials: ProviderDto): void {
    abp.message.confirm('删除供应商' + Materials.providerName + '?',
      (result: boolean) => {
        if (result) {
          this._providerService.delete(Materials.id)
            .subscribe(() => {
              this.snackBar.open('删除供应商: ' + Materials.providerName, '关闭', {duration: 2000});
              this.refresh();
            });
        }
      }
    );
  }
}

