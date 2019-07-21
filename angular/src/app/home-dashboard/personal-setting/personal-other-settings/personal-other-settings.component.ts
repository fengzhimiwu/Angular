import { Component, OnInit } from '@angular/core';
import * as Cookie from 'js-cookie';
import {MatSlideToggleChange} from '@node_modules/@angular/material';

@Component({
  selector: 'app-personal-other-settings',
  templateUrl: './personal-other-settings.component.html',
  styleUrls: ['./personal-other-settings.component.css']
})
export class PersonalOtherSettingsComponent implements OnInit {
  isEnabledSystemTutorial: boolean;

  constructor() { }

  ngOnInit() {
    // 获取系统设置
    this.isEnabledSystemTutorial = !!Cookie.get('isEnabledSystemTutorial');
  }

  // 开启/关闭系统模块的向导
  changeSystemTutorial(event: MatSlideToggleChange) {
    if (event.checked) {
      Cookie.set('isEnabledSystemTutorial', event.checked, {expires: 5 * 365});
    } else {
      Cookie.set('isEnabledSystemTutorial', '', {expires: 5 * 365});
    }
  }
}
