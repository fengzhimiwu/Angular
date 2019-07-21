import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {fadeIn} from '@shared/animations/data-animation';

/*弹出式的加载框*/
@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css'],
  animations: [fadeIn]
})
export class LoadingDialogComponent implements OnInit {
  tip = '正在处理...';
  isCloseButton = false;

  constructor(
    injector: Injector,
    private dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit() {
    if (this.data) {
      this.tip = this.data;
    }
    // 设置24秒后关闭
    setTimeout(() => this.isCloseButton = true, 24_000);
  }
  // 强制关闭方法
  onNoClick() {
    location.reload();
    this.dialogRef.close();
  }
}
