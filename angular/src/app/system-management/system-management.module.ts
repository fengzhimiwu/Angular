import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemManagementRouting } from '@app/system-management/system-management.routing';
import { TenantsComponent } from '@app/system-management/tenants/tenants.component';
import { CreateTenantComponent } from '@app/system-management/tenants/create-tenant/create-tenant.component';
import { EditTenantComponent } from '@app/system-management/tenants/edit-tenant/edit-tenant.component';
import { UsersComponent } from '@app/system-management/users/users.component';
import { CreateUserComponent } from '@app/system-management/users/create-user/create-user.component';
import { EditUserComponent } from '@app/system-management/users/edit-user/edit-user.component';
import { RolesComponent } from '@app/system-management/roles/roles.component';
import { CreateRoleComponent } from '@app/system-management/roles/create-role/create-role.component';
import { EditRoleComponent } from '@app/system-management/roles/edit-role/edit-role.component';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import {ModalModule} from '@node_modules/ngx-bootstrap';
import { NgxPaginationModule } from '@node_modules/ngx-pagination';
import { SystemManagementComponent} from '@app/system-management/system-management.component';
import { ProceduresComponent } from '@app/system-management/procedures/procedures.component';
import { ProcedureStepsComponent } from '@app/system-management/procedures/procedure-steps/procedure-steps.component';
import { ProcedureModalComponent } from '@app/system-management/procedures/procedure-modal/procedure-modal.component';
import { TaskItemsComponent } from './task-items/task-items.component';
import { ProcedureStepModalComponent } from './procedures/procedure-steps/procedure-step-modal/procedure-step-modal.component';
import { TaskItemModalComponent } from './task-items/task-item-modal/task-item-modal.component';
import { SystemSettingComponent } from '@app/system-management/system-settings/system-setting.component';
import { WorkshopTypesComponent } from './workbenchs/workshop-types/workshop-types.component';
import { WorkshopLayoutComponent } from './workbenchs/workshop-layout/workshop-layout.component';
import { WorkshopTypeModalComponent } from './workbenchs/workshop-types/workshop-type-modal/workshop-type-modal.component';
import { MonitorComponent } from './monitor/monitor.component';
import { CreateWorkshopComponent } from './workbenchs/workshop-layout/create-workshop/create-workshop.component';
import { EditWorkshopComponent } from './workbenchs/workshop-layout/edit-workshop/edit-workshop.component';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatTreeModule, MatCardModule, MatDividerModule, MatListModule, MatTooltipModule, MatChipsModule, MatMenuModule, MatAutocompleteModule
} from '@node_modules/@angular/material';
import {TaskItemFormComponent} from '@app/system-management/task-items/task-item-form/task-item-form.component';
import {SharedModule} from '@shared/shared.module';
import { AddGridItemFormComponent } from './task-items/task-item-form/add-grid-item-form/add-grid-item-form.component';
import { PermissionsTreeComponent } from './roles/permissions-tree/permissions-tree.component';
import { InvitationCodeDialogComponent } from './users/invitation-code-dialog/invitation-code-dialog.component';
import { StatementTemplatesComponent } from './statement-templates/statement-templates.component';
import { StatementTemplateDialogComponent } from './statement-templates/statement-template-dialog/statement-template-dialog.component';
import { RoutinesComponent } from './routines/routines.component';
import { RoutineDialogComponent } from './routines/routine-dialog/routine-dialog.component';
import { SystemSettingDialogComponent } from './system-settings/system-setting-dialog/system-setting-dialog.component';
import {DragDropModule} from '@node_modules/@angular/cdk/drag-drop';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // JsonpModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    SystemManagementRouting,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule,
    DragDropModule,
    MatAutocompleteModule,
  ],
  declarations: [
    SystemManagementComponent,
    TenantsComponent,
    CreateTenantComponent,
    EditTenantComponent,
    UsersComponent,
    CreateUserComponent,
    EditUserComponent,
    RolesComponent,
    CreateRoleComponent,
    EditRoleComponent,
    ProceduresComponent,
    ProcedureStepsComponent,
    ProcedureModalComponent,
    TaskItemsComponent,
    ProcedureStepModalComponent,
    SystemSettingComponent,
    TaskItemModalComponent,
    WorkshopTypesComponent,
    WorkshopLayoutComponent,
    WorkshopTypeModalComponent,
    TaskItemFormComponent,
    MonitorComponent,
    CreateWorkshopComponent,
    EditWorkshopComponent,
    AddGridItemFormComponent,
    PermissionsTreeComponent,
    InvitationCodeDialogComponent,
    StatementTemplatesComponent,
    StatementTemplateDialogComponent,
    RoutinesComponent,
    RoutineDialogComponent,
    SystemSettingDialogComponent
  ],
  entryComponents: [
    AddGridItemFormComponent,
    InvitationCodeDialogComponent,
    StatementTemplateDialogComponent,
    RoutineDialogComponent,
    SystemSettingDialogComponent
  ],
})
export class SystemManagementModule { }
