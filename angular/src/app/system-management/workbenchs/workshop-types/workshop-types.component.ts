import { Component, OnInit, Injector } from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import { WorkshopTypeDto, WorkshopTypeServiceProxy, PagedResultDtoOfWorkshopTypeDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-workshop-types',
  templateUrl: './workshop-types.component.html',
  styleUrls: ['./workshop-types.component.css'],
  animations: [appModuleAnimation()]
})
export class WorkshopTypesComponent extends PagedListingComponentBase<WorkshopTypeDto> {

  workshopTypes: WorkshopTypeDto[] = [];

  constructor(
    injector: Injector,
    private workshopTypeService: WorkshopTypeServiceProxy,
    private router: Router,
    route: ActivatedRoute
  ) {
    super(injector);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.workshopTypeService.getAll(null)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfWorkshopTypeDto) => {
        this.workshopTypes = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(workshopType: WorkshopTypeDto): void {
    abp.message.confirm(
      `删除类型：${workshopType.name}？`,
      '永久删除这个类型',
      (result: boolean) => {
        if (result) {
          this.workshopTypeService.delete(workshopType.id)
            .pipe(finalize(() => {
              this.snackBar.open('删除工序模板: ' + workshopType.name, '关闭', {duration: 2000});
              this.refresh();
            }))
            .subscribe(() => {
            });
        }
      }
    );
  }

}
