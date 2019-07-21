import {Component, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges} from '@angular/core';
import {toolbarAnimation} from '@shared/animations/toolbar-animation';
import {AppComponentBase} from '@shared/components/app-component-base';
import {ToolbarSearchDirective} from '@shared/directives/toolbar-search.directive';
import {FormControl} from '@node_modules/@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subscription} from 'rxjs';

/*这是一个二级工具条组件*/
@Component({
  selector: 'app-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['./sub-toolbar.component.css'],
  animations: [toolbarAnimation],
})
export class SubToolbarComponent extends AppComponentBase implements OnInit, OnChanges, OnDestroy {
  // 搜索框的提示
  @Input() searchTip: string;
  // 开始搜索事件
  @Output() searchStart = new EventEmitter<string>();
  // 是否正在搜索
  @Input() isSearching = false;
  // 搜索控件
  searchControl: FormControl;
  // 可以通过subscription进行取消定语
  searchSubscription: Subscription;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    // 如果搜索框的提示为空
    if (!this.searchTip) {
      this.searchTip = '搜索';
    }
    this.searchControl = new FormControl('');
    // 使用pipe添加数据操作，并订阅
    this.searchSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => this.searchStart.emit(value));
  }
  // 当回车或者点击搜索按钮的时候会触发
  enterSearch() {
    this.searchStart.emit(this.searchControl.value);
    ToolbarSearchDirective.hideSearchBar();
  }
  // 取消订阅
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

}
