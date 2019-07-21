import {Component, Injector, OnInit} from '@angular/core';
import {
  PagedResultDtoOfProcedureDto,
  PagedResultDtoOfTaskItemDto,
  ProcedureDto,
  ProcedureServiceProxy,
  TaskItemDto,
  TaskItemServiceProxy
} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {finalize} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
  selector: 'app-task-items',
  templateUrl: './task-items.component.html',
  styleUrls: ['./task-items.component.css'],
  animations: [appModuleAnimation()]
})
export class TaskItemsComponent extends PagedListingComponentBase<TaskItemDto> {
  taskItems: TaskItemDto[] = [];

  constructor(
    injector: Injector,
    private taskItemsService: TaskItemServiceProxy,
    private procedureService: ProcedureServiceProxy,
    private router: Router,
    route: ActivatedRoute
  ) {
    super(injector);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.taskItemsService.getAll(request.skipCount, request.maxResultCount).pipe(finalize(() => {
      finishedCallback();
    })).subscribe((result: PagedResultDtoOfTaskItemDto) => {
      this.taskItems = result.items;
      this.showPaging(result, pageNumber);
    });
    // this.procedureService.getAll(0, 0).subscribe((v: PagedResultDtoOfProcedureDto) => {
    //   const pro = new ProcedureDto();
    //   pro.name = '全部工序';
    //   this.procedures = [pro, ...v.items];
    // });
  }

  delete(taskItem: TaskItemDto): void {
    abp.message.confirm(
      `删除工作项：${taskItem.name}？`,
      '永久删除这个工作项',
      (result: boolean) => {
        if (result) {
          this.taskItemsService.delete(taskItem.id)
            .pipe(finalize(() => {
              this.snackBar.open('删除工作项: ' + taskItem.name, '关闭', {duration: 2000});
              this.refresh();
            }))
            .subscribe(() => {
            });
        }
      }
    );
  }
}
