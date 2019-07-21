import {Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '@node_modules/ngx-bootstrap';
import {CreateTaskItemInput, TaskItemDto, TaskItemServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from '@node_modules/rxjs/operators';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-task-item-modal',
  templateUrl: './task-item-modal.component.html',
  styleUrls: ['./task-item-modal.component.css']
})
export class TaskItemModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('editModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;

  active = false;
  saving = false;
  model: TaskItemDto | CreateTaskItemInput = null;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _taskItemService: TaskItemServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  show(id?: string): void {
    if (!id) {
      this.active = true;
      this.model = new CreateTaskItemInput();
      this.modal.show();
    } else {
      this._taskItemService.get(id).pipe(finalize(() => {
        this.active = true;
        this.modal.show();
      }))
        .subscribe((result: TaskItemDto) => {
          this.model = result;
        });
    }
  }

  onShown(): void {
    $.AdminBSB.input.activate($(this.modalContent.nativeElement));
  }

  save(): void {
    if (this.model instanceof CreateTaskItemInput) {
      this.saving = true;
      this._taskItemService.create(this.model)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.snackBar.open('保存成功', '关闭', {duration: 2000});
          this.close();
          this.modalSave.emit(null);
        });
    } else {
      this.saving = true;
      this._taskItemService.update(this.model)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.snackBar.open('保存成功', '关闭', {duration: 2000});
          this.close();
          this.modalSave.emit(null);
        });
    }
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
