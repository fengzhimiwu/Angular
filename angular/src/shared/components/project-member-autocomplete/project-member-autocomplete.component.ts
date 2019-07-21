import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@node_modules/@angular/forms';
import {ProjectDto, TaskItemAssignmentServiceProxy, UserDto} from '@shared/service-proxies/service-proxies';
import {debounceTime, distinctUntilChanged, finalize, map, skip, startWith, switchMap} from '@node_modules/rxjs/operators';
import {MatOption} from '@node_modules/@angular/material';
import {Observable} from '@node_modules/rxjs';

/*任务执行人员，或选择转发人员的搜索并选择组件*/
@Component({
  selector: 'app-project-member-autocomplete',
  templateUrl: './project-member-autocomplete.component.html',
  styleUrls: ['./project-member-autocomplete.component.css']
})
export class ProjectMemberAutocompleteComponent implements OnInit {
  @Output() onOptionSelected = new EventEmitter<UserDto>();
  @Input() project: ProjectDto;
  // 搜索控件
  searchControl: FormControl;
  options: Observable<UserDto[]>;

  constructor(private _taskItemAssignmentService: TaskItemAssignmentServiceProxy) { }

  ngOnInit() {
    this.searchControl = new FormControl();
    // 通过pipe定义如何处理数据
    this.options = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      distinctUntilChanged(),
      switchMap((key: string) => this._taskItemAssignmentService.getUsersFromProject(undefined, this.project.id, key, key)
        .pipe(finalize(() => {
        // 为空发送null
        if (key == null || key.length < 1) {
          this.onOptionSelected.emit(undefined);
        }
      }))), map((result) => result.items)
    );
  }
  // 当从下拉框选择一个用户后
  optionSelected(event: MatOption) {
    this.onOptionSelected.emit(event.value);
    this.searchControl.setValue(event.value.name);
    // console.log(event.value);
  }
}
