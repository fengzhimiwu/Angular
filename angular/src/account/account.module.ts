import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {ModalModule} from 'ngx-bootstrap';

import {AbpModule} from '@abp/abp.module';

import {AccountRoutingModule} from './account-routing.module';

import {ServiceProxyModule} from '@shared/service-proxies/service-proxy.module';

import {SharedModule} from '@shared/shared.module';

import {AccountComponent} from './account.component';
import {TenantChangeComponent} from './tenant/tenant-change.component';
import {TenantChangeModalComponent} from './tenant/tenant-change-modal.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

import {LoginService} from './login/login.service';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@node_modules/@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    // JsonpModule,
    AbpModule,
    SharedModule,
    ServiceProxyModule,
    AccountRoutingModule,
    ModalModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  declarations: [
    AccountComponent,
    TenantChangeComponent,
    TenantChangeModalComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    LoginService
  ],
  entryComponents: [
    TenantChangeModalComponent,
  ]
})
export class AccountModule {

}
