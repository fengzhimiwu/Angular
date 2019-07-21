import {Component, Injector, OnInit} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {SessionServiceProxy, TaskItemAssignmentDto, TaskItemAssignmentServiceProxy} from '@shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {fadeIn} from '@shared/animations/data-animation';
import {RouteNames} from '@shared/AppConsts';
import {finalize} from '@node_modules/rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css'],
  animations: [appModuleAnimation(), fadeIn]
})
export class MyTasksComponent extends PagedListingComponentBase<TaskItemAssignmentDto> implements OnInit {
  RouteNames = RouteNames;
  taskItemAssignments: TaskItemAssignmentDto[];
  constructor(
    // html 页面用到了router.url
    public router: Router,
    injector: Injector,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }
  // 获取任务列表
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._taskItemAssignmentService.getAll(
      this.appSession.userId, false, request.skipCount, request.maxResultCount
    ).pipe(finalize(() => finishedCallback())).subscribe((result) => {
      this.taskItemAssignments = result.items;
    });
  }

  protected delete(entity: TaskItemAssignmentDto): void {
  }
}
