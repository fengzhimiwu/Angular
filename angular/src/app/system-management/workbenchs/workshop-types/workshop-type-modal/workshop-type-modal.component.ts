import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { WorkshopTypeDto, CreateWorkshopTypeInput, WorkshopTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/components/app-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-workshop-type-modal',
  templateUrl: './workshop-type-modal.component.html',
  styleUrls: ['./workshop-type-modal.component.css']
})
export class WorkshopTypeModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('editModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;

  active = false;
  saving = false;
  model: WorkshopTypeDto | CreateWorkshopTypeInput = null;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _workshopTypeService: WorkshopTypeServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {

  }

  show(id?: string): void {
    if (!id) {
      this.active = true;
      this.model = new CreateWorkshopTypeInput();
      this.modal.show();
    } else {
      this._workshopTypeService.get(id).pipe(finalize(() => {
          this.active = true;
          this.modal.show();
        }))
        .subscribe((result: WorkshopTypeDto) => {
          this.model = result;
        });
    }
  }

  onShown(): void {
    $.AdminBSB.input.activate($(this.modalContent.nativeElement));
  }

  save(): void {
    if (this.model instanceof CreateWorkshopTypeInput) {
      this.saving = true;
      this._workshopTypeService.create(this.model)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.close();
          this.modalSave.emit(null);
        });
    } else {
      this.saving = true;
      this._workshopTypeService.update(this.model)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.notify.info(this.l('SavedSuccessfully'));
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
