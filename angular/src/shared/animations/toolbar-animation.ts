import {
  trigger, // 动画封装触发，外部的触发器
  state, // 转场状态控制
  style, // 用来书写基本的样式
  transition, // 用来实现css3的 transition
  animate, // 用来实现css3的animations
  keyframes, // 用来实现css3 keyframes的
  stagger,
  query
} from '@angular/animations';
export const toolbarAnimation = trigger('toolbarAnimation', [
  state('visible', style({top: '0'})),
  state('hidden', style({top: '-64px', 'box-shadow': 'none'})),
  state('subVisible', style({top: '0'})),
  state('subHidden', style({top: '64px', 'background-color': 'white', color: 'black'})), // #f8f9fa
  state('asideVisible', style({top: '0', height: 'calc(100vh - 0px)'})),
  state('asideHidden', style({top: '64px', height: 'calc(100vh - 64px)'})),
  transition('visible <=> hidden', [animate('330ms ease')]),
  transition('subVisible <=> subHidden', [animate('330ms ease')]),
  transition('asideVisible <=> asideHidden', [animate('330ms ease')]),
]);
