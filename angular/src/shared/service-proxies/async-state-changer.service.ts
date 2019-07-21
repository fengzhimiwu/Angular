import { Injectable } from '@angular/core';
import {Subject} from '@node_modules/rxjs';
import {skip} from '@node_modules/rxjs/operators';

/**
 * 一个用于同步计数的服务。
 * 很多时候页面启动要连续调用几个接口，所以这个就是为了让调用线性执行，而不导致angular的检测错误
 * 尽力不要使用这个
 */
@Injectable({
  providedIn: 'root'
})
export class AsyncStateChangerService {
  // 这是存储状态的功能
  public states: {[index: string]: any} = {};
  private actions: {[index: string]: Subject<any>} = {};

  constructor() {}
  // 初始化一个操作，当计数到0时执行回调
  init(name: string, skipCount: number, callback: () => any) {
    this.actions[name] = new Subject<any>();
    this.actions[name].pipe(skip(skipCount)).subscribe(() => {
      callback();
    });
  }
  // 操作一次，即计数减一
  next(name: string) {
    this.actions[name].next();
  }
  // 页面销毁时记得销毁
  destroy(name: string) {
    this.actions[name].unsubscribe();
    this.actions[name] = undefined;
  }
}
/* action names
projectPlan
messageNum

 */
