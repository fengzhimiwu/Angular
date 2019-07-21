import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductionManagementRouting} from '@app/production-management/production-management.routing';
import {ProductionManagementComponent} from '@app/production-management/production-management.component';
import {FormsModule, ReactiveFormsModule} from '@node_modules/@angular/forms';
import {ModalModule} from '@node_modules/ngx-bootstrap';
import {NgxPaginationModule} from '@node_modules/ngx-pagination';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { ProductionDistributionStep1Component
} from './production-distribution/production-distribution-step1/production-distribution-step1.component';
import { TaskDetailComponent } from './my-tasks/task-detail/task-detail.component';
import {SharedModule} from '@shared/shared.module';
import {
  MatAutocompleteModule, MatBottomSheetModule,
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatChipsModule, MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSlideToggleModule,
  MatStepperModule, MatTooltipModule
} from '@node_modules/@angular/material';
import { ProductionDistributionStep2Component
} from './production-distribution/production-distribution-step2/production-distribution-step2.component';
import { MyTasksFinishedComponent } from './my-tasks-finished/my-tasks-finished.component';
import { ProductionDistributionStep3Component
} from './production-distribution/production-distribution-step3/production-distribution-step3.component';
import { MyTasksCooperatedComponent } from './my-tasks-cooperated/my-tasks-cooperated.component';
import { DialogTaskForwardComponent } from './my-tasks/task-detail/dialog-task-forward/dialog-task-forward.component';
import { DialogAssignTaskComponent
} from './production-distribution/production-distribution-step2/dialog-assgin-task/dialog-assign-task.component';
import { TaskDetailFormComponent } from './my-tasks/task-detail/task-detail-form/task-detail-form.component';
import { MyTasksPublishedComponent } from './my-tasks-published/my-tasks-published.component';
import { TaskItemInfoDialogComponent } from './my-tasks/task-detail/task-item-info-dialog/task-item-info-dialog.component';
import { ProductionRoutineComponent } from './production-routine/production-routine.component';
import { TaskFormPreviewDialogComponent } from './my-tasks/task-detail/task-form-preview-dialog/task-form-preview-dialog.component';
import { SubLogPreviewDialogComponent } from './production-distribution/production-distribution-step1/sub-log-preview-dialog/sub-log-preview-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ProductionManagementRouting,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    SharedModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatListModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBottomSheetModule,
    MatRadioModule,
  ],
  declarations: [
    ProductionManagementComponent,
    MyTasksComponent,
    ProductionDistributionStep1Component,
    TaskDetailComponent,
    ProductionDistributionStep2Component,
    MyTasksFinishedComponent,
    ProductionDistributionStep3Component,
    MyTasksCooperatedComponent,
    DialogTaskForwardComponent,
    DialogAssignTaskComponent,
    TaskDetailFormComponent,
    MyTasksPublishedComponent,
    TaskItemInfoDialogComponent,
    ProductionRoutineComponent,
    TaskFormPreviewDialogComponent,
    SubLogPreviewDialogComponent,
  ],
  entryComponents: [
    DialogTaskForwardComponent,
    DialogAssignTaskComponent,
    TaskItemInfoDialogComponent,
    TaskFormPreviewDialogComponent,
    SubLogPreviewDialogComponent
  ]
})
export class ProductionManagementModule {
}
