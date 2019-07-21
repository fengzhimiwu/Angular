import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {
  CreateTaskItemAssignmentInput,
  PedestalDto,
  ProjectDto,
  SubProjectDto, ProductionServiceProxy,
  ProcedureStepTaskItemDto
} from '@shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {SubProjectStageHelper} from '@shared/helpers/sub-project-stage.helper';
import {SubProjectStageProperties} from '@shared/models/sub-project-stage-properties';
import {MatDialog, MatVerticalStepper} from '@node_modules/@angular/material';
import {DialogAssignTaskComponent} from './dialog-assgin-task/dialog-assign-task.component';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {finalize} from '@node_modules/rxjs/operators';
import {WorkshopDisplayComponent} from '@shared/components/workshop-display/workshop-display.component';

@Component({
  selector: 'app-production-distribution-step2',
  templateUrl: './production-distribution-step2.component.html',
  styleUrls: ['./production-distribution-step2.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductionDistributionStep2Component extends PagedListingComponentBase<SubProjectDto> implements OnInit {
  @ViewChild('stepper') stepper: MatVerticalStepper;
  @ViewChild('workshop') workshop: WorkshopDisplayComponent;
  project: ProjectDto;
  // 需要分派的任务列表
  procedureStepTaskItems: ProcedureStepTaskItemDto[];
  // 可供分派任务的构件
  subProjects: (SubProjectDto & SubProjectStageProperties)[];
  // 选择的台座对象
  pedestalSelection: PedestalDto;
  // 选择的工作项列表
  selections: ProcedureStepTaskItemDto[] = [];

  constructor(
    injector: Injector,
    private dialog: MatDialog,
    private _productionService: ProductionServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }
  // 选择台座后触发，获取任务列表
  onChooseWorkshop(event: PedestalDto) {
    if (event && event.subProjectId) {
      this._productionService.getTaskItemsBySubProject(event.subProjectId).subscribe(result => {
        this.procedureStepTaskItems = result.items;
        this.stepper.next();
      });
    } else {
      this.stepper.reset();
      this.procedureStepTaskItems = [];
    }
  }
  // 勾选checkbox方法
  selectTaskItemCheckbox(event: boolean, procedureStepTaskItem: ProcedureStepTaskItemDto) {
    if (event) {
      this.selections.push(procedureStepTaskItem);
    } else {
      this.selections.splice(this.procedureStepTaskItems.indexOf(procedureStepTaskItem), 1);
    }
  }

  // 任务分派，循环的给任务填充信息
  assignTask() {
    const inputs = [];
    for (const se of this.selections) {
      const input = new CreateTaskItemAssignmentInput();
      input.init({taskItemId: se.taskItemId, subProjectId: this.pedestalSelection.subProjectId, procedureStepTaskItemId: se.id});
      inputs.push(input);
    }
    const dialogRef = this.dialog.open(DialogAssignTaskComponent, {width: '640px', data: {project: this.project, inputs: inputs}});
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) { // 如果分派成功刷新数据
        this.selections.splice(0);
        this.workshop.autoGeneration();
        this.refresh();
        this.onChooseWorkshop(null);
      }
    });
  }
  // 获取构件信息
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    if (this.project) {
      this._productionService.getAllInProcessing(request.skipCount, request.maxResultCount, this.project.id)
        .pipe(finalize(() => finishedCallback())).subscribe(result => {
        this.subProjects = result.items;
        this.showPaging(result, pageNumber);
        this.subProjects.forEach(v => {
          v.bgClass = SubProjectStageHelper.getBackgroundClass(v);
          v.progress = SubProjectStageHelper.getProgress(v);
        });
      });
    } else {
      finishedCallback();
    }
  }

  protected delete(entity: SubProjectDto): void {
  }

}
