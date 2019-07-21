import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {
  PedestalDto, PedestalServiceProxy, ProjectDto, SubProjectDto, ProductionServiceProxy
} from '@shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {finalize} from '@node_modules/rxjs/operators';
import {SubProjectStageHelper} from '@shared/helpers/sub-project-stage.helper';
import {SubProjectStageProperties} from '@shared/models/sub-project-stage-properties';
import {BimViewerComponent} from '@shared/components/bim-viewer/bim-viewer.component';
import {MatRadioChange, MatVerticalStepper} from '@node_modules/@angular/material';
import {WorkshopDisplayComponent} from '@shared/components/workshop-display/workshop-display.component';
import {MatDialog} from '@angular/material';
// import {MatDialog} from '@node_modules/@angular/material/typings/dialog';
import {SubLogPreviewDialogComponent
} from '@app/production-management/production-distribution/production-distribution-step1/sub-log-preview-dialog/sub-log-preview-dialog.component';


@Component({
  selector: 'app-production-distribution-step1',
  templateUrl: './production-distribution-step1.component.html',
  styleUrls: ['./production-distribution-step1.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductionDistributionStep1Component extends PagedListingComponentBase<SubProjectDto> implements OnInit {
  @ViewChild('bimViewer') bimViewer: BimViewerComponent;
  @ViewChild('workshop') workshop: WorkshopDisplayComponent;
  @ViewChild('stepper') stepper: MatVerticalStepper;
  project: ProjectDto;
  subProjects: (SubProjectDto & SubProjectStageProperties)[];
  // 选择后的构件对象
  subProjectSelected: SubProjectDto;
  // 选择的台座对象
  pedestalSelected: PedestalDto;
  isFinished = true;
  // 模型dbId显示的类型
  dbIdType: number;
  // 是否显示列表
  isListShown: boolean;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _productionService: ProductionServiceProxy,
    private _pedestalService: PedestalServiceProxy,
    private dialog: MatDialog
  ) {
    super(injector);
  }

  ngOnInit() {
  }
  // 项目被选择后
  onProjectSelected($event) {
    this.project = $event;
    this.refresh();
  }

  // 选择构件后触发
  onSubProjectSelect(event: number[]) {
    this.subProjectSelected = this.subProjects.find(v => event.indexOf(v.bimModelDbId) !== -1);
    if (this.subProjectSelected) {
      this.stepper.next();
    }
  }

  // 台座被点击的时候的时候
  pedestalChange(p: PedestalDto) {
    // 如果当前工序完成则自动选择。条件：当前工序完成或构件已完成
    if (p && p.subProjectId && (SubProjectStageHelper.isCurrentStepFinished(p.subProject) || p.subProject.isFinished)) {
      this.subProjectSelected = this.subProjects.find(v => v.id === p.subProjectId);
    }
  }

  // 台座绑定，即右下角的原型按钮被点击时
  bindPedestal() {
    this.pedestalSelected.subProjectId = this.subProjectSelected.id;
    this._pedestalService.update(this.pedestalSelected).subscribe(() => {
      // 刷新台座
      this.workshop.autoGeneration();
      this.refresh();
      this.snackBar.open('绑定成功！', '关闭', {duration: 2000});
      // 清空以便使用
      this.subProjectSelected = null;
      this.pedestalSelected = null;
      // 重置step，并刷新状态
      if (!this.isListShown) {
        this.bimViewer.getStatedBimModelDbIds(this.bimViewer.selectedBimModel, () => this.dbIdTypeChange(this.dbIdType));
      }
      this.stepper.reset();
    });
  }

  // 自动选择一个构件
  autoSelectOne() {
    const selectedDbId = this.bimViewer.statedBimModelDbIds.currentStepFinishedDbIds.length > 0
      ? this.bimViewer.statedBimModelDbIds.currentStepFinishedDbIds[0]
      : this.bimViewer.statedBimModelDbIds.noStateDbIds[0];
    this.bimViewer.select([selectedDbId]);
    setTimeout(() => this.stepper.next(), 200);
  }

  // 模型显示的类型即dbIdType变化的时候
  dbIdTypeChange(event: number) {
    switch (event) {
      case 0:
        this.bimViewer.showByDbIds();
        break;
      case 1:
        this.bimViewer.showByDbIds([...this.bimViewer.statedBimModelDbIds.currentStepFinishedDbIds,
          ...this.bimViewer.statedBimModelDbIds.noStateDbIds]);
        break;
      case 2:
        this.bimViewer.showByDbIds(this.bimViewer.statedBimModelDbIds.processingDbIds);
        break;
      case 3:
        this.bimViewer.showByDbIds(this.bimViewer.statedBimModelDbIds.finishedDbIds);
        break;
    }
  }
    // 跳到一个可以浏览的dialog来预览构件
    openSubLogPreviewDialog() {
      this.dialog.open(SubLogPreviewDialogComponent, {width: '640px', data: this.subProjectSelected});
    }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    console.log(this.isFinished);
    if (this.project) {
      this._productionService.getAllUnbinding(this.isFinished, this.project.id, request.skipCount, request.maxResultCount).pipe(
        finalize(() => finishedCallback())
      ).subscribe((result) => {
        this.subProjects = result.items;
        this.showPaging(result, pageNumber);
        // 给每个构件设置不同的class表示不同的状态
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
