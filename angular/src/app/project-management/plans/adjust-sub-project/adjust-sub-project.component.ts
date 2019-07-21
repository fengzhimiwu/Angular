import {Component, Injector, OnInit} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {
  AdjustEstimatedTimeInput,
  ProcedureDto,
  ProjectDto,
  SubProjectDto,
  SubProjectServiceProxy
} from '@shared/service-proxies/service-proxies';
import {finalize} from '@node_modules/rxjs/internal/operators';
import {Router} from '@node_modules/@angular/router';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {switchIn} from '@shared/animations/data-animation';

@Component({
  selector: 'app-adjust-sub-project',
  templateUrl: './adjust-sub-project.component.html',
  styleUrls: ['./adjust-sub-project.component.css'],
  animations: [appModuleAnimation(), switchIn]
})
export class AdjustSubProjectComponent extends PagedListingComponentBase<SubProjectDto> implements OnInit {
  project: ProjectDto;
  procedure: ProcedureDto;
  // 所有构件
  subProjects: SubProjectDto[];
  saving = false;
  // 延迟天数
  delayDays: number;
  // 受影响的构件数量
  effectedSubProject: number;

  constructor(
    injector: Injector,
    public router: Router,
    private _subProjectService: SubProjectServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  adjustSubProject() {
    this.saving = true;
    const input = new AdjustEstimatedTimeInput();
    input.projectId = this.project.id;
    input.procedureId = this.procedure.id;
    input.delayedDay = this.delayDays;
    this._subProjectService.adjustEstimatedFinishedTime(input).pipe(finalize(() => this.saving = false)).subscribe((result) => {
      this.subProjects = result.items;
    });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
  }

  protected delete(entity: SubProjectDto): void {
  }
}
