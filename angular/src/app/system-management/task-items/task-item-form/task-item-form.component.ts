import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {switchMap} from '@node_modules/rxjs/operators';
import {TaskItemDto, TaskItemServiceProxy} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/components/app-component-base';
import {MatDialog} from '@node_modules/@angular/material';
import {TaskInputControlType} from '@shared/AppEnums';
import {TaskInputControl} from '@shared/models/taskInput-control';
import {AddGridItemFormComponent} from '@app/system-management/task-items/task-item-form/add-grid-item-form/add-grid-item-form.component';
import {
  CdkDragDrop,
  CdkDragExit,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem
} from '@node_modules/@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-item-form',
  templateUrl: './task-item-form.component.html',
  styleUrls: ['./task-item-form.component.css'],
  animations: [appModuleAnimation()],
  // encapsulation: ViewEncapsulation.None
})
export class TaskItemFormComponent extends AppComponentBase implements OnInit {
  TaskInputControlType = TaskInputControlType;
  taskItem: TaskItemDto;
  formItems:  TaskInputControl[];

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private taskItemService: TaskItemServiceProxy,
    public dialog: MatDialog
  ) {
    super(injector);
  }
  // 页面初始化
  ngOnInit() {
    // 取路由参数
    this.route.paramMap.pipe(
      switchMap((param) => this.taskItemService.get(param.get('id')))
    ).subscribe((result: TaskItemDto) => {
      // 把JSON数据变为对象
      this.formItems = JSON.parse(result.taskFromTemplate);
      if (!this.formItems) {
        this.formItems = [];
      }
      this.taskItem = result;
    });
  }
  // 删除一个表格项
  removeItem(item, $event = null) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.formItems.splice(this.formItems.indexOf(item), 1);
  }
  // 保存
  save() {
    // json序列化
    this.taskItem.taskFromTemplate = JSON.stringify(this.formItems);
    this.taskItemService.update(this.taskItem).subscribe(() => {
        this.snackBar.open('保存表单成功', '关闭', {duration: 2000});
      }
    );
  }
  // 打开添加表格项的dialog
  openDialog(item: TaskInputControl): void {
    // 打开无法关闭的dialog，强制输入
    const dialogRef = this.dialog.open(AddGridItemFormComponent, {
      width: '640px', disableClose: true,
      data: {selectedFormItem: item, formItems: this.formItems}
    });
    dialogRef.afterClosed().subscribe((formItem: TaskInputControl) => {
      // 如果有值说明要删掉
      if (formItem) {
        this.removeItem(formItem);
      }
    });
  }
  inputControls: TaskInputControl[] = [
    {name: '填入项名字', type: TaskInputControlType.checkbox, value: ''},
    {name: '填入项名字', type: TaskInputControlType.label, value: ''},
    {name: '填入项名字', type: TaskInputControlType.number, value: ''},
    {name: '填入项名字', type: TaskInputControlType.selection, value: ''},
    {name: '填入项名字', type: TaskInputControlType.picture, value: ''},
  ];
  // 这里是新增一个表格项
  drop(event: CdkDragDrop<TaskInputControl[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // 因为拖拽组件不是深拷贝，所以要new一个
      const newControl = {type: event.item.data.type};
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      // 用新控件填充，浅拷贝
      this.formItems.fill(newControl, event.currentIndex, event.currentIndex + 1);
      // 打开输入框填写信息
      this.openDialog(newControl);
    }
  }
}
