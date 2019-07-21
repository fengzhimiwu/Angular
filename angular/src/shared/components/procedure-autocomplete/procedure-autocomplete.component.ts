import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@node_modules/@angular/forms';
import {Observable} from '@node_modules/rxjs';
import {ProcedureDto, ProcedureServiceProxy, ProjectDto} from '@shared/service-proxies/service-proxies';
import {debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap} from '@node_modules/rxjs/operators';
import {MatOption} from '@node_modules/@angular/material';

/*工序的搜索并选择组件*/
@Component({
  selector: 'app-procedure-autocomplete',
  templateUrl: './procedure-autocomplete.component.html',
  styleUrls: ['./procedure-autocomplete.component.css']
})
export class ProcedureAutocompleteComponent implements OnInit {
  @Output() onOptionSelected = new EventEmitter<ProcedureDto>();
  // procedure工序
  searchProcedureControl = new FormControl();
  filteredProcedureOptions: Observable<ProcedureDto[]>;

  constructor(
    private _procedureService: ProcedureServiceProxy
  ) {
  }

  ngOnInit() {
    // 添加管道处理数据
    this.filteredProcedureOptions = this.searchProcedureControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      distinctUntilChanged(),
      switchMap((key: string) => this._procedureService.getAllByName(key).pipe(finalize(() => {
        if (key == null || key.length < 1) {
          this.onOptionSelected.emit(new ProcedureDto());
        }
      }))), map(result => result.items)
    );
  }
  // 当下拉选项被选择时，触发事件
  optionSelected(event: MatOption) {
    this.onOptionSelected.emit(event.value);
    this.searchProcedureControl.setValue(event.viewValue);
  }

}
