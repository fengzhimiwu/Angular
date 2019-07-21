import {Component, Injector, ViewChild} from '@angular/core';
import {
  PagedResultDtoOfProcedureStepDto,
  ProcedureDto, ProcedureServiceProxy,
  ProcedureStepDto,
  ProcedureStepServiceProxy
} from '@shared/service-proxies/service-proxies';
import {ParamMap} from '@node_modules/@angular/router';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {finalize, switchMap} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {ProcedureStepModalComponent
} from '@app/system-management/procedures/procedure-steps/procedure-step-modal/procedure-step-modal.component';

@Component({
  selector: 'app-procedure-steps',
  templateUrl: './procedure-steps.component.html',
  styleUrls: ['./procedure-steps.component.css'],
  animations: [appModuleAnimation()]
})
export class ProcedureStepsComponent extends PagedListingComponentBase<ProcedureStepDto> {
  @ViewChild('editModal') editModal: ProcedureStepModalComponent;
  procedureSteps: ProcedureStepDto[] = [];
  procedure: ProcedureDto;

  constructor(
    injector: Injector,
    private procedureStepsService: ProcedureStepServiceProxy,
    private procedureService: ProcedureServiceProxy,
  ) {
    super(injector);
  }

  showModal(id: string, isCreate: boolean) {
    let priority = 0;
    this.procedureSteps.forEach(value => {
      if (value.priority > priority) {
        priority = value.priority;
      }
    });
    priority += 1;
    this.editModal.show(id, isCreate, priority);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.route.paramMap.pipe(switchMap((p: ParamMap) => this.procedureService.get(p.get('id')))).subscribe(result => {
      this.procedure = result;
      this.procedureStepsService.getAll(result.id).pipe(finalize(() => {
        finishedCallback();
      })).subscribe((subResult: PagedResultDtoOfProcedureStepDto) => {
        this.procedureSteps = subResult.items;
        this.showPaging(subResult, pageNumber);
      });
    });
  }

  delete(procedureStep: ProcedureStepDto): void {
    abp.message.confirm(`删除项目：${procedureStep.name}？`, '永久删除这个项目', (result: boolean) => {
        if (result) {
          this.procedureStepsService.delete(procedureStep.id).subscribe(() => {
            this.refresh();
            this.snackBar.open('删除工序: ' + procedureStep.name, '关闭', {duration: 2000});
          });
        }
      }
    );
  }

}
