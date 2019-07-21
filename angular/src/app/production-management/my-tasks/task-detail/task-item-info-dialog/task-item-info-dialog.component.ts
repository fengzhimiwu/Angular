import {Component, Inject, Injector, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {TaskItemAssignmentDto, TaskItemAssignmentServiceProxy, UserDto} from '../../../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-task-item-info-dialog',
  templateUrl: './task-item-info-dialog.component.html',
  styleUrls: ['./task-item-info-dialog.component.css']
})
export class TaskItemInfoDialogComponent implements OnInit {
  participantIds: Array<any>;
  participant: UserDto[];

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<TaskItemInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public taskItemAssignment: TaskItemAssignmentDto,
    private assignmentService: TaskItemAssignmentServiceProxy,
  ) { }

  ngOnInit() {
    // 用逗号隔开变成数组然后传递给后端
    const ids = this.taskItemAssignment.participantIds ? this.taskItemAssignment.participantIds.split(',') : [];
    this.participantIds = ids;
    // 取回User的信息
    this.assignmentService.getParticipants(ids.toString()).subscribe(result => this.participant = result.items);
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
