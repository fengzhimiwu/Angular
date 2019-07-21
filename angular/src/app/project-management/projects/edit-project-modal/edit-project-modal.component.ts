import {Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '@node_modules/ngx-bootstrap';
import {CreateProjectInput, ProjectDto, ProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from '@node_modules/rxjs/operators';
import {AppComponentBase} from '@shared/components/app-component-base';
import {FileItemService} from '@shared/service-proxies/file-item.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.css']
})
export class EditProjectModalComponent extends AppComponentBase {
  @ViewChild('createModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;
  active = false;
  saving = false;
  project: CreateProjectInput | ProjectDto = null;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _projectService: ProjectServiceProxy,
    private _fileItemService: FileItemService

  ) {
    super(injector);
  }
  public show(id?: string): void {
    if (id == null) {
      this.active = true;
      this.project = new CreateProjectInput();
      this.project.init({ isStatic: false });
      this.modal.show();
    } else {
      this._projectService.get(id).pipe(finalize(() => {
          this.active = true;
          this.modal.show();
        })).subscribe((result: ProjectDto) => {
          this.project = result;
        });
    }
  }

  onShown(): void {
    $.AdminBSB.input.activate($(this.modalContent.nativeElement));
  }
  save(): void {
    this.saving = true;
    if (this.project instanceof CreateProjectInput) {
      this._projectService.create(this.project).pipe(finalize(() => { this.saving = false; })).subscribe(() => {
        this.snackBar.open(this.l('保存成功！'), '关闭', {duration: 2000});
        this.close();
        this.modalSave.emit(null);
      });
    } else {
      this._projectService.update(this.project).pipe(finalize(() => { this.saving = false; })).subscribe(() => {
        this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2000});
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
