import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {TaskItemAssignmentDto, TaskItemAssignmentServiceProxy} from '@shared/service-proxies/service-proxies';
import {AppSessionService} from '@shared/session/app-session.service';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {finalize} from '@node_modules/rxjs/operators';
import {switchIn} from '@shared/animations/data-animation';

@Component({
  selector: 'app-my-tasks-finished',
  templateUrl: './my-tasks-finished.component.html',
  styleUrls: ['./my-tasks-finished.component.css'],
  animations: [appModuleAnimation(), switchIn]
})
export class MyTasksFinishedComponent extends PagedListingComponentBase<TaskItemAssignmentDto> implements OnInit {
  taskItemAssignments: TaskItemAssignmentDto[];
  // moreTaskItemAssignments: TaskItemAssignmentDto[];

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

  // getMoreTaskAssignments(taskItemAssignmentDto: TaskItemAssignmentDto) {
  //   this._taskItemAssignmentService.getTasksBySubProjectIdAndTaskItemId(
  //     taskItemAssignmentDto.subProjectId, taskItemAssignmentDto.procedureStepTaskItemId
  //   ).subscribe((result) => {
  //     this.moreTaskItemAssignments = null;
  //     this.moreTaskItemAssignments = result.items;
  //   });
  // }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    // const id = this.route.snapshot.paramMap.get('id');
    this._taskItemAssignmentService.getAll(
      this.appSession.userId, true, request.skipCount, request.maxResultCount
    ).pipe(finalize(() => finishedCallback())).subscribe((result) => {
      this.taskItemAssignments = result.items;
      this.showPaging(result, pageNumber);
      // if (id) {
      //   this.getMoreTaskAssignments(this.taskItemAssignments.find((i) => i.id === id));
      // }
    });
  }

  protected delete(entity: TaskItemAssignmentDto): void {
  }

}
