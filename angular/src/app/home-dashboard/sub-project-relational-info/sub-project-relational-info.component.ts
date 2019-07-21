import {Component, Injector, OnInit} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {
  GetAllSubProjectStageLogOutput,
  SubProjectStageLogDto,
  SubProjectStageLogServiceProxy
} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {finalize, switchMap} from '@node_modules/rxjs/operators';
import {switchIn} from '@shared/animations/data-animation';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {MatDialog} from '@node_modules/@angular/material';
import {FileItemCategory} from '@shared/AppEnums';
import {WorkshopDisplayDialogComponent} from '@shared/components/workshop-display/workshop-display-dialog.component';

@Component({
  selector: 'app-sub-project-relational-info',
  templateUrl: './sub-project-relational-info.component.html',
  styleUrls: ['./sub-project-relational-info.component.css'],
  animations: [switchIn, appModuleAnimation()]
})
export class SubProjectRelationalInfoComponent extends PagedListingComponentBase<SubProjectStageLogDto> implements OnInit {
  // 包含子项目信息、当前工序工作项完成情况、状态改变记录、总工序进度
  output: GetAllSubProjectStageLogOutput;
  backUrl: string;
  FileItemCategory = FileItemCategory;

  constructor(
    injector: Injector,
    private router: Router,
    private _subProjectStageLogService: SubProjectStageLogServiceProxy,
    public _fileItem: FileItemService,
    private dialog: MatDialog,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    super.ngOnInit();
  }

  // openTaskItemDialog() {
  //   const dialogRef = this.dialog.open(TaskItemInfoDialogComponent, {width: '640px', data: {taskItem: this.output.taskItemStatuses}});
  //   dialogRef.afterClosed().subscribe();
  // }
  // 查看工作台位置
  openWorkshopDialog(event, id: string) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(WorkshopDisplayDialogComponent, {width: '960px', data: {subProjectId: id}});
  }

  // 返回到上一个页面
  backPreviousPage(backUrl: string) {
    if (!backUrl) {
      backUrl = '/';
    }
    this.router.navigateByUrl(backUrl).then();
  }
  getCurrentPriority() {
    let priority = 0;
    if (this.output.subProject.stageCode) {
      priority = +this.output.subProject.stageCode.split('-')[0];
    }
    return priority;
  }

  downloadQrCodeInfo() {
    // this._fileItem.get(output.subProject.id, FileItemCategory.QrCode);
    const html2canvas = require('html2canvas');
    const printDom = document.getElementById('view');
    html2canvas(printDom, { height: printDom.scrollHeight }).then((canvas) => {
      const image = canvas.toDataURL('image/jpeg');
      const oA = document.createElement('a');
      oA.download = ''; // 设置下载的文件名，默认是'下载'
      oA.href = image;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
    });
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.route.queryParamMap.pipe(switchMap((params) =>
      this._subProjectStageLogService.getAll(params.get('id'), request.skipCount, request.maxResultCount)
        .pipe(finalize(() => finishedCallback()))
    )).subscribe(result => this.output = result);
    this.route.paramMap.subscribe((param) => {
      this.backUrl = param.get('backUrl');
    });
  }

  protected delete(entity: SubProjectStageLogDto): void {
  }
}
