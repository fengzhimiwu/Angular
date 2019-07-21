import { AppComponentBase } from 'shared/components/app-component-base';
import {
  ProcedureStepDto,
  ProcedureStepServiceProxy,
  CreateProcedureStepInput,
  TaskItemDto, CreateProcedureStepTaskItemInput, ProcedureStepTaskItemDto, ProcedureStepTaskItemsServiceProxy
} from '@shared/service-proxies/service-proxies';
import { MatDialogRef, MAT_DIALOG_DATA } from '@node_modules/@angular/material';
import { Component, OnInit, Inject, Injector } from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from '@node_modules/rxjs/operators';
import {Subject} from '@node_modules/rxjs';

@Component({
  selector: 'app-routine-dialog',
  templateUrl: './routine-dialog.component.html',
  styleUrls: ['./routine-dialog.component.css']
})
export class RoutineDialogComponent extends AppComponentBase implements OnInit {
  model: ProcedureStepDto | CreateProcedureStepInput;
  bindings: ProcedureStepTaskItemDto[];
  unBindings: TaskItemDto[];
  private searchTerms = new Subject<string>();

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<RoutineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _procedureStepService: ProcedureStepServiceProxy,
    private _ptService: ProcedureStepTaskItemsServiceProxy,
  ) {
    super(injector);
   }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(500), // ignore new term if same as previous term
      distinctUntilChanged(),
      switchMap((key: string) => this._ptService.getAllTaskItem(key))
    ).subscribe(unBindings => {
      if (this.model instanceof ProcedureStepDto) {
        this.unBindings = unBindings.items;
      }
    });
    if (this.data) {
      // 从服务器取一个数据，修改
      this._procedureStepService.get(this.data).subscribe(result => {
        this.model = result;
        // 取得绑定的工作项
        this._ptService.getAllByProcedureStepId(result.id).subscribe(items => {
          this.bindings = items.items;
        });
      });
    } else {
      // 创建一个
      this.model = new CreateProcedureStepInput();
    }
  }

  save() {
    if (this.model instanceof ProcedureStepDto) {
      // 修改到服务器
      this._procedureStepService.update(this.model).subscribe(() => {
        this.snackBar.open('保存成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    } else {
      // 创建到服务器
      this._procedureStepService.create(this.model).subscribe(() => {
        this.snackBar.open('创建成功', '关闭', {duration: 2_000});
        this.dialogRef.close(true);
      });
    }
  }
  searchTaskItems(key: string) {
    this.searchTerms.next(key);
  }

  bindTaskItem(pt: TaskItemDto) {
    if (this.model instanceof ProcedureStepDto) {
      const bindInput = new CreateProcedureStepTaskItemInput({taskItemId: pt.id, procedureStepId: this.model.id});
      this._ptService.create(bindInput).subscribe((result) => {
        this.snackBar.open(pt.name + '绑定成功', '关闭', {duration: 2000});
        this.bindings.push(result);
      });
    }
  }

  unBindTaskItem(pt: ProcedureStepTaskItemDto) {
    if (this.model instanceof ProcedureStepDto) {
      this._ptService.delete(pt.id).subscribe(() => {
        this.snackBar.open(pt.taskItem.name + '解绑成功', '关闭', {duration: 2000});
        this.bindings.splice(this.bindings.indexOf(pt), 1);

      });
    }
  }

}
