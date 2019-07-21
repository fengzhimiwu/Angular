import {Component, Injector, ViewChild, ViewEncapsulation} from '@angular/core';
import {PagedResultDtoOfProjectDto, ProjectDto, ProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {finalize} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {EditProjectModalComponent} from '@app/project-management/projects/edit-project-modal/edit-project-modal.component';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {MatDialog} from '@node_modules/@angular/material';

@Component({
  selector: 'app-page-project-list',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [appModuleAnimation()],
})
export class ProjectsComponent extends PagedListingComponentBase<ProjectDto> {
  @ViewChild('projectModal') projectModal: EditProjectModalComponent;
  projects: ProjectDto[] = [];

  constructor(
    injector: Injector,
    private projectsService: ProjectServiceProxy,
    private dialog: MatDialog,
    private router: Router,
    route: ActivatedRoute
  ) {
    super(injector);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.projectsService.getAll(undefined, request.skipCount, request.maxResultCount).pipe(finalize(() => {
      finishedCallback();
    })).subscribe((result: PagedResultDtoOfProjectDto) => {
      this.projects = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  delete(project: ProjectDto): void {
    abp.message.confirm(`删除项目：${project.name}？`, '永久删除这个项目', (result: boolean) => {
      if (result) {
        // 打开加载dialog
        const dialogRef = this.openLoadingDialog(this.dialog);
        this.projectsService.delete(project.id).pipe(finalize(() => {
          this.snackBar.open('删除项目: ' + project.name, '关闭', {duration: 2000});
          this.refresh();
          // 关闭加载框
          dialogRef.close();
        })).subscribe();
      }
    });
  }
}
