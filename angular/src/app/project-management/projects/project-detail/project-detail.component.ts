import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@node_modules/@angular/router';
import {finalize, switchMap} from '@node_modules/rxjs/operators';
import { ProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/components/app-component-base';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  animations: [appModuleAnimation()]
})
export class ProjectDetailComponent extends AppComponentBase implements OnInit {
  project: ProjectDto;
  saving = false;

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private _projectService: ProjectServiceProxy
) {
    super(injector);
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this._projectService.get(params.get('id')))
    ).subscribe((project: ProjectDto) => {
      this.project = project;
    });
  }

  getData(finishedCallback) {
    this._projectService.get(this.project.id).subscribe((project: ProjectDto) => {
      this.project = project;
      finishedCallback();
    });
  }

  save() {
    this.saving = true;
    this._projectService.update(this.project).pipe(finalize(() => { this.saving = false; })).subscribe((result) => {
      this.snackBar.open(this.l('保存成功'), '关闭', {duration: 2000});
      this.project = result;
    });

  }

  refresh() {
    location.reload();
  }
}
