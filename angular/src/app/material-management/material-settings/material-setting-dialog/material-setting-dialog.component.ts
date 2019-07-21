import {MaterialSettingDto, CreateMaterialSettingInput} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from 'shared/components/app-component-base';
import {Component, OnInit, Inject, Injector} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MaterialSettingServiceProxy} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-material-dialog',
  templateUrl: './material-setting-dialog.component.html',
  styleUrls: ['./material-setting-dialog.component.css']
})

export class MaterialSettingDialogComponent extends AppComponentBase implements OnInit {
  material: MaterialSettingDto | CreateMaterialSettingInput;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<MaterialSettingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { materialId: string, key: string },
    private _materialSettingService: MaterialSettingServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    if (this.data.materialId) {
      this._materialSettingService.get(this.data.materialId).subscribe(result => this.material = result);
    } else {
      this.material = new CreateMaterialSettingInput();
    }
    this.material.key = this.data.key;
  }

  save() {
    if (this.material instanceof MaterialSettingDto) {
      this._materialSettingService.update(this.material).subscribe(() => {
        this.snackBar.open('更新成功', '关闭', {duration: 2000});
        this.dialogRef.close(true);
      });
    } else {
      this._materialSettingService.create(this.material).subscribe(() => {
        this.snackBar.open('创建成功', '关闭', {duration: 2000});
        this.dialogRef.close(true);
      });
    }
  }
}





