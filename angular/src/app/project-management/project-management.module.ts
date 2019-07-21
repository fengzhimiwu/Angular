import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import {ProjectManagementRouting} from '@app/project-management/project-management.routing';
import {ProjectManagementComponent} from '@app/project-management/project-management.component';
import {ModalModule, TooltipModule} from '@node_modules/ngx-bootstrap';
import {NgxPaginationModule} from '@node_modules/ngx-pagination';
import { EditProjectModalComponent } from './projects/edit-project-modal/edit-project-modal.component';
import {FormsModule, ReactiveFormsModule} from '@node_modules/@angular/forms';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { PlansComponent } from './plans/plans.component';
import { QualityComponent } from './quality/quality.component';
import {SharedModule} from '@shared/shared.module';
import { AddPlanModalComponent } from './plans/add-plan-modal/add-plan-modal.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatCheckboxModule,
  MatIconModule,
  MatSelectModule,
  MatOptionModule,
  MatCardModule,
  MatTabsModule,
  MatTooltipModule,
  MatDialogModule, MatListModule, MatDividerModule, MatMenuModule, MatBottomSheetModule, MatRadioModule,
} from '@node_modules/@angular/material';
import { ProjectMembersComponent } from './projects/project-members/project-members.component';
import { ProjectModelComponent } from './projects/project-model/project-model.component';
import { ProjectWorkshopComponent } from './projects/project-workshop/project-workshop.component';
import { BindSubProjectComponent } from './plans/bind-sub-project/bind-sub-project.component';
import { AddSubDialogComponent } from './plans/bind-sub-project/add-sub-dialog/add-sub-dialog.component';
import { ProjectVideoComponent } from './projects/project-detail/project-video/project-video.component';
import {ProjectFilesComponent} from '@app/project-management/projects/project-detail/project-files/project-files.component';
import { StatementsComponent } from './statements/statements.component';
import { ChooseStatementAssignmentBottomComponent } from './statements/choose-statement-assignment-bottom/choose-statement-assignment-bottom.component';
import { AdjustSubProjectComponent } from './plans/adjust-sub-project/adjust-sub-project.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    ProjectManagementRouting,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatRadioModule,
  ],
  declarations: [
    ProjectsComponent,
    ProjectManagementComponent,
    EditProjectModalComponent,
    ProjectDetailComponent,
    PlansComponent,
    QualityComponent,
    AddPlanModalComponent,
    ProjectFilesComponent,
    ProjectMembersComponent,
    ProjectModelComponent,
    ProjectWorkshopComponent,
    BindSubProjectComponent,
    AddSubDialogComponent,
    ProjectVideoComponent,
    StatementsComponent,
    ChooseStatementAssignmentBottomComponent,
    AdjustSubProjectComponent
  ],
  entryComponents: [
    AddSubDialogComponent,
    ChooseStatementAssignmentBottomComponent
  ]
})
export class ProjectManagementModule { }
