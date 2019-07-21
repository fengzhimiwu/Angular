import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@node_modules/@angular/animations';

/*右下角各种操作按钮组件*/
@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css'],
  animations: [trigger('buttonGroupAnimation', [
    state('visible', style({right: '*'})),
    state('hidden', style({right: '-48px'})),
    transition('visible <=> hidden', [animate('330ms ease')]),
  ])]
})
export class ButtonGroupComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('buttonGroup') buttonGroup: ElementRef;
  // 是否可见
  isVisible = true;
  // 监听器
  private listener: () => void;

  constructor(
    // angular的渲染器
    private render: Renderer2,
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.isVisible = true;
  }

  ngOnInit() {
    // 监听滚动事件
    this.listener = this.render.listen('window', 'scroll', () => {
      // 计算：当触碰到底部的时候要把按钮收起来
      this.isVisible = window.pageYOffset + window.innerHeight !== document.documentElement.scrollHeight;
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // 销毁监听器
    this.listener();
  }
}
