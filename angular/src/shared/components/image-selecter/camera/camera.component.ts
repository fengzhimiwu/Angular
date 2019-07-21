import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@node_modules/@angular/animations';
import {Observable, Subject} from '@node_modules/rxjs';

/*相机组件*/
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  // 相机组件带有的动画
  animations: [
    trigger('openComponent', [
      transition('void => *', [ // 进场动画
        style({top: '100%', opacity: 1}), // 元素高度0，元素隐藏(透明度为0)，动画帧在0%
        animate('0.33s ease-out', style({top: '*', opacity: 1}))
      ]),
      transition('* => void', [
        animate('0.33s ease-in', style({top: '100%', opacity: 1}))
      ]),
    ])
  ]
})
export class CameraComponent implements OnInit, OnDestroy {
  @ViewChild('camera') camera: ElementRef;
  @ViewChild('cameraCanvas') cameraCanvas: ElementRef;
  // 相机是否打开
  isCameraOpen = false;
  // 是否为拍照界面
  isTakingPhoto = true;
  // 是否正在转化为blob
  isConverting = false;
  videoTrack: MediaStreamTrack;
  // 订阅照片确认
  private onPhotoCheck = new Subject<Blob>();

  constructor() {
  }

  ngOnInit(): void {
    // this.init();
  }
  // 相机的初始化
  init(): Observable<Blob> {
    // 状态设置为打开
    this.isCameraOpen = true;
    const constraints = {
      video: { facingMode: 'environment'}, // { exact: 'environment' }},
      // audio: true,
    };
    // 初始化媒体流
    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      this.camera.nativeElement.srcObject = mediaStream;
      this.videoTrack = mediaStream.getVideoTracks()[0];
      this.camera.nativeElement.play().then();
    });
    return this.onPhotoCheck;
  }

  takePhoto() {
    this.isTakingPhoto = false;
    // 设定画布大小
    this.cameraCanvas.nativeElement.width = document.documentElement.clientWidth;
    this.cameraCanvas.nativeElement.height = document.documentElement.clientHeight;
    // 获取相机当前设置
    const settings = this.videoTrack.getSettings();
    let x = document.documentElement.clientWidth;
    let y = document.documentElement.clientHeight;
    // 先判断高充满情况，再判断宽充满情况。按等比例的缩小放大
    if (document.documentElement.clientWidth / document.documentElement.clientHeight > settings.width / settings.height) {
      x = document.documentElement.clientHeight * (settings.width / settings.height);
      this.cameraCanvas.nativeElement.width = x;
    } else if (document.documentElement.clientWidth / document.documentElement.clientHeight < settings.width / settings.height) {
      y = document.documentElement.clientWidth * (settings.height / settings.width);
      this.cameraCanvas.nativeElement.height = y;
    }
    // 将图像剧中
    let posx = (document.documentElement.clientWidth - x) / 2;
    let posy = (document.documentElement.clientHeight - y) / 2;
    // 因为把画布居中了，所以现在不需要画图时居中
    posx = 0;
    posy = 0;
    // 参数的意思分别是:画布， 裁剪坐标xy，裁剪宽度长宽，画图坐标xy，画图长宽
    this.cameraCanvas.nativeElement.getContext('2d')
      .drawImage(this.camera.nativeElement, 0, 0, settings.width, settings.height, posx, posy, x, y);
    console.log(settings, x, y);
  }

  check() {
    // const dataURL = this.cameraCanvas.nativeElement.toDataURL('image/jpeg');
    this.isConverting = true;
    this.cameraCanvas.nativeElement.toBlob((blob) => {
      this.onPhotoCheck.next(blob);
      this.ngOnDestroy();
    }, 'image/png');
  }

  cancel() {
    this.isTakingPhoto = true;
  }

  // 切换摄像头
  switchCameras() {
    const settings = this.videoTrack.getSettings();
    const constraints = this.videoTrack.getConstraints();
    const capabilities = this.videoTrack.getCapabilities();
    constraints.facingMode = settings.facingMode === 'user' ? { exact: 'environment' } : 'user';
    this.videoTrack.applyConstraints(constraints).then(() => {
      console.log(constraints, settings, capabilities);
    });
  }

  ngOnDestroy(): void {
    this.isConverting = false;
    this.isCameraOpen = false;
    this.isTakingPhoto = true;
    if (this.videoTrack) {
      this.videoTrack.stop();
    }
    if (this.camera) {
      this.camera.nativeElement.srcObject = null;
    }
    this.onPhotoCheck.next(null);
    // this.stream.getAudioTracks()[0].stop();
  }

}
