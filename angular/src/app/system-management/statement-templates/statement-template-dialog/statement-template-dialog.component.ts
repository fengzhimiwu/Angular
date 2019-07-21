import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {
  CreateStatementDataRefInput, ProcedureDto, ProcedureStepDto, ProcedureStepTaskItemDto,
  StatementDataRefDto,
  StatementDataRefServiceProxy,
} from '@shared/service-proxies/service-proxies';
import {FileItem} from '@shared/service-proxies/file-item.service';
import {AppComponentBase} from '@shared/components/app-component-base';

@Component({
  selector: 'app-statement-template-dialog',
  templateUrl: './statement-template-dialog.component.html',
  styleUrls: ['./statement-template-dialog.component.css']
})
export class StatementTemplateDialogComponent extends AppComponentBase implements OnInit {
  procedures: ProcedureDto[];
  procedureSteps: ProcedureStepDto[];
  selectedProcedureStep: ProcedureStepDto;
  unBindings: ProcedureStepTaskItemDto[];
  bindings: StatementDataRefDto[];

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<StatementTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileItem,
    private _statementDataRefService: StatementDataRefServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    // this.searchTerms.pipe(
    //   debounceTime(500), // ignore new term if same as previous term
    //   distinctUntilChanged(),
    //   switchMap((key: string) => this.statementDataRefService.getAllTaskItem(key))
    // ).subscribe(unBindings => {
    //   this.unBindings = unBindings.items;
    // });
    // 取得绑定的工作项
    this._statementDataRefService.getAllBindings(this.data.id).subscribe(items => {
      this.bindings = items.items;
    });
    // 获取工序模板
    this._statementDataRefService.getAllProcedures().subscribe(result => this.procedures = result.items);
  }

  // 获取工序
  selectProcedure(p: ProcedureDto) {
    this._statementDataRefService.getAllProcedureSteps(p.id).subscribe(result => this.procedureSteps = result.items);
  }

  // 获取pts
  selectProcedureStep(ps: ProcedureStepDto) {
    this.selectedProcedureStep = ps;
    this._statementDataRefService.getAllPts(ps.id).subscribe(result => {
      this.unBindings = result.items.filter(value => this.bindings.every(value1 => value1.procedureStepTaskItemId !== value.id));
    });
  }

  // 绑定工作项
  bindTaskItem(pt: ProcedureStepTaskItemDto) {
    const bindInput = new CreateStatementDataRefInput({fileItemId: this.data.id, procedureStepTaskItemId: pt.id});
    this._statementDataRefService.create(bindInput).subscribe((result) => {
      this.snackBar.open(pt.taskItem.name + '绑定成功', '关闭', {duration: 2000});
      this.bindings.push(result);
      this.unBindings.splice(this.unBindings.indexOf(pt), 1);
    });
  }

  // 解绑工作项
  unBindTaskItem(sd: StatementDataRefDto) {
    // 选择了工序后才能进行操作
    if (this.selectedProcedureStep) {
      this._statementDataRefService.delete(sd.id).subscribe(() => {
        this.snackBar.open('解绑成功', '关闭', {duration: 2000});
        this.bindings.splice(this.bindings.indexOf(sd), 1);
        // 如果是同一工序的工作项，则会添加回去
        if (sd.procedureStepTaskItem.procedureStepId === this.selectedProcedureStep.id) {
          this.unBindings.push(sd.procedureStepTaskItem);
        }
      });
    }
  }
}
