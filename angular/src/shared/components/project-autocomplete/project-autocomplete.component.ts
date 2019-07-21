import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@node_modules/@angular/forms';
import {Observable} from '@node_modules/rxjs';
import {ProjectDto, ProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import {debounceTime, distinctUntilChanged, finalize, map, skip, skipWhile, startWith, switchMap, tap} from '@node_modules/rxjs/operators';
import {MatOption} from '@node_modules/@angular/material';
import Cookie from 'js-cookie';
import {AppSessionService} from '@shared/session/app-session.service';

/*项目的搜索并选择组件*/
@Component({
  selector: 'app-project-autocomplete',
  templateUrl: './project-autocomplete.component.html',
  styleUrls: ['./project-autocomplete.component.css']
})
export class ProjectAutocompleteComponent implements OnInit {
  @Output() onOptionSelected: EventEmitter<ProjectDto> = new EventEmitter<ProjectDto>();
  // project项目
  searchProjectControl: FormControl;
  projectGroup: { name: string, projects: ProjectDto[] }[];

  constructor(
    private _projectService: ProjectServiceProxy,
    private _sessionService: AppSessionService,
  ) {
  }

  ngOnInit() {
    this.searchProjectControl = new FormControl();
    const projectId = Cookie.get('project-autocomplete');
    // 初始化项目下拉框信息
    if (projectId) {
      this._projectService.get(projectId).subscribe((result) => {
        this.searchProjectControl.setValue(result.name);
        this.initSearchControl();
        this.onOptionSelected.emit(result);
      }, () => {
        // 出错则删除cookie
        Cookie.remove('project-autocomplete');
        this.initSearchControl();
      });
    } else {
      this.initSearchControl();
    }
  }
  // 初始化search控件
  initSearchControl() {
    // this.searchProjectTerm
    this.searchProjectControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      distinctUntilChanged(),
      switchMap((key: string) => this._projectService.getAllByName(key).pipe(finalize(() => {
        // 为空发送null
        if (!this.searchProjectControl.value || this.searchProjectControl.value.length < 1) {
          this.onOptionSelected.emit(undefined);
          Cookie.remove('project-autocomplete');
        }
      }))),
    ).subscribe((result) => {
      this.projectGroup = [];
      // 分组，如果租户信息相同则是公司项目，否则是参与项目
      let projects = result.items.filter((v) => v.tenantId === this._sessionService.tenantId);
      if (projects && projects.length > 0) {
        this.projectGroup.push({name: '公司项目', projects: projects});
      }
      projects = result.items.filter((v) => v.tenantId !== this._sessionService.tenantId);
      if (projects && projects.length > 0) {
        this.projectGroup.push({name: '参与项目', projects: projects});
      }
    });
  }
  // 当下拉框被选择时
  optionSelected(event: MatOption) {
    this.onOptionSelected.emit(event.value);
    this.searchProjectControl.setValue(event.viewValue);
    // 设置cookie供下次使用
    Cookie.set('project-autocomplete', event.value.id);
  }
  // 清空输入框和cookie信息
  clearBox() {
    this.searchProjectControl.setValue('');
    Cookie.remove('project-autocomplete');
  }
}
