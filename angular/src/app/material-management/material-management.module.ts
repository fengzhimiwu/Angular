import { MaterialSettingDialogComponent } from './material-settings/material-setting-dialog/material-setting-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialManagementRouting } from '@app/material-management/material-management.routing';
import { ProvidersComponent } from '@app/material-management/providers/providers.component';
import { DevicesComponent } from '@app/material-management/devices/devices.component';
import { ExaminationsComponent } from './examinations/examinations.component';
import { MaterialSettingsComponent } from './material-settings/material-settings.component';
import { MaterialManagementComponent } from '@app/material-management/material-management.component';
import { InventoriesComponent } from './inventories/inventories.component';
import {
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatAutocompleteModule,
  MatMenuModule, MatCheckboxModule
} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceDialogComponent } from './devices/device-dialog/device-dialog.component';
import { InventoriesDialogComponent } from './inventories/inventories-dialog/inventories-dialog.component';
import { ProviderDialogComponent } from './providers/provider-dialog/provider-dialog.component';
import { ExaminationsDialogComponent } from './examinations/examinations-dialog/examinations-dialog.component';


@NgModule({
  declarations: [
    MaterialManagementComponent,
    ProvidersComponent,
    DevicesComponent,
    ExaminationsComponent,
    MaterialSettingsComponent,
    InventoriesComponent,
    DeviceDialogComponent,
    InventoriesDialogComponent,
    ProviderDialogComponent,
    ExaminationsDialogComponent,
    MaterialSettingDialogComponent,
    ProviderDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialManagementRouting,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
  ],
  entryComponents: [
    DeviceDialogComponent,
    InventoriesDialogComponent,
    ExaminationsDialogComponent,
    MaterialSettingDialogComponent,
    ProviderDialogComponent,
  ]
})
export class MaterialManagementModule {}
