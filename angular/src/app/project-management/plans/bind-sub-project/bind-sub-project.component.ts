import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {
  BimModelDto,
  ProcedureDto,
  ProjectDto,
  ProjectServiceProxy,
  SubProjectDto,
  SubProjectServiceProxy
} from '@shared/service-proxies/service-proxies';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {Router} from '@node_modules/@angular/router';
import {BiaViewerModels} from '@shared/models/bia-viewer-models';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {switchIn} from '@shared/animations/data-animation';
import {distinctUntilChanged, finalize} from '@node_modules/rxjs/operators';
import {AddSubDialogComponent} from '@app/project-management/plans/bind-sub-project/add-sub-dialog/add-sub-dialog.component';
import {MatDialog} from '@node_modules/@angular/material';
import {FormControl} from '@node_modules/@angular/forms';
import {FileItemCategory} from '@shared/AppEnums';
import {BimViewerComponent} from '@shared/components/bim-viewer/bim-viewer.component';

@Component({
  selector: 'app-bind-subproject-model',
  templateUrl: './bind-sub-project.component.html',
  styleUrls: ['./bind-sub-project.component.css'],
  animations: [appModuleAnimation(), switchIn]
})
export class BindSubProjectComponent extends PagedListingComponentBase<SubProjectDto> implements OnInit {
  @ViewChild('bimViewer') bimViewer: BimViewerComponent;
  project: ProjectDto;
  procedure: ProcedureDto;
  // 所有构件
  subProjects: SubProjectDto[];
  // bim中所有的模型id
  groupBimModelIds: BiaViewerModels;
  // 选中的BIM模型
  selectedBimModel: BimModelDto;
  // 搜索字段
  searchControl = new FormControl('');
  // 选中的构件的DbId
  subProjectSelectedBimDbId: string;
  // 模型dbId显示的类型
  // dbIdType: number;

  constructor(
    injector: Injector,
    private router: Router,
    private _projectService: ProjectServiceProxy,
    private _subProjectService: SubProjectServiceProxy,
    private _fileItemService: FileItemService,
    private dialog: MatDialog,
  ) {
    super(injector);
    this.stateChanger.init('bindSubProject', 3, () => this.refresh());
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.refresh());
    this.stateChanger.next('bindSubProject');
  }
  // 打开添加构件对话框
  openAddSubDialog() {
    const dialogRef = this.dialog.open(AddSubDialogComponent, {
      width: '640px', data: {
        dbIds: this.groupBimModelIds, bimModelFileItem: this.selectedBimModel
      }
    });
    dialogRef.afterClosed().subscribe(v => {
      if (v) {
        this.refresh();
      }
    });
  }
  // 选择项目
  onOptionSelected(event: ProjectDto) {
    this.project = event;
    this.stateChanger.next('bindSubProject');
  }
  // 下载二维码
  downloadQrCodes() {
    this.stateChanger.states['downloadingQrCodesZip'] = true;
    this.snackBar.open('正在生成二维码，这可能需要几分钟的时间，在这期间您可以浏览其他页面', '知道了');
    this._subProjectService.getAllQrCodes(this.project ? this.project.id : undefined, this.procedure ? this.procedure.id : undefined,
      this.selectedBimModel ? this.selectedBimModel.id : undefined, this.searchControl.value, this.subProjectSelectedBimDbId,
      (this.pageNumber - 1) * this.pageSize, this.pageSize)
      .subscribe(() => {
        this._fileItemService.get(undefined, FileItemCategory.QrCodesZip);
        this.stateChanger.states['downloadingQrCodesZip'] = false;
      });
  }

  // 当BIM模型的某一个构件被点击时
  bimSelectionChange(dbId: number[]) {
    this.subProjectSelectedBimDbId = dbId.length ? dbId[0].toString() : '';
    this.refresh();
  }
  // 模型显示的类型即dbIdType变化的时候
  // dbIdTypeChange() {
  //   // 先清空选择再显示
  //   switch (this.dbIdType) {
  //     case null:
  //     case 0:
  //       this.bimViewer.showByDbIds();
  //       break;
  //     case 1:
  //       this.bimViewer.showByDbIds(this.subProjects.map(v => v.bimModelDbId));
  //       break;
  //   }
  // }
  // 构件的列表
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    if (this.project) {
      this._subProjectService.getAll(this.project.id, this.procedure ? this.procedure.id : undefined,
        this.selectedBimModel ? this.selectedBimModel.id : undefined, this.searchControl.value, this.subProjectSelectedBimDbId,
        request.skipCount, request.maxResultCount).pipe(
        finalize(() => finishedCallback())
      ).subscribe((result) => {
        this.subProjects = result.items;
        this.showPaging(result, pageNumber);
      });
    } else {
      finishedCallback();
    }
  }

  protected delete(dto: SubProjectDto): void {
    abp.message.confirm(`删除构件计划：${dto.code}？`, '永久构件这个构件排产计划', (result: boolean) => {
      if (result) {
        this._subProjectService.delete(dto.id).pipe(finalize(() => {
          this.snackBar.open('删除构件排产计划: ' + dto.code, '关闭', {duration: 2000});
          this.refresh();
        })).subscribe();
      }
    });
  }
}
