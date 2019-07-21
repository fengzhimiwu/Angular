import {ExaminationServiceProxy, InventoryDto, InventoryServiceProxy, UserDto} from '@shared/service-proxies/service-proxies';
import {CreateExaminationReportInput, ExaminationReportDto} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from 'shared/components/app-component-base';
import {Component, OnInit, Inject, Injector} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@node_modules/@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from '@node_modules/rxjs/operators';
import {Observable} from '@node_modules/rxjs';
import {FileItemCategory} from '@shared/AppEnums';
import {FileItemService} from '@shared/service-proxies/file-item.service';

@Component({
  selector: 'app-examinations-dialog',
  templateUrl: './examinations-dialog.component.html',
  styleUrls: ['./examinations-dialog.component.css']
})
export class ExaminationsDialogComponent extends AppComponentBase implements OnInit {
  examination: ExaminationReportDto | CreateExaminationReportInput;
  searchControl: FormControl = new FormControl();
  options: Observable<UserDto[]>;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<ExaminationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { examinationId: string, inventory: InventoryDto },
    private _examinationService: ExaminationServiceProxy,
    private _inventoryService: InventoryServiceProxy,
    private _fileItemService: FileItemService
  ) {
    super(injector);
  }

  ngOnInit() {
    if (this.data.examinationId) {
      this._examinationService.get(this.data.examinationId).subscribe(result => {
        this.examination = result;
        // 给输入框赋值，便于显示用户
        if (this.examination instanceof ExaminationReportDto) {
          this.searchControl.setValue(this.examination.user.name);
        }
        this.searchControl.disable();
      });
    } else {
      this.examination = new CreateExaminationReportInput();
      // 初始化搜索功能
      this.options = this.searchControl.valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        distinctUntilChanged(),
        switchMap((key: string) => this._inventoryService.getUsersInTenant(key, 0, 10)),
        map((result) => result.items)
      );
    }
    // 添加inventoryId与batchNum
    if (this.data.inventory) {
      this.examination.inventoryId = this.data.inventory.id;
      this.examination.batchNum = this.data.inventory.batchNum;
    }
  }

  // 保存
  save() {
    if (this.examination instanceof ExaminationReportDto) {
      // 保存/上传检验报告
      this._examinationService.update(this.examination).subscribe(() => {
        this.snackBar.open('更新成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    } else {
      // 送检提交
      this._inventoryService.sendToExamination(this.examination).subscribe(() => {
        this.snackBar.open('送检成功，请检查检验列表', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    }
  }

  // 上传报告
  uploadReport(event) {
    if (this.examination instanceof ExaminationReportDto) {
      const file: File = event.target.files[0];
      const formFile = new FormData();
      formFile.append('FormFile', file, file.name);
      formFile.append('RelationalId', this.examination.id);
      formFile.append('FileItemCategory', FileItemCategory.ExaminationReport.toString());
      this._fileItemService.create(formFile).subscribe((result) => {
        this.snackBar.open('上传成功', '关闭', {duration: 2_000});
        if (this.examination instanceof ExaminationReportDto) {
          this.examination.fileItemId = result.id;
        }
      });
    }
  }
}
