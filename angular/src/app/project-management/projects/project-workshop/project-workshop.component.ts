import {Component, Injector, OnInit} from '@angular/core';
import {
  PagedResultDtoOfWorkshopLayoutDto, ProjectDto,
  ProjectServiceProxy,
  WorkshopLayoutDto,
  WorkshopLayoutServiceProxy,
  PedestalServiceProxy,
  PedestalInput
} from '@shared/service-proxies/service-proxies';
import {finalize} from '@node_modules/rxjs/operators';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {MatDialog} from '@node_modules/@angular/material';
import {LoadingDialogComponent} from '@shared/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-project-workshop',
  templateUrl: './project-workshop.component.html',
  styleUrls: ['./project-workshop.component.css'],
  animations: [appModuleAnimation()]
})
export class ProjectWorkshopComponent extends PagedListingComponentBase<WorkshopLayoutDto> {
  project: ProjectDto = new ProjectDto();
  layoutItems: WorkshopLayoutDto[];

  constructor(
    private _workshopLayoutService: WorkshopLayoutServiceProxy,
    private _projectService: ProjectServiceProxy,
    private _pedestalAppService: PedestalServiceProxy,
    injector: Injector,
    private dialog: MatDialog,
  ) {
    super(injector);
  }

  changeLayout(item: WorkshopLayoutDto) {
    if (this.project.layoutId === item.id) {
      return;
    } else if (this.project.id) {
      const dialogRef = this.openLoadingDialog(this.dialog);
      const input = new PedestalInput({layoutId: item.id, projectId: this.project.id});
      this._pedestalAppService.createByLayoutAndProject(input).pipe(finalize(() => dialogRef.close())).subscribe(() => {
        this.project.layoutId = item.id;
        this._projectService.update(this.project).subscribe(() => {
          this.snackBar.open('选择新布局成功！', '关闭', {duration: 2000});
        });
      });
    } else {
      abp.message.warn('请选择要更改的项目后，再操作');
    }
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._workshopLayoutService.getAll(0, 100).pipe(finalize(() => {
      finishedCallback();
    })).subscribe((result: PagedResultDtoOfWorkshopLayoutDto) => {
      this.layoutItems = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: WorkshopLayoutDto): void {
  }
}
