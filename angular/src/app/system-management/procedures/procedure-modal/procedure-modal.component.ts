import {Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '@node_modules/ngx-bootstrap';
import {CreateProcedureInput, ProcedureDto, ProcedureServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from '@node_modules/rxjs/operators';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-procedure-modal',
  templateUrl: './procedure-modal.component.html',
  styleUrls: ['./procedure-modal.component.css']
})
export class ProcedureModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('editModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;

  active = false;
  saving = false;
  model: ProcedureDto | CreateProcedureInput = null;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _procedureService: ProcedureServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {

  }

  show(id?: string): void {
    if (!id) {
      this.active = true;
      this.model = new CreateProcedureInput();
      this.modal.show();
    } else {
      this._procedureService.get(id).pipe(finalize(() => {
          this.active = true;
          this.modal.show();
        }))
        .subscribe((result: ProcedureDto) => {
          this.model = result;
        });
    }
  }

  onShown(): void {
    $.AdminBSB.input.activate($(this.modalContent.nativeElement));
  }

  save(): void {
    if (this.model instanceof CreateProcedureInput) {
      this.saving = true;
      this._procedureService.create(this.model)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.snackBar.open(this.l('创建成功！'), '关闭', {duration: 2000});
          this.close();
          this.modalSave.emit(null);
        });
    } else {
      this.saving = true;
      this._procedureService.update(this.model)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.snackBar.open(this.l('修改成功！'), '关闭', {duration: 2000});
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
