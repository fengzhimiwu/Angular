import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {AbpModule} from '@abp/abp.module';
import {RouterModule} from '@angular/router';
import {AppSessionService} from './session/app-session.service';
import {AppUrlService} from './nav/app-url.service';
import {AppAuthService} from './auth/app-auth.service';
import {AppRouteGuard} from './auth/auth-route-guard';
import {BimViewerComponent} from '@shared/components/bim-viewer/bim-viewer.component';
import {ProjectAutocompleteComponent} from './components/project-autocomplete/project-autocomplete.component';
import {
  MatAutocompleteModule, MatBadgeModule,
  MatButtonModule, MatChipsModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {MatRippleModule} from '@angular/material/core';
import {ProcedureAutocompleteComponent} from './components/procedure-autocomplete/procedure-autocomplete.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WorkshopDisplayComponent} from './components/workshop-display/workshop-display.component';
import {SettingsSelectorComponent} from './components/settings-selector/settings-selector.component';
import {ProjectMemberAutocompleteComponent} from './components/project-member-autocomplete/project-member-autocomplete.component';
import {FileViewerComponent} from './components/file-viewer/file-viewer.component';
import {DragDropModule} from '@node_modules/@angular/cdk/drag-drop';
import {UserHeadViewerComponent} from './components/user-head-viewer/user-head-viewer.component';
import {SimpleDatePipe} from './pipes/simple-date.pipe';
import {
  ProjectMemberMultipleAutocompleteComponent
} from './components/project-member-multiple-autocomplete/project-member-multiple-autocomplete.component';
import { SubToolbarComponent } from './components/sub-toolbar/sub-toolbar.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import {WorkshopDisplayDialogComponent} from '@shared/components/workshop-display/workshop-display-dialog.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { ToolbarSearchDirective } from './directives/toolbar-search.directive';
import { ImageSelectorComponent } from './components/image-selecter/image-selector.component';
import { CameraComponent } from './components/image-selecter/camera/camera.component';;
import {DivEmptyStateComponent, EmptyStateDirective} from './directives/empty-state.directive'

// 公共使用的模块
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AbpModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    DragDropModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    MatMenuModule,
    MatBadgeModule,
    MatListModule,
  ],
  declarations: [
    BimViewerComponent,
    ProcedureAutocompleteComponent,
    ProjectAutocompleteComponent,
    WorkshopDisplayComponent,
    SettingsSelectorComponent,
    ProjectMemberAutocompleteComponent,
    FileViewerComponent,
    UserHeadViewerComponent,
    SimpleDatePipe,
    ProjectMemberMultipleAutocompleteComponent,
    SubToolbarComponent,
    ButtonGroupComponent,
    WorkshopDisplayDialogComponent,
    LoadingDialogComponent,
    ToolbarSearchDirective,
    ImageSelectorComponent,
    CameraComponent,
    EmptyStateDirective,
    DivEmptyStateComponent,
  ],
  exports: [
    MatRippleModule,
    BimViewerComponent,
    ProcedureAutocompleteComponent,
    ProjectAutocompleteComponent,
    WorkshopDisplayComponent,
    SettingsSelectorComponent,
    ProjectMemberAutocompleteComponent,
    FileViewerComponent,
    UserHeadViewerComponent,
    ProjectMemberMultipleAutocompleteComponent,
    SubToolbarComponent,
    ButtonGroupComponent,
    ToolbarSearchDirective,
    EmptyStateDirective
  ],
  entryComponents: [
    WorkshopDisplayDialogComponent,
    LoadingDialogComponent,
    ImageSelectorComponent,
    CameraComponent,
    DivEmptyStateComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AppSessionService,
        AppUrlService,
        AppAuthService,
        AppRouteGuard,
      ]
    };
  }
}
