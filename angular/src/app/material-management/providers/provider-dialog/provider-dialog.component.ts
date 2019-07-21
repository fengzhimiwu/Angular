import { AppComponentBase } from 'shared/components/app-component-base';
import { CreateProviderInput, ProviderServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-provider-dialog',
  templateUrl: './provider-dialog.component.html',
  styleUrls: ['./provider-dialog.component.css']
})
export class ProviderDialogComponent extends AppComponentBase implements OnInit {
  provider: ProviderDto | CreateProviderInput;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<ProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {providersId: string},
    private _providerService: ProviderServiceProxy,
  ) {
    super(injector);
   }

  ngOnInit() {
    if (this.data.providersId) {
      this._providerService.get(this.data.providersId).subscribe(result => this.provider = result);
    } else {
      this.provider = new CreateProviderInput();
    }
  }
  save() {
    if (this.provider instanceof ProviderDto) {
      this._providerService.update(this.provider).subscribe(() => {
        this.snackBar.open('更新成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    } else {
      this._providerService.create(this.provider).subscribe(() => {
        this.snackBar.open('创建成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    }
  }
}
