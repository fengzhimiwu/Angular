import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeDashboardComponent } from '@app/home-dashboard/home-dashboard.component';
import { HomeDashboardRouting } from './home-dashboard.routing';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatFormFieldModule, MatGridListModule, MatIconModule,
  MatInputModule, MatListModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRippleModule, MatSlideToggleModule,
  MatTabsModule,
  MatTooltipModule
} from '@node_modules/@angular/material';
import {SharedModule} from '@shared/shared.module';
import { SubProjectRelationalInfoComponent } from './sub-project-relational-info/sub-project-relational-info.component';
import {PersonalSettingComponent} from '@app/home-dashboard/personal-setting/personal-setting.component';
import {FormsModule, ReactiveFormsModule} from '@node_modules/@angular/forms';
import { PersonalOtherSettingsComponent } from './personal-setting/personal-other-settings/personal-other-settings.component';
import {PersonalPasswordSettingComponent} from '@app/home-dashboard/personal-setting/personal-password-setting/personal-password-setting.component';


@NgModule({
  imports: [
    CommonModule,
    HomeDashboardRouting,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatRippleModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatListModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSlideToggleModule,
  ],
  declarations: [
    HomeDashboardComponent,
    SubProjectRelationalInfoComponent,
    PersonalSettingComponent,
    PersonalOtherSettingsComponent,
    PersonalPasswordSettingComponent,
  ]
})
export class HomeDashboardModule { }
