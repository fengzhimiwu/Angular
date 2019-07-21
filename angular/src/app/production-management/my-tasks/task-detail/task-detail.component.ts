import {Component, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {
  CreateTaskItemAssignmentInput, ForwardTaskItemAssignmentInput,
  TaskItemAssignmentDto,
  TaskItemAssignmentServiceProxy,
} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute, Router, ParamMap} from '@node_modules/@angular/router';
import {switchMap} from '@node_modules/rxjs/operators';
import {AppComponentBase} from '@shared/components/app-component-base';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {MatBottomSheet, MatDialog} from '@node_modules/@angular/material';
import {TaskItemInfoDialogComponent} from './task-item-info-dialog/task-item-info-dialog.component';
import {TaskDetailFormComponent} from '@app/production-management/my-tasks/task-detail/task-detail-form/task-detail-form.component';
import {
  DialogTaskForwardComponent
} from '@app/production-management/my-tasks/task-detail/dialog-task-forward/dialog-task-forward.component';
import {WorkshopDisplayDialogComponent} from '@shared/components/workshop-display/workshop-display-dialog.component';
import {TaskFormPreviewDialogComponent} from '@app/production-management/my-tasks/task-detail/task-form-preview-dialog/task-form-preview-dialog.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
  animations: [appModuleAnimation()]
})
export class TaskDetailComponent extends AppComponentBase implements OnInit {
  // 填写表格页面的Ref
  @ViewChild('assignmentForm') assignmentForm: TaskDetailFormComponent;
  // 填写的表格
  taskItemAssignment: TaskItemAssignmentDto;
  // 填写+评论列表
  assignments: TaskItemAssignmentDto[];
  // 是否牛逼
  readonly: boolean;
  backUrl: string;

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
  ) {
    super(injector);
  }

  ngOnInit() {
    // 路由跳转获取数据
    this.route.paramMap.pipe(switchMap((paramMap: ParamMap) => {
      this.readonly = !!paramMap.get('readonly');
      this.backUrl = paramMap.get('backUrl');
      return this._taskItemAssignmentService.getAssignment(paramMap.get('id'))
    })).subscribe(result => {
      // 返回第一个元素并删除
      this.taskItemAssignment = result.items.shift();
      if (result.items.length > 0) {
        // 因为是按事件从低到高所以翻转
        result.items.reverse();
        // this.taskItemComment = result.items[0];
      }
      this.assignments = result.items;
    });
  }

  // 根据情况返回
  goBack(backUrl: string) {
    if (backUrl) {
      this.router.navigateByUrl(backUrl).then();
    } else {
      this.router.navigate(['../'], {relativeTo: this.route}).then();
    }
  }

  // 打开任务信息框
  openTaskItemDialog() {
    const dialogRef = this.dialog.open(TaskItemInfoDialogComponent, {width: '640px', data: this.taskItemAssignment});
    dialogRef.afterClosed().subscribe();
  }

  // 评论的提交(保存)表单
  save(taskItemComment: TaskItemAssignmentDto) {
    taskItemComment.taskItem = undefined;
    taskItemComment.subProject = undefined;
    this._taskItemAssignmentService.update(taskItemComment).subscribe(() => {
        this.snackBar.open('保存表单成功！', '关闭', {duration: 2000});
        this.router.navigate(['../'], {relativeTo: this.route}).then();
      }
    );
  }

  // 打开构件位置窗口
  openWorkshopDialog(event, taskAssign: TaskItemAssignmentDto) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(WorkshopDisplayDialogComponent, {width: '960px', data: {subProjectId: taskAssign.subProject.id}});
  }

  // 打开转发窗口
  openForwardDialog(taskItemComment: TaskItemAssignmentDto) {
    const dialogRef = this.dialog.open(DialogTaskForwardComponent, {
      width: '640px', data: taskItemComment
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['../'], {relativeTo: this.route}).then();
      }
    });
  }

  // 评论打开预览bottomSheet
  openFormPreviewBottomSheet(taskItemAssignment: TaskItemAssignmentDto) {
    // 先变为Json数据
    this.taskItemAssignment.taskFormData = JSON.stringify(this.assignmentForm.formItems);
    this.bottomSheet.open(TaskFormPreviewDialogComponent, {data: taskItemAssignment});
  }
}
