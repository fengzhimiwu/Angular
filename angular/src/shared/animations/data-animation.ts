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
// 高度逐渐加大渐变进入
export const fadeIn = trigger('fadeIn', [
  transition('void => *', [ // 进场动画
    style({height: '0', opacity: 0}), // 元素高度0，元素隐藏(透明度为0)，动画帧在0%
    animate('0.33s ease', style({height: '*', opacity: 1}))
  ]),
  transition('* => void', [ // 离场动画
    animate('0.33s ease', style({height: '0', opacity: 0}))
  ]),
]);
// export const fadeIn = trigger('fadeIn', [
//   state('in', style({ display: 'none' })), // 默认元素不展开
//   transition('void => *', [ // 进场动画
//     animate('500ms ease-out', keyframes([
//       style({ height: '0', opacity: 0, offset: 0 }), // 元素高度0，元素隐藏(透明度为0)，动画帧在0%
//       style({ height: '*', opacity: 1, offset: 1 }) // 200ms后高度自适应展开，元素展开(透明度为1)，动画帧在100%
//     ]))
//   ]),
//   transition('* => void', [
//     animate('500ms ease-out', keyframes([
//       style({ height: '*', opacity: 1, offset: 0 }), // 与之对应，让元素从显示到隐藏一个过渡
//       style({ height: '0', opacity: 0, offset: 1 })
//     ]))
//   ]),
// ]);
// 右侧渐变进入
export const switchIn = trigger('switchIn', [
  state('in', style({display: 'none'})), // 默认元素不展开
  transition(':enter', [
    style({opacity: 0, 'margin-left': '15px'}),
    animate('0.33s ease-out', style({opacity: 1, 'margin-left': '*'})),
  ]),
]);
