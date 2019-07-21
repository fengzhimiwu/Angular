import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {BimModelDto, CreateSubProjectInput, ProjectDto, SubProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import {BiaViewerModels} from '@shared/models/bia-viewer-models';
import {AppComponentBase} from '@shared/components/app-component-base';
import { queueComponentIndexForCheck } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-add-sub-dialog',
  templateUrl: './add-sub-dialog.component.html',
  styleUrls: ['./add-sub-dialog.component.css']
})
export class AddSubDialogComponent extends AppComponentBase implements OnInit {
  project: ProjectDto = new ProjectDto();
  subProjects: CreateSubProjectInput[];

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<AddSubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dbIds: BiaViewerModels, bimModelFileItem: BimModelDto },
    private _subProjectService: SubProjectServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.subProjects = [];
    this.data.dbIds.getAllNames().forEach(v => {
      const newOne = new CreateSubProjectInput();
      newOne.init({
        category: v,
        bimModelFileItemId: this.data.bimModelFileItem.id,
        bimModelIds: this.data.dbIds[v],
        numCreating: this.data.dbIds[v].length
      });
      this.subProjects.push(newOne);
    });
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onOkClick() {
    this.subProjects.forEach(v => v.projectId = this.project.id);
    this._subProjectService.createMultiple(this.subProjects).subscribe(() =>
      this.snackBar.open('创建成功！', '关闭', {duration: 2_000}));
    this.dialogRef.close(true);
  }
  delete(s: CreateSubProjectInput) {
    const i = this.subProjects.indexOf(s);
    this.subProjects.splice(i, 1);
  }
}
