import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Injector, OnDestroy} from '@angular/core';
import {ModalDirective} from '@node_modules/ngx-bootstrap';
import {MessageLogDto, MessageSystemServiceProxy, UserDto} from '@shared/service-proxies/service-proxies';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {FileItemCategory} from '@shared/AppEnums';
import {switchIn} from '@shared/animations/data-animation';
import {FileTypeHelper} from '@shared/helpers/file-type.helper';
import {Router} from '@node_modules/@angular/router';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import { MessageLogInput } from '@shared/models/message-system';
import {AbpEventNames} from '@shared/AppConsts';

/*聊天信息弹窗/页面*/
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  animations: [switchIn]
})
export class ChatBoxComponent extends PagedListingComponentBase<MessageLogDto> implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalDirective;
  // 可滚动的dom元素
  @ViewChild('modalEle') modalEle: ElementRef;
  @Output() onClosed = new EventEmitter();
  // 所有消息
  messages: MessageLogDto[];
  // 接收者
  receiver: UserDto;
  // 是否显示通知
  isShowNotification = true;
  // 计数同步
  actionDoneCount = 2;

  constructor(
    injector: Injector,
    private _messageSystemService: MessageSystemServiceProxy,
    private _fileItemService: FileItemService,
    private router: Router,
  ) {
    super(injector);
  }

  /** 初始化读取消息、通知、右上角消息提醒等地方的初始化*/
  ngOnInit(): void {
    this.messages = [];
    // 整个系统加载后，获取未读消息个数
    this.stateChanger.next('messageNum');
    // 接收者聊天窗的操作
    abp.event.on(AbpEventNames.messageReceived, message => {
      // 当消息来的时候，刷新未读消息个数
      this.stateChanger.next('messageNum');
      if (this.isShowNotification) {
        // 如果聊天窗关闭
        Push.create('生产管理系统通知', {
          body: message.content,
          icon: abp.appPath + 'assets/app-logo-small.png',
          timeout: 600000,
          onClick: function () {
            window.focus();
            this.close();
          }
        });
      } else {
        // 如果聊天窗打开了
        if (message) {
          this.messages.push(message);
          // 滚动到底部
          this.scrollToBottom();
          // 告诉服务读取了消息
          abp.signalr.hubs.message.invoke('readMessage', {creatorUserId: this.appSession.userId, receiverUserId: this.receiver.id});
        }
      }
    });
  }

  ngOnDestroy(): void {
  }

  /** 当聊天被点击的时候会触发，显示对话框，做一些基础初始化操作*/
  public show(user: UserDto): void {
    // 传入用户，并显示第一页数据
    this.receiver = user;
    this.pageNumber = 1;
    this.getDataPage(this.pageNumber);
    // 关闭通知
    this.isShowNotification = false;
    this.modal.show();
  }

  /** 关闭聊天框 */
  closeModal() {
    this.modal.hide();
    this.isShowNotification = true;
    this.onClosed.emit();
  }

  /** 在输入框输入内容时会触发，主要用于调整UI*/
  inputText(event) {
    // 把高进行重置，才会减小输入框。最小值是20px
    $(event.target).height(20);
    // 增加高度
    $(event.target).height(event.target.scrollHeight - 10);
  }

  /** 上传文件方法*/
  changeFile(event) {
    const file: File = event.target.files[0];
    const formFile = new FormData();
    formFile.append('FormFile', file, file.name);
    formFile.append('FileItemCategory', FileItemCategory.Message.toString());
    // 调用服务器方法
    const subscription = this._fileItemService.create(formFile).subscribe((result: FileItem) => {
      this.sendMessage({value: result.id}, file);
    });
    this.subscriptions.push(subscription);
  }

  /** 发送消息*/
  sendMessage(inputBoxEl: HTMLTextAreaElement | { value: string }, file = undefined) {
    const content = inputBoxEl.value;
    // 判断是否加载完成
    if (!content || content.length < 1) {
      return;
    }
    const input = new MessageLogInput();
    input.creatorUserId = this.appSession.userId;
    input.content = content;
    input.receiverUserId = this.receiver.id;
    // 如果是文件
    if (file) {
      input.content = FileTypeHelper.isImg(file.type) ? '[图片]' : '[文件]';
      input.fileItemId = content;
    }
    // 发送消息过程，并触发通知
    abp.signalr.hubs.message.invoke('sendMessage', input).then(result => {
      // 发送者聊天窗的操作
      if (result) {
        this.messages.push(result);
        this.scrollToBottom();
        // 置空输入框
        inputBoxEl.value = '';
        // 如果是textarea发送的事件，则自动聚焦
        if (inputBoxEl instanceof HTMLTextAreaElement) {
          inputBoxEl.focus();
        }
        // 重置聊天框的高度
        this.inputText({target: inputBoxEl});
      }
    }).catch(error => abp.log.error(error));
  }

  /** TODO 上拉查看历史消息 */
  pullMessages() {
    this.getDataPage(++this.pageNumber);
  }

  /** 滑动到底部*/
  public scrollToBottom() {
    if (!this.actionDoneCount) {
      this.actionDoneCount -= 1;
      return;
    }
    $(this.modalEle.nativeElement).finish().animate({'scrollTop': this.modalEle.nativeElement.scrollHeight + 'px'}, 900);
  }

  /** 特殊的链接消息，点击可跳转*/
  gotoLinkUrlPage(m: MessageLogDto) {
    this.closeModal();
    // 分割?号进行判断消息类型
    const url = m.linkUrl.split('?');
    if (url.length > 1) {
      // 如果有?
      this.router.navigateByUrl(url[0] + ';backUrl=' + encodeURIComponent(this.router.url) + '?' + url[1]).then();
    } else {
      this.router.navigate([m.linkUrl, {backUrl: this.router.url}]).then();
    }
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    const subscription = this._messageSystemService.getAll(this.receiver.id, request.skipCount, request.maxResultCount)
      .subscribe(result => {
        // 服务器最新的消息在最前面，本地最新的消息在最后面
        this.messages.unshift(...result.items.reverse());
        // 点击聊天人员后刷新
        this.stateChanger.next('messageNum');
        finishedCallback();
      });
    this.subscriptions.push(subscription);
  }

  protected delete(entity: MessageLogDto): void {
  }
}
