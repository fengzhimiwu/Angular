import {Component, Injector, OnInit} from '@angular/core';
import {TaskItemAssignmentDto, TaskItemAssignmentServiceProxy} from '@shared/service-proxies/service-proxies';
import {Router} from '@node_modules/@angular/router';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {finalize} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {switchIn} from '@shared/animations/data-animation';

@Component({
  selector: 'app-my-tasks-published',
  templateUrl: './my-tasks-published.component.html',
  styleUrls: ['./my-tasks-published.component.css'],
  animations: [appModuleAnimation(), switchIn]
})
export class MyTasksPublishedComponent extends PagedListingComponentBase<TaskItemAssignmentDto> implements OnInit {
  taskItemAssignments: TaskItemAssignmentDto[];

  constructor(
    injector: Injector,
    private router: Router,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._taskItemAssignmentService.getTaskPublished(
      this.appSession.userId, true, request.skipCount, request.maxResultCount
    ).pipe(finalize(() => finishedCallback())).subscribe((result) => {
      this.taskItemAssignments = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: TaskItemAssignmentDto): void {
  }


}
