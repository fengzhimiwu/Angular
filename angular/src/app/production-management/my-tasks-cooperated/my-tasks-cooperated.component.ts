import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {TaskItemAssignmentDto, TaskItemAssignmentServiceProxy} from '@shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {fadeIn} from '@shared/animations/data-animation';
import {finalize} from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-my-tasks-cooperated',
  templateUrl: './my-tasks-cooperated.component.html',
  styleUrls: ['../my-tasks/my-tasks.component.css'],
  animations: [fadeIn]
})
export class MyTasksCooperatedComponent extends PagedListingComponentBase<TaskItemAssignmentDto> implements OnInit {
  taskItemAssignments: TaskItemAssignmentDto[];
  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private router: Router,
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  gotoSubProjectInfo(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  gotoDetail(id: string) {
    this.router.navigate(['../my-task/', id, {readonly: 1, backUrl: this.router.url}], {relativeTo: this.route}).then();
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._taskItemAssignmentService.getTasksCooperated(
      this.appSession.userId, false, request.skipCount, request.maxResultCount
    ).pipe(finalize(() => finishedCallback())).subscribe((result) => {
      this.taskItemAssignments = result.items;
    });
  }

  protected delete(entity: TaskItemAssignmentDto): void {
  }
}
