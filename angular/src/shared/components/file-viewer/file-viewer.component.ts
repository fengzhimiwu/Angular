import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {Overlay, OverlayRef} from '@node_modules/@angular/cdk/overlay';
import {TemplatePortal} from '@node_modules/@angular/cdk/portal';
import {FileTypeHelper} from '@shared/helpers/file-type.helper';

/*这是一个文件预览的组件。使用说明：记得使用ngif对本组件进行操作，因为组件未集成ngChanges
* 如果传入的文件是图片，则会预览图片，点击可以产看大图；否则只会显示文件名，点击可以下载*/
@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() imgHeight = '240px';
  fileItem: FileItem;
  // 文件检查工具
  FileTypeHelper = FileTypeHelper;
  @ViewChild('dragItem') _dialogTemplate: TemplateRef<any>;
  // 关于overlayRef和portal的使用参照material angular的cdk部分
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;

  constructor(
    private _fileItemService: FileItemService,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // 获取file的信息
    if (this.id) {this._fileItemService.getInfo(this.id).subscribe(result => this.fileItem = result); }
  }

  ngAfterViewInit() {
    // overlay的定义创建，portal的初始化
    this._portal = new TemplatePortal(this._dialogTemplate, this._viewContainerRef);
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
    // 订阅关闭的事件
    this._overlayRef.backdropClick().subscribe((event) => {
      this._overlayRef.detach();
      event.stopPropagation();
    });
  }
  // 销毁
  ngOnDestroy() {
    this._overlayRef.dispose();
  }

  openDialog() {
    this._overlayRef.attach(this._portal);
  }

  download() {
    this._fileItemService.get(this.id);
  }
}
