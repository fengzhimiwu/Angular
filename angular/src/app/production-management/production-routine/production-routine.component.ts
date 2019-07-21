import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {AppComponentBase} from '@shared/components/app-component-base';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {
  CreateTaskItemAssignmentInput, PedestalDto,
  ProcedureStepDto,
  ProcedureStepTaskItemDto,
  ProductionRoutineServiceProxy,
  ProjectDto
} from '@shared/service-proxies/service-proxies';
import {
  DialogAssignTaskComponent
} from '@app/production-management/production-distribution/production-distribution-step2/dialog-assgin-task/dialog-assign-task.component';
import {MatDialog} from '@node_modules/@angular/material';
import {WorkshopDisplayComponent} from '@shared/components/workshop-display/workshop-display.component';
import {finalize} from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-production-routine',
  templateUrl: './production-routine.component.html',
  styleUrls: ['./production-routine.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductionRoutineComponent extends PagedListingComponentBase<ProcedureStepTaskItemDto> implements OnInit {
  @ViewChild('workshop') workshop: WorkshopDisplayComponent;
  project: ProjectDto;
  // 日常类别
  procedureSteps: ProcedureStepDto[];
  // 日常任务
  psTis: ProcedureStepTaskItemDto[];
  // 选择的台座对象
  pedestalSelection: PedestalDto;
  // 选择的工作项列表
  selections: ProcedureStepTaskItemDto[] = [];

  constructor(
    injector: Injector,
    private _productionRoutineService: ProductionRoutineServiceProxy,
    private dialog: MatDialog,
  ) {
    super(injector);
  }

  // 选择任务类别
  getRoutineTasks(ps: ProcedureStepDto) {
    this._productionRoutineService.getAllRoutineTasks(ps.id).subscribe(result => this.psTis = result.items);
  }

  // 选择台座后触发，获取任务列表
  onChooseWorkshop(event: PedestalDto) {
    if (event && event.subProjectId) {
      this.pedestalSelection = event;
    }
  }

  // 勾选checkbox方法
  selectTaskItemCheckbox(event: boolean, procedureStepTaskItem: ProcedureStepTaskItemDto) {
    if (event) {
      this.selections.push(procedureStepTaskItem);
    } else {
      this.selections.splice(this.psTis.indexOf(procedureStepTaskItem), 1);
    }
  }

  // 任务分派，循环的给任务填充信息
  assignTask() {
    const inputs = [];
    for (const se of this.selections) {
      const input = new CreateTaskItemAssignmentInput();
      input.init({
        taskItemId: se.taskItemId,
        subProjectId: this.pedestalSelection ? this.pedestalSelection.subProjectId : null,
        procedureStepTaskItemId: se.id
      });
      inputs.push(input);
    }
    const dialogRef = this.dialog.open(DialogAssignTaskComponent, {width: '640px', data: {project: this.project, inputs: inputs}});
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // 如果分派成功清空勾选的任务
        this.selections.splice(0, this.selections.length);
        this.workshop.autoGeneration();
        this.onChooseWorkshop(null);
      }
    });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._productionRoutineService.getAllRoutineCategory().pipe(finalize(() => finishedCallback()))
      .subscribe(result => this.procedureSteps = result.items);
  }

  protected delete(entity: ProcedureStepTaskItemDto): void {
  }
}
