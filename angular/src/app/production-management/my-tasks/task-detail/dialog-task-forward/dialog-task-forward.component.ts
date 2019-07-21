import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {
  CreateTaskItemAssignmentInput, ForwardTaskItemAssignmentInput,
  ProjectDto,
  TaskItemAssignmentDto,
  TaskItemAssignmentServiceProxy,
  UserDto
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-dialog-task-forward',
  templateUrl: './dialog-task-forward.component.html',
  styleUrls: ['./dialog-task-forward.component.css']
})
export class DialogTaskForwardComponent extends AppComponentBase implements OnInit {
  userSelected: UserDto;
  projectSelected: ProjectDto;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<DialogTaskForwardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskItemAssignmentDto,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
  ) {
    super(injector);
  }

  // 获取项目
  ngOnInit(): void {
    this._taskItemAssignmentService.getProjectByAssignmentId(this.data.id).subscribe(result => {
      this.projectSelected = result;
    });
  }

  // 关闭弹窗
  onNoClick(): void {
    this.dialogRef.close();
  }

  // 点选确定后
  onOkClick(remark: string) {
    const createTaskItemAssignmentInput = new CreateTaskItemAssignmentInput({
      userId: this.userSelected.id,
      subProjectId: this.data.subProjectId,
      taskItemId: this.data.taskItemId,
      procedureStepTaskItemId: this.data.procedureStepTaskItemId,
      remarkAssigned: remark,
      participantIds: this.data.participantIds,
    });
    // 组织转发输入
    const input = new ForwardTaskItemAssignmentInput({
      createTaskItemAssignmentInput: createTaskItemAssignmentInput, updateTaskItemAssignmentDto: this.data
    });
    // 调用接口
    this._taskItemAssignmentService.create(input).subscribe(() => {
      this.snackBar.open('转发成功！', '关闭', {duration: 2000});
    });
    this.dialogRef.close(true);
  }

}
