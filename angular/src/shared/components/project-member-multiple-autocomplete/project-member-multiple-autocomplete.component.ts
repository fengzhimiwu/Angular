import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@node_modules/@angular/material';
import {COMMA, ENTER} from '@node_modules/@angular/cdk/keycodes';
import {FormControl} from '@node_modules/@angular/forms';
import {Observable} from '@node_modules/rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from '@node_modules/rxjs/operators';
import {ProjectDto, TaskItemAssignmentServiceProxy, UserDto,} from '@shared/service-proxies/service-proxies';

/*任务合作人员搜索并选择组件*/
@Component({
  selector: 'app-project-member-multiple-selection',
  templateUrl: './project-member-multiple-autocomplete.component.html',
  styleUrls: ['./project-member-multiple-autocomplete.component.css']
})
export class ProjectMemberMultipleAutocompleteComponent implements OnChanges {
  @Input() project: ProjectDto;
  // 所选择的用户们的id
  @Input() usersId: number[];
  @Output() usersIdChange = new EventEmitter<number[]>();
  users: UserDto[] = [];
  options: Observable<UserDto[]>;
  // 定义了哪些按键会触发添加chip操作
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchCtrl = new FormControl();

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private _taskItemAssignmentService: TaskItemAssignmentServiceProxy
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // 如果project信息可用，则初始化搜索控件
    if (changes['project'].currentValue) {
      this.options = this.searchCtrl.valueChanges.pipe(
        debounceTime(500),
        startWith(null, ''),
        distinctUntilChanged(),
        switchMap((key: string) =>
          this._taskItemAssignmentService.getUsersFromProject(undefined, this.project.id, key, key)),
        map(result => result.items.filter(v => this.usersId.indexOf(v.id) === -1))
      );
    }
  }
  // 当chips的x被点击的时候移出
  remove(fruit: number): void {
    const index = this.usersId.indexOf(fruit);

    if (index >= 0) {
      this.usersId.splice(index, 1);
      this.users.splice(index, 1);
    }
  }
  // 当使用tab回车时添加chip
  selected(event: MatAutocompleteSelectedEvent, fruitInput: HTMLInputElement): void {
    this.usersId.push(event.option.value.id);
    this.users.push(event.option.value);
    fruitInput.value = '';
    this.searchCtrl.setValue(null);
  }
}
