import {Component, Injector, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/components/paged-listing-component-base';
import {RoleServiceProxy, RoleDto, PagedResultDtoOfRoleDto} from 'shared/service-proxies/service-proxies';
import {appModuleAnimation} from '../../../shared/animations/routerTransition';
import {CreateRoleComponent} from 'app/system-management/roles/create-role/create-role.component';
import {EditRoleComponent} from 'app/system-management/roles/edit-role/edit-role.component';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute} from '@node_modules/@angular/router';

@Component({
  templateUrl: './roles.component.html',
  animations: [appModuleAnimation()]
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {

  @ViewChild('createRoleModal') createRoleModal: CreateRoleComponent;
  @ViewChild('editRoleModal') editRoleModal: EditRoleComponent;

  roles: RoleDto[] = [];

  constructor(
    injector: Injector,
    private rolesService: RoleServiceProxy,
    route: ActivatedRoute
  ) {
    super(injector);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.rolesService.getAll(request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfRoleDto) => {

        this.roles = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(role: RoleDto): void {
      if (role.name === 'Admin') {
          abp.message.warn('admin角色无法被删除');
          return ;
      }
    abp.message.confirm(
      '删除角色 \'' + role.displayName + '\' 及用户所拥有的此角色吗?',
      '永久删除此角色',
      (result: boolean) => {
        if (result) {
          this.rolesService.delete(role.id)
            .pipe(finalize(() => {
              this.snackBar.open('删除角色: ' + role.displayName, '关闭', {duration: 2000});
              this.refresh();
            }))
            .subscribe(() => {
            });
        }
      }
    );
  }

  // Show Modals
  createRole(): void {
    this.createRoleModal.show();
  }

  editRole(role: RoleDto): void {
      // @ts-ignore
      // @ts-ignore
      // this.roles[0].displayName = role.name;
    this.editRoleModal.show(role.id);
  }
}
