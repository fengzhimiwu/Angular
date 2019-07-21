import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {PedestalDto, PedestalServiceProxy} from '@shared/service-proxies/service-proxies';

@Component({
  template: `
    <!--显示台座布局信息的弹窗-->
    <mat-dialog-content>
      <p *ngIf="!pedestal">正在加载请稍后...</p>
      <app-workshop-display *ngIf="pedestal" [(selection)]="pedestal" [readonly]="true"></app-workshop-display>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>关闭</button>
    </mat-dialog-actions>
  `,
})
export class WorkshopDisplayDialogComponent implements OnInit {
  // 所选中的台座
  public pedestal: PedestalDto;

  constructor(
    public dialogRef: MatDialogRef<WorkshopDisplayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subProjectId: string },
    private _pedestalService: PedestalServiceProxy,
  ) {
  }

  ngOnInit(): void {
    // 通过构件id获取数据
    this._pedestalService.getBySubProjectId(this.data.subProjectId).subscribe(result => this.pedestal = result);
  }
}
