import {Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '@node_modules/ngx-bootstrap';
import {
  CreateProcedureStepInput, CreateProcedureStepTaskItemInput,
  ProcedureStepDto,
  ProcedureStepServiceProxy, ProcedureStepTaskItemDto, ProcedureStepTaskItemsServiceProxy, TaskItemDto,
} from '@shared/service-proxies/service-proxies';
import {debounceTime, distinctUntilChanged, finalize, map, switchMap} from '@node_modules/rxjs/operators';
import {AppComponentBase} from '@shared/components/app-component-base';
import {Subject} from '@node_modules/rxjs';

@Component({
  selector: 'app-procedure-step-modal',
  templateUrl: './procedure-step-modal.component.html',
  styleUrls: ['./procedure-step-modal.component.css']
})
export class ProcedureStepModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('editModal') modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  saving = false;
  model: ProcedureStepDto | CreateProcedureStepInput;
  bindings: ProcedureStepTaskItemDto[];
  unBindings: TaskItemDto[];
  isCreating = true;
  private searchTerms = new Subject<string>();

  constructor(
    injector: Injector,
    private _procedureStepService: ProcedureStepServiceProxy,
    private _ptService: ProcedureStepTaskItemsServiceProxy
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
        // // 取得绑定的工作项
        // this.taskItemService.getAllByProcedureStepId(this.model.id)
        //   .subscribe((items: PagedResultDtoOfTaskItemDto) => {
        //     this.taskItems = [...this.taskItems, ...unBinding.items];
        //   });
      }
    });
  }

  show(id: string, isCreate: boolean, priority: number): void {
    this.isCreating = isCreate;
    if (isCreate) {
      this.model = new CreateProcedureStepInput();
      this.model.init({procedureId: id, priority: priority});
      this.modal.show();
    } else {
      this._procedureStepService.get(id).subscribe((result: ProcedureStepDto) => {
        this.model = result;
        // 取得绑定的工作项
        this._ptService.getAllByProcedureStepId(result.id).subscribe(items => {
          this.bindings = items.items;
          this.modal.show();
        });
      });
    }
  }
  // 搜索方法
  searchTaskItems(key: string) {
    this.searchTerms.next(key);
  }

  onShown(): void { }
  // 保存方法
  save(): void {
    this.saving = true;
    // new Observable().pipe(
    //   switchMap(() => this.model instanceof CreateProcedureStepInput
    //     ? this._procedureStepService.create(this.model)
    //     : this._procedureStepService.update(this.model)),
    //   finalize(() => this.saving = false),
    // ).subscribe(() => {
    //   this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2000});
    //   this.close();
    //   this.modalSave.emit(null);
    // });
    if (this.model instanceof CreateProcedureStepInput) {
      this._procedureStepService.create(this.model).pipe(finalize(() => this.saving = false))
        .subscribe(() => {
          this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2000});
          this.close();
          this.modalSave.emit(null);
        });
    } else {
      this._procedureStepService.update(this.model).pipe(finalize(() => this.saving = false))
        .subscribe(() => {
          this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2000});
          this.close();
          this.modalSave.emit(null);
        });
    }
  }

  close(): void {
    this.modal.hide();
  }
  // 绑定工作项
  bindTaskItem(pt: TaskItemDto) {
    if (this.model instanceof ProcedureStepDto) {
      const bindInput = new CreateProcedureStepTaskItemInput({taskItemId: pt.id, procedureStepId: this.model.id});
      this._ptService.create(bindInput).subscribe((result) => {
        this.snackBar.open(pt.name + '绑定成功', '关闭', {duration: 2000});
        this.bindings.push(result);
      });
    }
  }
  // 解绑工作项
  unBindTaskItem(pt: ProcedureStepTaskItemDto) {
    if (this.model instanceof ProcedureStepDto) {
      this._ptService.delete(pt.id).subscribe(() => {
        this.snackBar.open(pt.taskItem.name + '解绑成功', '关闭', {duration: 2000});
        this.bindings.splice(this.bindings.indexOf(pt), 1);

      });
    }
  }
}
