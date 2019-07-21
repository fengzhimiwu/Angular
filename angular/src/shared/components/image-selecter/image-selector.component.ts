import {
  AfterViewInit,
  Component,
  Inject,
  Injector, OnDestroy,
  OnInit,
} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@node_modules/@angular/material';
import {CameraComponent} from '@shared/components/image-selecter/camera/camera.component';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {AppComponentBase} from '@shared/components/app-component-base';
import {ComponentPortal} from '@node_modules/@angular/cdk/portal';
import {Overlay, OverlayRef} from '@node_modules/@angular/cdk/overlay';

/*文件上传选择器，可以选择拍照，还是从本地添加*/
@Component({
  selector: 'app-image-selecter',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  private _overlayRef: OverlayRef;
  private _portal: ComponentPortal<CameraComponent>;

  constructor(
    injector: Injector,
    private bottomSheetRef: MatBottomSheetRef<ImageSelectorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      formData: FormData,
      formName: string
    },
    private _fileItemService: FileItemService,
    private _overlay: Overlay,
  ) {
    super(injector);
}

  ngOnInit() {
  }
  ngAfterViewInit() {
    // 创建相机端口
    this._portal = new ComponentPortal(CameraComponent);
    // 创建overlay
    this._overlayRef = this._overlay.create();
  }
  // 销毁overlay
  ngOnDestroy() {
    this._overlayRef.dispose();
  }

  // 动态的打开相机添加文件
  openCamera() {
    // 将相机附加到overlay上
    const instance = this._overlayRef.attach(this._portal).instance;
    // 初始化相机，并订阅完成拍照事件
    instance.init().subscribe((result: Blob) => {
      if (result) {
        // 把数据append到form里面
        this.data.formData.append('FormFile', result, new Date().getSeconds() + '.png');
        // 上传
        this.uploadFile(this.data.formData);
      }
      // 等待动画完毕
      setTimeout(() => this._overlayRef.detach(), 330);
    });
  }
  // 选择文件
  changeFile(event) {
    const file: File = event.target.files[0];
    this.data.formData.append('FormFile', file, file.name);
    this.uploadFile(this.data.formData);
  }
  // 上传文件方法
  uploadFile(formData: FormData) {
    this._fileItemService.create(formData).subscribe((result: FileItem) => {
      this.bottomSheetRef.dismiss(result);
    });
  }
}
