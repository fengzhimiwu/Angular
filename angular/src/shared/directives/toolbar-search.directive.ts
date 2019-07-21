import {Directive, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';

// 搜索相关组件使用的指令类
@Directive({
  selector: '[appToolbarSearch]'
})
export class ToolbarSearchDirective implements OnInit, OnDestroy {
  // 打开搜索框操作
  static showSearchBar() {
    const $searchBar = $('.search-bar');
    $searchBar.addClass('open');
    $searchBar.find('input[type="text"]').trigger( 'focus');
    // console.log($searchBar);
  }
  // 关闭搜索框操作
  static hideSearchBar() {
    const $searchBar = $('.search-bar');
    $searchBar.removeClass('open');
    // $searchBar.find('input[type="text"]').val('');
  }
  constructor(
    private el: ElementRef,
    private render: Renderer2,
  ) { }

  ngOnInit(): void {
    const $searchBar = $('.search-bar');
    // 当搜索按钮被点击时，打开搜索框
    this.render.listen(this.el.nativeElement, 'click', () => {
      ToolbarSearchDirective.showSearchBar();
    });
    // ESC key on pressed. 当ESC键被按的时候，关闭搜索框
    this.render.listen($searchBar.find('input[type="text"]')[0], 'keyup', (e) => {
      if (e.keyCode === 27) {
        ToolbarSearchDirective.hideSearchBar();
      }
    });
    // Close search click event. 当关闭按钮被点击的时候，关闭搜索框
    this.render.listen($searchBar.find('.close-search')[0], 'click', () => {
      ToolbarSearchDirective.hideSearchBar();
    });
  }

  ngOnDestroy(): void {
    this.render.destroy();
  }
}
