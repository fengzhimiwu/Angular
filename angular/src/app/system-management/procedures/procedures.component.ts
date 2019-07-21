import {Component, Injector, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {PagedResultDtoOfProcedureDto, ProcedureDto, ProcedureServiceProxy} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {finalize} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {ModalDirective} from '@node_modules/ngx-bootstrap';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.css'],
  animations: [appModuleAnimation()]
})
export class ProceduresComponent extends PagedListingComponentBase<ProcedureDto> {
  // @ViewChild('editModal') editModal: ModalDirective;
  procedures: ProcedureDto[] = [];

  constructor(
    injector: Injector,
    private _procedureService: ProcedureServiceProxy,
    private router: Router,
    route: ActivatedRoute
  ) {
    super(injector);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._procedureService.getAll(request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfProcedureDto) => {
        this.procedures = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(procedure: ProcedureDto): void {
    abp.message.confirm(
      `删除项目：${procedure.name}？`,
      '永久删除这个项目',
      (result: boolean) => {
        if (result) {
          this._procedureService.delete(procedure.id)
            .pipe(finalize(() => {
              this.snackBar.open('删除工序模板: ' + procedure.name, '关闭', {duration: 2000});
              this.refresh();
            }))
            .subscribe(() => {
            });
        }
      }
    );
  }

}
