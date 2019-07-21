import {Component, Injector, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskInputControl} from '@shared/models/taskInput-control';
import {FileItemCategory, TaskInputControlType} from '@shared/AppEnums';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {AppComponentBase} from '@shared/components/app-component-base';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {TaskItemAssignmentDto, TaskItemAssignmentServiceProxy} from '@shared/service-proxies/service-proxies';
import {DialogTaskForwardComponent} from '@app/production-management/my-tasks/task-detail/dialog-task-forward/dialog-task-forward.component';
import {MatBottomSheet, MatCheckboxChange, MatDialog} from '@node_modules/@angular/material';
import {TaskAutocompleteDataSourceHelper} from '@shared/helpers/task-autocomplete-data-source.helper';
import {COMMA, ENTER, SPACE} from '@node_modules/@angular/cdk/keycodes';
import {ImageSelectorComponent} from '@shared/components/image-selecter/image-selector.component';

@Component({
  selector: 'app-task-detail-form',
  templateUrl: './task-detail-form.component.html',
  styleUrls: ['./task-detail-form.component.css']
})
export class TaskDetailFormComponent extends AppComponentBase implements OnInit, OnChanges {
  TaskInputControlType = TaskInputControlType;
  // 表格显示的每一个小项
  formItems: TaskInputControl[];
  // 任务提交的表
  @Input() taskItemAssignment: TaskItemAssignmentDto;
  @Input() readonly: boolean;
  // 自动完成下拉的options
  dataSourceHelper: TaskAutocompleteDataSourceHelper;
  // 动态表单controls
  // formGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    injector: Injector,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
    private _fileItemService: FileItemService,
    private dialog: MatDialog,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {
    super(injector);
    // 初始化data来源帮助工具
    this.dataSourceHelper = new TaskAutocompleteDataSourceHelper(injector);
  }

  // 当taskItemAssignment有值的时候
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskItemAssignment'].isFirstChange()) {
      if (!this.taskItemAssignment.taskFormData) {
        // 如果data为空则添加一个新formItems数组
        this.formItems = this.taskItemAssignment.taskItem.taskFromTemplate
          ? JSON.parse(this.taskItemAssignment.taskItem.taskFromTemplate) : [];
        this.formItems.push({name: '表格备注', type: TaskInputControlType.label});
      } else {
        // 否则直接反序列化数据显示，并且置为只读
        this.formItems = JSON.parse(this.taskItemAssignment.taskFormData);
        this.readonly = true;
      }
      // 给formItems的selection选项添加搜索功能
      this.formItems.forEach(v => {
        if (v.type === TaskInputControlType.selection) {
          // 添加subject
          this.dataSourceHelper.addSearchSubject(v.name, v.autocompleteType);
        }
      });
      // 给每一项创建formControl
      // const group: any = {};
      // this.formItems.forEach(v => {
      //   group[v.name] = new FormControl(v.value || '', Validators.required);
      // });
      // this.formGroup = new FormGroup(group);
    }
  }

  // 通过表格的种类显示不同的东西
  ngOnInit() {
  }

  // 提交(保存)表单
  save() {
    this.taskItemAssignment.taskFormData = JSON.stringify(this.formItems);
    this.taskItemAssignment.taskItem = undefined;
    this.taskItemAssignment.subProject = undefined;
    this._taskItemAssignmentService.update(this.taskItemAssignment).subscribe(() => {
        this.snackBar.open('保存表单成功！', '关闭', {duration: 2000});
        this.router.navigate(['../'], {relativeTo: this.route}).then();
      }
    );
  }

  // 打开转发窗口
  openForwardDialog() {
    this.taskItemAssignment.taskFormData = JSON.stringify(this.formItems);
    this.taskItemAssignment.taskItem = undefined;
    this.taskItemAssignment.subProject = undefined;
    const dialogRef = this.dialog.open(DialogTaskForwardComponent, {
      width: '640px', data: this.taskItemAssignment
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['../'], {relativeTo: this.route}).then();
      }
    });
  }
  // checkbox的操作
  checkboxValChange(event: MatCheckboxChange, item: TaskInputControl) {
    if (event.checked) {
      item.value = '通过';
    } else {
      item.value = '';
    }
  }
  // number数值控件部分的一些操作方法
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  addValNum(event, item: TaskInputControl) {
    const input = event.input;
    const value = event.value;
    if (!item.numberVal) {
      item.numberVal = [];
    }
    // Add our fruit
    if ((value || '').trim()) {
      item.numberVal.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    // 给value赋值，字符串的那种
    item.value = item.numberVal.join(',');
  }

  removeValNum(one: string, item: TaskInputControl) {
    const index = item.numberVal.indexOf(one);
    if (index >= 0) {
      item.numberVal.splice(index, 1);
    }
    // 给value赋值，字符串的那种
    item.value = item.numberVal.join(',');
  }
  checkValNum(item: TaskInputControl) {
    // this.formGroup[item.name].setErrors( item.value.length === item.expectedValNum ? null : {wrongValNum: true});
    if (item.numberVal && item.expectedValNum !== 0 && item.numberVal.length !== item.expectedValNum) {
      abp.message.info(`请输入正确数量的数据，应填数据量${item.expectedValNum}个，已填数据量${item.numberVal.length}个`);
    }
  }
  // 上传文件
  clickAddImageButton(item: TaskInputControl) {
    // const file: File = event.target.files[0];
    const formFile = new FormData();
    // 在bottomSheet里面会将file数据附上
    formFile.append('RelationalId', this.taskItemAssignment.id);
    formFile.append('FileItemCategory', FileItemCategory.TaskAssignment.toString());
    const bottomSheetRef = this.bottomSheet.open(ImageSelectorComponent, {data: {formData: formFile, formName: item.name}});
    bottomSheetRef.afterDismissed().subscribe(result => {
      if (result) {
        if (item.value) {
          this._fileItemService.delete(item.value).subscribe();
        }
        // 回调处的调用顺序不能变！！
        item.value = result.id;
        this.snackBar.open('上传文件成功！', '关闭', {duration: 2000});
      }
    });
    // this._fileItemService.create(formFile).subscribe((result: FileItem) => {
    //   item.value = result.id;
    //   this.snackBar.open('上传文件成功！', '关闭', {duration: 2000});
    // });
  }
}
