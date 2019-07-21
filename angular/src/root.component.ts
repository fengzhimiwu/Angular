import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@node_modules/@angular/service-worker';
import {MatSnackBar} from '@node_modules/@angular/material';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`
})
export class RootComponent implements OnInit {
  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.swUpdate.available.subscribe(() =>
      // 询问是否更新，点击刷新则会刷新页面
      this.snackBar.open('有新版本，是否刷新？', '刷新', {duration: 16_000})
        .onAction().subscribe(() => location.reload())
    );
    // 通过cookie设置语言为中文
    if (abp.localization.currentLanguage.name !== 'zh-Hans') {
      abp.utils.setCookieValue(
        'Abp.Localization.CultureName',
        'zh-Hans',
        new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
        abp.appPath
      );
    }
  }
}
