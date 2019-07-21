import {AfterViewInit, ApplicationRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {UserDto, UserLoginInfoDto} from '@shared/service-proxies/service-proxies';
import {FileItemService} from '@shared/service-proxies/file-item.service';

/*用户头像的组件，传入的是user信息*/
@Component({
  selector: 'app-user-head-viewer',
  templateUrl: './user-head-viewer.component.html',
  styleUrls: ['./user-head-viewer.component.css']
})
export class UserHeadViewerComponent implements OnInit, AfterViewInit {
  @Input() user: UserDto | UserLoginInfoDto;
  @Input() size: 'middle'|'middle-small'|'small'|'large' = 'middle';
  // @ViewChild('imgEle') imgEle: ElementRef<HTMLImageElement>;
  isImgLoaded = false;
  // 图片是否加载失败
  isImgLoadedError = false;

  constructor(
    public _fileItemService: FileItemService,
    private appRef: ApplicationRef
  ) { }

  ngOnInit() {
    // this.isImgLoaded = true;
    // 比较愚蠢的解决方案
    // setTimeout(() => this.isImgLoaded = true);
    // 订阅组件树稳定事件
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        this.isImgLoaded = true;
      }
    });
  }
  ngAfterViewInit(): void {
  }
}
