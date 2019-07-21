import {Component, ComponentFactoryResolver, Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

// 测试 结构指令显示空状态
@Directive({
  selector: '[appEmptyState]',
})
export class EmptyStateDirective {
  @Input() set appEmptyState(data: any[]) {
    this.viewContainer.clear();
    // 判断列表是否为空
    if (data && data.length < 1) {
      // 创建组件
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {}
}

@Component({
  template: `
    <ng-container [ngSwitch]="type">
      <ng-container *ngSwitchCase="'div'">
        <mat-icon class="m-r-10">mood</mat-icon>{{message}}...
      </ng-container>
      <ng-container *ngSwitchCase="'tr'">
        <tr><td colspan="5" class="text-center">{{message}}...</td></tr>
        <mat-icon class="m-r-10">mood</mat-icon>
      </ng-container>
    </ng-container>
  `,
  styles: [`
    :host {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class DivEmptyStateComponent {
  message: string;
  type: string;
  colspan: number;
}
