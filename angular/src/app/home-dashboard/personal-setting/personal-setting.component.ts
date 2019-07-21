import {Component, Injector, OnInit} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {
  ChangePasswordInput,
  ChangeUiThemeInput,
  ConfigurationServiceProxy,
  SessionServiceProxy,
  UserDto
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/components/app-component-base';
import {FileItemCategory} from '@shared/AppEnums';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {FormControl, FormGroup} from '@node_modules/@angular/forms';

@Component({
  selector: 'app-personal-setting',
  templateUrl: './personal-setting.component.html',
  styleUrls: ['./personal-setting.component.css'],
  animations: [appModuleAnimation()]
})
export class PersonalSettingComponent extends AppComponentBase implements OnInit {
  // 主题信息
  themes: UiThemeInfo[] = [
    new UiThemeInfo('红色', 'red'),
    new UiThemeInfo('粉色', 'pink'),
    new UiThemeInfo('紫色', 'purple'),
    new UiThemeInfo('深紫色', 'deep-purple'),
    new UiThemeInfo('靛蓝色', 'indigo'),
    new UiThemeInfo('蓝色', 'blue'),
    new UiThemeInfo('淡蓝色', 'light-blue'),
    new UiThemeInfo('青色', 'cyan'),
    new UiThemeInfo('水鸭色', 'teal'),
    new UiThemeInfo('绿色', 'green'),
    new UiThemeInfo('淡绿色', 'light-green'),
    new UiThemeInfo('绿黄色', 'lime'),
    new UiThemeInfo('黄色', 'yellow'),
    new UiThemeInfo('琥珀色', 'amber'),
    new UiThemeInfo('橙色', 'orange'),
    new UiThemeInfo('深橙色', 'deep-orange'),
    new UiThemeInfo('棕色', 'brown'),
    new UiThemeInfo('灰色', 'grey'),
    new UiThemeInfo('蓝灰色', 'blue-grey'),
    new UiThemeInfo('黑色', 'black')
  ];
  // 默认主题
  selectedThemeCssClass = 'blue-grey';
  // 用户信息
  user: UserDto;

  constructor(
    injector: Injector,
    private _configurationService: ConfigurationServiceProxy,
    private _fileItemService: FileItemService,
    private _sessionService: SessionServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // 主题设置
    this.selectedThemeCssClass = this.setting.get('App.UiTheme');
    $('body').addClass('theme-' + this.selectedThemeCssClass);
    this._sessionService.getCurrentUser().subscribe(result => this.user = result);
  }

  // 上传头像
  headFileInput(event) {
    const file: File = event.target.files[0];
    const formFile = new FormData();
    formFile.append('FormFile', file, file.name);
    formFile.append('FileItemCategory', FileItemCategory.UserHead.toString());
    this._fileItemService.create(formFile).subscribe((result: FileItem) => {
      // 删除上一个头像文件
      this._fileItemService.delete(this.user.headFileItemId).subscribe();
      this.user.headFileItemId = result.id;
    });
  }

  // 保存基本信息
  savePersonalInfo() {
    this._sessionService.updateCurrentUser(this.user).subscribe(result => {
      this.user = result;
      this.snackBar.open('保存成功', '关闭', {duration: 2_000});
    });
  }


  // abp框架自带，选择主题方法
  setTheme(theme: UiThemeInfo): void {
    const input = new ChangeUiThemeInput();
    input.theme = theme.cssClass;
    this._configurationService.changeUiTheme(input).subscribe(() => {
      const $body = $('body');
      $('.right-sidebar .demo-choose-skin li').removeClass('active');
      $body.removeClass('theme-' + this.selectedThemeCssClass);
      $('.right-sidebar .demo-choose-skin li div.' + theme.cssClass).closest('li').addClass('active');
      $body.addClass('theme-' + theme.cssClass);
      this.selectedThemeCssClass = theme.cssClass;
    });
  }
}

class UiThemeInfo {
  constructor(public name: string, public cssClass: string) {
  }
}
