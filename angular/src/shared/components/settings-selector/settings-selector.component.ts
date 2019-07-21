import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {MaterialSettingServiceProxy, SystemSettingDto, SystemSettingServiceProxy} from '@shared/service-proxies/service-proxies';

/*这是一个通用的settings组件，传入不同的input参数来控制这个组件的运作。例如传入key和服务类型，则可以显示不同的下拉选项*/
@Component({
  selector: 'app-setting-selector',
  templateUrl: './settings-selector.component.html',
  styleUrls: ['./settings-selector.component.css']
})
export class SettingsSelectorComponent implements OnInit {
  // 键
  @Input() key: string;
  // 值的双向绑定
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  // 定义服务的类型
  @Input() settingType: 'system' | 'material' = 'system';
  // 是否必须
  @Input() required = false;
  // 选择框样式
  @Input() appearance: 'outline' | 'standard' = 'standard';
  settings: SystemSettingDto[];
  private _settingService;

  constructor(private injector: Injector) {
  }

  ngOnInit() {
    // 动态的注入不同的服务
    switch (this.settingType) {
      case 'system': this._settingService = this.injector.get(SystemSettingServiceProxy); break;
      case 'material': this._settingService = this.injector.get(MaterialSettingServiceProxy); break;
    }
      this._settingService.getAll(this.key).subscribe((result) => this.settings = result.items);
  }
}
