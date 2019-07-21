import {Component, Injector, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatBoxComponent} from '@app/layout/right-sidevar/chat-box/chat-box.component';
import {MessageSystemServiceProxy, RecentMessageLogDto, UserDto} from '@shared/service-proxies/service-proxies';
import Cookie from 'js-cookie';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {fadeIn} from '@shared/animations/data-animation';
import {toolbarAnimation} from '@shared/animations/toolbar-animation';
import {AbpEventNames} from '@shared/AppConsts';

/*右侧导航栏*/
@Component({
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['right-sidebar.component.css'],
  selector: 'app-right-sidebar',
  encapsulation: ViewEncapsulation.None,
  animations: [fadeIn, toolbarAnimation]
})
export class RightSideBarComponent extends PagedListingComponentBase<RecentMessageLogDto> implements OnInit {
  @ViewChild('modal') modal: ChatBoxComponent;
  // 项目人员
  users: UserDto[];
  // 最近消息列表
  recentMessages: RecentMessageLogDto[];
  // 是否连接到服务器
  isConnected = true;

  constructor(injector: Injector, route: ActivatedRoute, private _messageSystemService: MessageSystemServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    // 注册服务器连接状态改变事件
    abp.event.on(AbpEventNames.connectionStateChange, (state: boolean) => {
      this.isConnected = state;
    });
    // 注册了一个全局的右边栏打开事件
    abp.event.on(AbpEventNames.rightSideBarOpen, () => {
      const projectId = Cookie.get('project-autocomplete');
      if (projectId) {
        // 从服务器取项目人员信息的相应数据
        this._messageSystemService.getAllUserInProject(projectId).subscribe(result => this.users = result.items);
      } else {
        this.users = [];
      }
      // 获取最近聊天列表的数据
      this.refresh();
    });
  }
  // 刷新页面重新连接
  reloadPage() {
    location.reload();
  }

  // selectedPerson(theme): void {
  //   // this._router.navigateByUrl('/app/communication');
  //   const $sidebar = $('#rightsidebar');
  //   const $overlay = $('.overlay');
  //   $sidebar.removeClass('open');
  //   $overlay.fadeOut();
  //   this.modal.show(undefined);
  // }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    // 获取最近聊天
    this._messageSystemService.getAllRecentMessageUsers().subscribe(result => this.recentMessages = result.items);
  }

  // 删除一项最近聊天
  protected delete(entity: RecentMessageLogDto): void {
    this._messageSystemService.deleteRecentMessage(entity.id).subscribe(() => {
      this.recentMessages.splice(this.recentMessages.indexOf(entity), 1);
      this.stateChanger.next('messageNum');
    });
  }

}
