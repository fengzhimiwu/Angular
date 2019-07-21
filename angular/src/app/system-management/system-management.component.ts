import {Component, OnInit} from '@node_modules/@angular/core';
import * as Cookie from 'js-cookie';
import {ActivatedRoute, Router} from '@node_modules/@angular/router';

@Component({
  styles: [`
    /*工序流程图样式*/
    .circle-priority-container {
      overflow: auto;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    }
    /*外圈内圈共同样式*/
    .circle-priority, .circle-priority-inner {
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: relative;
      background-color: #2979ff;
      height: 24px;
      min-width: 24px;
    }
    /*内圈样式*/
    .circle-priority-inner {
      background-color: #40c4ff;
      height: 16px;
      min-width: 16px;
    }
    /*两圆圈的间距*/
    .circle-priority {
      margin-right: 32px;
    }
    /*圆圈间的横线样式*/
    .circle-priority::before {
      content: '';
      position: absolute;
      right: 28px;
      width: 24px;
      border-top-width: 1px;
      border-top-style: solid;
      border-top-color: rgba(0, 0, 0, .12);
    }
    /*第一个不显示短线*/
    .circle-priority.first::before {
      content: none;
    }
    /*未完成样式的工序*/
    .circle-priority.incomplete {
      background-color: #a5a5a5;
    }
    .circle-priority-inner.incomplete {
      background-color: #bfbfbf;
    }
  `],
  template: `
    <div class="row">
      <mat-card *ngIf="isEnabledSystemTutorial">
        <h5 class="m-t-0 m-b-0">系统模块向导： {{currentTutorial.text}}
          <span style="display:inline-block">
            <button mat-button color="primary" (click)="previous()" [disabled]="currentTutorial.index==1">上一步</button>
            <button mat-button color="primary" (click)="next()" [disabled]="currentTutorial.index==7">下一步</button>
            <button mat-button (click)="reset()">重置</button>
          </span>
        </h5>
        <div class="circle-priority-container">
          <div class="circle-priority" [ngClass]="{first:i==0,incomplete:currentTutorial!=t}" *ngFor="let t of tutorials;let i=index;">
            <div class="circle-priority-inner" [ngClass]="{incomplete:currentTutorial!=t}">{{t.index}}</div>
          </div>
        </div>
      </mat-card>
    </div>
    <router-outlet></router-outlet>
  `
})
export class SystemManagementComponent implements OnInit {
  // 是否显示向导
  isEnabledSystemTutorial = false;
  // 所有向导
  tutorials = [
    {index: 1, route: 'users', text: '请操作用户列表'},
    {index: 2, route: 'roles', text: '请添加系统所需要的角色'},
    {index: 3, route: 'task-item', text: '请配置工作项'},
    {index: 4, route: 'procedure', text: '请配置工序模板，工序模板一般用于构件生产'},
    {index: 5, route: null, text: '请选择一个工序模板配置其工序流程。即点击三横菜单按钮，查看详情。工序流程的配置需要绑定工作项'},
    {index: 6, route: 'statement', text: '请添加报表模板，并选择绑定相应的工作项'},
    {index: 7, route: 'setting', text: '请配系统置参数'},
  ];
  // 当前所在向导
  currentTutorial = this.tutorials[0];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.isEnabledSystemTutorial = Cookie.get('isEnabledSystemTutorial');
    // 询问是否开启开启向导
    if (Cookie.get('isEnabledSystemTutorial') == null) {
      abp.message.confirm('是否开启系统模块向导？可在个人设置 > 其他设置里面关闭/开启向导。', '是否开启向导？', result => {
        if (result) {
          Cookie.set('isEnabledSystemTutorial', true, {expires: 5 * 365}); // 5 year
          this.isEnabledSystemTutorial = true;
        } else {
          Cookie.set('isEnabledSystemTutorial', '', {expires: 5 * 365});
        }
      });
    }
  }
  // 下一步
  next() {
    this.currentTutorial = this.tutorials[this.currentTutorial.index];
    this.chooseOperation();
  }
  // 上一步
  previous() {
    this.currentTutorial = this.tutorials[this.currentTutorial.index - 2];
    this.chooseOperation();
  }
  // 重置
  reset() {
    this.currentTutorial = this.tutorials[0];
    this.chooseOperation();
  }
  // 自动判断并选择操作
  private chooseOperation() {
    if (this.currentTutorial.route) {
      // 有路由就跳转
      this.router.navigate([this.currentTutorial.route], {relativeTo: this.route}).then();
    } else {
      // 没路由进行提示
      abp.message.info(this.currentTutorial.text, '下一步提示');
    }
  }
}
