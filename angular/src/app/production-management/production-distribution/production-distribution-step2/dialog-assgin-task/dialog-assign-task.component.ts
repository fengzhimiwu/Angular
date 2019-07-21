import {Component, Inject, Injector, OnInit} from '@angular/core';
import {
  CreateTaskItemAssignmentInput,
  ProductionServiceProxy,
  ProjectDto,
  TaskItemAssignmentServiceProxy,
  UserDto
} from '@shared/service-proxies/service-proxies';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-dialog-assgin-task',
  templateUrl: './dialog-assign-task.component.html',
  styleUrls: ['./dialog-assign-task.component.css']
})
export class DialogAssignTaskComponent extends AppComponentBase {
  userSelected: UserDto;
  participants: number[] = [];

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<DialogAssignTaskComponent>,
    private _productionService: ProductionServiceProxy,
    @Inject(MAT_DIALOG_DATA) public data: {project: ProjectDto, inputs: CreateTaskItemAssignmentInput[]}
  ) {
    super(injector);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick(remark: string) {
    this.data.inputs.forEach(v => {
      v.userId = this.userSelected.id;
      v.remarkAssigned = remark;
      v.participantIds = this.participants.toString();
    });
    this._productionService.createAssignments(this.data.inputs).subscribe(() => {
      this.snackBar.open('分派成功！', '关闭', {duration: 2000});
      this.dialogRef.close(true);
    });
  }

}
