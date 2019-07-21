import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {TenantServiceProxy, CreateTenantDto, Edition} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/components/app-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'create-tenant-modal',
  templateUrl: './create-tenant.component.html'
})
export class CreateTenantComponent extends AppComponentBase {

    @ViewChild('createTenantModal') modal: ModalDirective;
    @ViewChild('modalContent') modalContent: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active: boolean = false;
    saving: boolean = false;
    tenant: CreateTenantDto = null;
    editions: Edition[] = null;

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
        this.tenant = new CreateTenantDto();
        this.tenant.init({isActive: true});
        this._tenantService.getEditions().subscribe(result => this.editions = result.items);
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.modalContent.nativeElement));
    }

    save(): void {
        this.saving = true;
        // 设置默认email地址
      this.tenant.adminEmailAddress = this.tenant.mobileNumber + '@email.com';
        this._tenantService.create(this.tenant)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2_000});
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
