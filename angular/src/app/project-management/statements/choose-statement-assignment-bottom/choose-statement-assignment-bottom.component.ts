import {Component, Inject, Injector, OnInit} from '@angular/core';
import {Observable} from '@node_modules/rxjs';
import {
  GenerateStatementInput,
  StatementServiceProxy, SubProjectDto,
  TaskItemAssignmentDto
} from '@shared/service-proxies/service-proxies';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog} from '@node_modules/@angular/material';
import {map} from '@node_modules/rxjs/internal/operators';
import {AppConsts} from '@shared/AppConsts';
import {FileItem} from '@shared/service-proxies/file-item.service';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-choose-statement-assignment-bottom',
  templateUrl: './choose-statement-assignment-bottom.component.html',
  styleUrls: ['./choose-statement-assignment-bottom.component.css']
})
export class ChooseStatementAssignmentBottomComponent extends AppComponentBase implements OnInit {
  assignmentsOb: Observable<TaskItemAssignmentDto[]>;

  constructor(
    injector: Injector,
    private bottomSheetRef: MatBottomSheetRef<ChooseStatementAssignmentBottomComponent>,
    private _statementService: StatementServiceProxy,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {fileItem: FileItem, isDownloadMode: boolean, subProject: SubProjectDto},
    private dialog: MatDialog
  ) {
    super(injector);
  }

  ngOnInit() {
    this.assignmentsOb = this._statementService.getStatementAssignments(this.data.fileItem.id, this.data.subProject.id)
      .pipe(map(v => v.items));
  }

  // 打开网上预览word工具
  openOnlineOffice(tia: TaskItemAssignmentDto) {
    if (tia.subProjectId && !tia.lastModificationTime) {
      const input = new GenerateStatementInput({fileItemId: this.data.fileItem.id, subProjectId: tia.subProjectId});
      this._statementService.generateStatement(input).subscribe((result) => {
        // http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls
        const wordSrc = `https://view.officeapps.live.com/op/view.aspx?src=${AppConsts.remoteServiceBaseUrl}/${result}`;
        window.open(wordSrc);
        this.bottomSheetRef.dismiss();
      });
    }
  }

  // 报表下载
  download(tia: TaskItemAssignmentDto) {
    if (tia.subProjectId && !tia.lastModificationTime) {
      const loadingRef = this.openLoadingDialog(this.dialog);
      const input = new GenerateStatementInput({fileItemId: this.data.fileItem.id, subProjectId: tia.subProjectId});
      this._statementService.generateStatement(input).subscribe((result) => {
        location.href = `${AppConsts.remoteServiceBaseUrl}/${result}`;
        loadingRef.close();
        this.bottomSheetRef.dismiss();
      });
    }
  }
}
