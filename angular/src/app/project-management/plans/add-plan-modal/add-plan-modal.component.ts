import {Component, EventEmitter, Injector, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '@node_modules/ngx-bootstrap';
import {CreateSubProjectInput, SubProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from '@node_modules/rxjs/operators';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan-modal.component.html',
  styleUrls: ['./add-plan-modal.component.css']
})
export class AddPlanModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  saving = false;
  subProject: CreateSubProjectInput = new CreateSubProjectInput();

  constructor(
    injector: Injector,
    private _subProjectService: SubProjectServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this._subProjectService.createMultiple([this.subProject]).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe(() => {
      this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2_000});
      this.close();
      this.modalSave.emit(null);
    });
  }

  public show(): void {
    this.modal.show();
  }

  close(): void {
    this.modal.hide();
  }
}
