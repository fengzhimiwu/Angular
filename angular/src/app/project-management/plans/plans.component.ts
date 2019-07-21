
import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {
  PagedResultDtoOfSubProjectDto,
  ProcedureDto,
  ProjectDto,
  SubProjectDto,
  SubProjectServiceProxy
} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {debounceTime, distinctUntilChanged, finalize} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {switchIn} from '@shared/animations/data-animation';
import {AddPlanModalComponent} from '@app/project-management/plans/add-plan-modal/add-plan-modal.component';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {FormControl} from '@node_modules/@angular/forms';
import {FileItemCategory} from '@shared/AppEnums';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
  animations: [appModuleAnimation(), switchIn]
})
export class PlansComponent extends PagedListingComponentBase<SubProjectDto> implements OnInit, OnDestroy {
  @ViewChild('addPlanModal') addPlanModal: AddPlanModalComponent;
  project: ProjectDto;
  procedure: ProcedureDto;
  subProjects: SubProjectDto[];
  searchControl = new FormControl('');

  constructor(
    injector: Injector,
    private router: Router,
    private _subProjectService: SubProjectServiceProxy,
    public _fileItemService: FileItemService,
  ) {
    super(injector);
    this.stateChanger.init('projectPlan', 2, () => this.refresh());
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.refresh());
    this.stateChanger.next('projectPlan');
  }
  ngOnDestroy(): void {
    this.stateChanger.destroy('projectPlan');
  }
  // 二维码下载
  downloadQrCodes() {
    this.stateChanger.states['downloadingQrCodesZip'] = true;
    this.snackBar.open('正在生成二维码，这可能需要几分钟的时间，在这期间您可以浏览其他页面', '知道了');
    this._subProjectService.getAllQrCodes(
      this.project ? this.project.id : undefined, this.procedure ? this.procedure.id : undefined,
      undefined, this.searchControl.value, undefined,
      (this.pageNumber - 1) * this.pageSize, this.pageSize)
      .subscribe(() => {
        this._fileItemService.get(undefined, FileItemCategory.QrCodesZip);
        this.stateChanger.states['downloadingQrCodesZip'] = false;
      });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.subProjects = null;
    if (this.project) {
      this._subProjectService.getAll(this.project.id, this.procedure ? this.procedure.id : undefined,
        undefined, this.searchControl.value, undefined,
        request.skipCount, request.maxResultCount).pipe(
        finalize(() => finishedCallback())
      ).subscribe((result: PagedResultDtoOfSubProjectDto) => {
        this.subProjects = result.items;
        this.showPaging(result, pageNumber);
      });
    }
  }

  protected delete(dto: SubProjectDto): void {
    abp.message.confirm(`删除构件排产计划：${dto.code}？`, '永久构件这个梁片排产计划', (result: boolean) => {
      if (result) {
        this._subProjectService.delete(dto.id).pipe(finalize(() => {
          this.snackBar.open('删除构件排产计划: ' + dto.code, '关闭', {duration: 2000});
          this.refresh();
        })).subscribe();
      }
    });
  }
}
