import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@node_modules/@angular/material';
import {PreviewStatementInput, StatementDataRefDto, StatementServiceProxy, TaskItemAssignmentDto
} from '@shared/service-proxies/service-proxies';
import {Observable} from '@node_modules/rxjs';
import {map} from '@node_modules/rxjs/operators';
import {AppConsts} from '@shared/AppConsts';

@Component({
  selector: 'app-task-form-preview-dialog',
  templateUrl: './task-form-preview-dialog.component.html',
  styleUrls: ['./task-form-preview-dialog.component.css']
})
export class TaskFormPreviewDialogComponent implements OnInit {
  statementDataRefsOb: Observable<StatementDataRefDto[]>;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<TaskFormPreviewDialogComponent>,
    private _statementService: StatementServiceProxy,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: TaskItemAssignmentDto,
  ) {
  }

  ngOnInit() {
    this.statementDataRefsOb = this._statementService.getStatementTemplates(this.data.procedureStepTaskItemId).pipe(map(v => v.items));
  }

  // 打开网上预览word工具
  openOnlineOffice(fId: string) {
    if (this.data.subProjectId) {
      const input = new PreviewStatementInput({
        fileItemId: fId,
        subProjectId: this.data.subProjectId,
        taskFormData: this.data.taskFormData
      });
      // 获取文件的服务器地址
      this._statementService.previewStatement(input).subscribe((result) => {
        // http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls
        // 构件网上文档打开工具的连接
        const wordSrc = `https://view.officeapps.live.com/op/view.aspx?src=${AppConsts.remoteServiceBaseUrl}/${result}`;
        window.open(wordSrc);
        this.bottomSheetRef.dismiss();
      });
    }
  }
}
