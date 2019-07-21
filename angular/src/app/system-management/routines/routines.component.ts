import {Component, Injector, OnInit} from '@angular/core';
import {ProcedureStepDto, ProcedureStepServiceProxy} from '@shared/service-proxies/service-proxies';
import {MatDialog} from '@node_modules/@angular/material';
import {DeviceDialogComponent} from '@app/material-management/devices/device-dialog/device-dialog.component';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import { RoutineDialogComponent } from './routine-dialog/routine-dialog.component';
import {appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css'],
  animations: [appModuleAnimation()]
})
export class RoutinesComponent extends PagedListingComponentBase<ProcedureStepDto> implements OnInit {
  procedureSteps: ProcedureStepDto[];

  constructor(
    injector: Injector,
    private _procedureStepService: ProcedureStepServiceProxy,
    private dialog: MatDialog) {
    super(injector);
  }

  openDialog(p: string = null) {
    const dialogRef = this.dialog.open(RoutineDialogComponent, {width: '640px', data: p});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._procedureStepService.getAllRoutineCategory().subscribe(result => {
      this.procedureSteps = result.items;
      this.showPaging(result, pageNumber);
      finishedCallback();
    });
  }

  protected delete(procedureStep: ProcedureStepDto): void {
    abp.message.confirm('删除类别' + procedureStep.name + '?', (result: boolean) => {
      if (result) {
        this._procedureStepService.delete(procedureStep.id).subscribe(() => {
          this.snackBar.open('删除类别: ' + procedureStep.name, '关闭', {duration: 2000});
          this.refresh();
        });
      }
    });
  }
}
