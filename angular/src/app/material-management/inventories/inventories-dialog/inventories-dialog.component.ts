import { MatDialogRef, MAT_DIALOG_DATA } from '@node_modules/@angular/material';
import {
  InventoryDto,
  CreateInventoryInput,
  InventoryServiceProxy,
  ProviderDto,
  ProviderServiceProxy
} from '@shared/service-proxies/service-proxies';
import { Component, OnInit, Inject, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/components/app-component-base';

@Component({
  selector: 'app-inventories-dialog',
  templateUrl: './inventories-dialog.component.html',
  styleUrls: ['./inventories-dialog.component.css']
})
export class InventoriesDialogComponent extends AppComponentBase implements OnInit {
  inventory: InventoryDto | CreateInventoryInput;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<InventoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventoryId: string, provider: ProviderDto },
    private _providerService: ProviderServiceProxy,
    private _inventoryService: InventoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    if (this.data.inventoryId) {
      this._inventoryService.get(this.data.inventoryId).subscribe(result => this.inventory = result);
    } else {
      this.inventory = new CreateInventoryInput();
    }
    // 添加供应商id
    if (this.data.provider) {
      this.inventory.providerId = this.data.provider.id;
    }
  }
  save () {
    if (this.inventory instanceof InventoryDto ) {
      this._inventoryService.update(this.inventory).subscribe(() => {
        this.snackBar.open('更新成功', '关闭', {duration: 2000});
        this.dialogRef.close(true);
      });
    } else {
      this._providerService.createInventory(this.inventory).subscribe(() => {
        this.snackBar.open('进货成功，请查看存库页面', '关闭', {duration: 2000});
        this.dialogRef.close(true);
      });
    }
  }
}
