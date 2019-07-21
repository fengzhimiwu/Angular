import {Component, Injector, ViewChild} from '@angular/core';
import {appModuleAnimation} from '../../../shared/animations/routerTransition';
import {UserServiceProxy, UserDto, PagedResultDtoOfUserDto} from '../../../shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/components/paged-listing-component-base';
import {CreateUserComponent} from 'app/system-management/users/create-user/create-user.component';
import {EditUserComponent} from 'app/system-management/users/edit-user/edit-user.component';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute} from '@node_modules/@angular/router';
import {MatDialog} from '@node_modules/@angular/material';
import {InvitationCodeDialogComponent} from '@app/system-management/users/invitation-code-dialog/invitation-code-dialog.component';
import {AppSessionService} from '@shared/session/app-session.service';

@Component({
  templateUrl: './users.component.html',
  animations: [appModuleAnimation()]
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {

  @ViewChild('createUserModal') createUserModal: CreateUserComponent;
  @ViewChild('editUserModal') editUserModal: EditUserComponent;

  active = false;
  users: UserDto[] = [];

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private matDialog: MatDialog,
    private _sessionService: AppSessionService
  ) {
    super(injector);
  }

  // Show Modals
  createUser(): void {
    this.createUserModal.show();
  }

  editUser(user: UserDto): void {
    this.editUserModal.show(user.id);
  }

  openInvitationCodeDialog() {
    this.matDialog.open(InvitationCodeDialogComponent, {width: '640px'});
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._userService.getAll(request.skipCount, request.maxResultCount)
      .pipe(finalize(() => finishedCallback()))
      .subscribe((result: PagedResultDtoOfUserDto) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(user: UserDto): void {
      if (this._sessionService.userId === user.id) {
          abp.message.warn('无法删除自己');
          return;
      }
      // abp.message.warn
    abp.message.confirm(
      '删除用户 \'' + user.fullName + '\'?',
      (result: boolean) => {
        if (result) {
          this._userService.delete(user.id)
            .subscribe(() => {
              this.snackBar.open('删除用户: ' + user.fullName, '关闭', {duration: 2000});
              this.refresh();
            });
        }
      }
    );
  }
}
