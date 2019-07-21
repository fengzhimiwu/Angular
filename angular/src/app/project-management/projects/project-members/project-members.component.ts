import {AfterViewInit, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {
  CreateProjectMemberInput, PagedResultDtoOfProjectMemberDto,
  ProjectDto,
  ProjectMemberDto,
  ProjectMemberServiceProxy,
  ProjectServiceProxy,
  TenantDto, UserDto
} from '@shared/service-proxies/service-proxies';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';
import {debounceTime, distinctUntilChanged, finalize} from '@node_modules/rxjs/operators';
import {FormControl} from '@node_modules/@angular/forms';

@Component({
  selector: 'app-project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.css'],
  animations: [appModuleAnimation()]
})
export class ProjectMembersComponent extends PagedListingComponentBase<ProjectMemberDto> implements OnInit, AfterViewInit, OnDestroy {
  // 避免请求1次无用网络请求
  project: ProjectDto;
  projectMembers: PagedResultDtoOfProjectMemberDto;
  searchControl: FormControl;

  constructor(
    injector: Injector,
    private _projectMemberService: ProjectMemberServiceProxy,
  ) {
    super(injector);
    // 初始化一个同步器
    this.stateChanger.init('projectMember', 1, () => this.refresh());
  }
  ngOnInit(): void {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.refresh());
  }
  // ui加载完毕，同步一次
  ngAfterViewInit(): void {
    this.stateChanger.next('projectMember');
  }
  ngOnDestroy(): void {
    this.stateChanger.destroy('projectMember');
  }

  addMember(checked: boolean, checkbox, member: ProjectMemberDto) {
    if (!checked) {
      this._projectMemberService.delete(member.id).subscribe(() => {
        this.snackBar.open(`删除成员${member.user.name}成功`, '关闭', {duration: 2000});
        member.project = null;
        member.id = null;
      });
    } else if (!this.project) {
      abp.message.warn('请选择项目后操作');
      checkbox.toggle();
    } else if (checked && this.project.id) {
      const newOne = new CreateProjectMemberInput({
        tenantId: member.tenant ? member.tenant.id : undefined, projectId: this.project.id, userId: member.user.id});
      this._projectMemberService.create(newOne).subscribe((result) => {
        this.snackBar.open('添加' + member.user.name + '成功', '关闭', {duration: 2000});
        member.project = this.project;
        member.id = result.id;
      });
    }
  }
  // 获取租户内部的人员
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._projectMemberService.getAll(this.project ? this.project.id : undefined, this.searchControl.value,
      request.skipCount, request.maxResultCount).pipe(finalize(() => finishedCallback())).subscribe(result => {
      this.projectMembers = result;
      // 显示页码
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: ProjectMemberDto): void {

  }
}
