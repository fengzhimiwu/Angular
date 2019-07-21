import {Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  CreateTaskItemAssignmentInput,
  PedestalDto,
  ProjectDto,
  SubProjectDto,
  ProductionServiceProxy,
  TaskItemAssignmentServiceProxy,
  TaskItemDto,
  UserDto
} from '@shared/service-proxies/service-proxies';
import {SubProjectStageProperties} from '@shared/models/sub-project-stage-properties';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {SubProjectStageHelper} from '@shared/helpers/sub-project-stage.helper';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {finalize} from '@node_modules/rxjs/operators';
import {ExtentPedestal, WorkshopDisplayComponent} from '@shared/components/workshop-display/workshop-display.component';

@Component({
  selector: 'app-production-distribution-step3',
  templateUrl: './production-distribution-step3.component.html',
  styleUrls: ['./production-distribution-step3.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductionDistributionStep3Component extends PagedListingComponentBase<SubProjectDto> implements OnInit {
  @ViewChild('workshop') workshop: WorkshopDisplayComponent;
  project: ProjectDto;
  // 可供操作的构件列表
  subProjects: (SubProjectDto & SubProjectStageProperties)[];
  subProjectSelected: SubProjectDto;
  // 选择的构件/台座对象
  pedestal: PedestalDto&ExtentPedestal;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
    private _productionService: ProductionServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }
  // 清除一个构件
  clearOne() {
    const clearOperation = (result: boolean): void => {
      if (result) {
        this._productionService.leavePedestal(this.pedestal.id).subscribe(() => {
          this.workshop.autoGeneration();
          this.snackBar.open('清理成功！', '关闭', {duration: 2000});
          this.refresh();
          this.pedestal = null;
        });
      }
    };
    // 未完成弹出提示
    if (this.pedestal.className !== 'in-completing') {
      abp.message.confirm('本构件还未完成，此操作会重置构件状态，确定删除？', clearOperation);
    } else {
      clearOperation(true);
    }
  }
  // 清理所有已完成构件
  clearSubProjects() {
    abp.message.confirm('确定清理所有已完成构件？', result => {
      if (result) {
        const ids = [];
        this.subProjects.forEach(v => {
          ids.push(v.id);
        });
        this._productionService.autoLeavePedestal(ids).subscribe(() => {
          this.workshop.autoGeneration();
          this.snackBar.open('清理全部成功！', '关闭', {duration: 2000});
          this.refresh();
        });
      }
    });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    if (this.project) {
      this._productionService.getAllInFinished(request.skipCount, request.maxResultCount, this.project.id)
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
