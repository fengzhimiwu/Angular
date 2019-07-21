import {Component, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  GenerateOutput,
  PedestalDto,
  PedestalServiceProxy,
  ProductionServiceProxy, ProjectDto,
} from '@shared/service-proxies/service-proxies';
import {TaskItemState} from '@shared/AppEnums';
import {AppComponentBase} from '@shared/components/app-component-base';
import {WorkshopHelper} from '@shared/helpers/workshop.helper';

/*台座布局显示组件*/
@Component({
  selector: 'app-workshop-display',
  templateUrl: './workshop-display.component.html',
  styleUrls: ['./workshop-display.component.less']
})
export class WorkshopDisplayComponent extends AppComponentBase implements OnChanges {
  // 显示一个布局所需要的参数
  @Input() project: ProjectDto;
  // 是否只读
  @Input() readonly = false;
  // 选择的台座
  @Input() selection: PedestalDto;
  @Output() selectionChange = new EventEmitter<PedestalDto | PedestalDto & ExtentPedestal>();
  // 布局信息列表
  generateOutputs: ExtentGenerateOutput[];
  // 横向布局的字段
  horizontalLayoutWay = true;
  loading = true;

  constructor(
    injector: Injector,
    private _productionService: ProductionServiceProxy,
    private pedestalAppService: PedestalServiceProxy
  ) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ('project' in changes || 'selection' in changes) {
      // 获取布局信息
      this.autoGeneration();
    }
  }
  // 显示台座布局
  autoGeneration() {
    // 如果项目没有布局，则清空台座
    if (this.project && this.project.layoutId == null) {
      this.loading = false;
      this.generateOutputs = null;
      return;
    }
    // 如果项目project没有给，则使用台座selection
    const layoutId = this.project ? this.project.layoutId : this.selection.workshopLayoutId;
    const projectId = this.project ? this.project.id : this.selection.projectId;
    this.pedestalAppService.getListByLayoutAndProject(layoutId, projectId).subscribe((result: [ExtentGenerateOutput]) => {
      // 循环：添加台座的编号和颜色
      result.forEach(v => {
        // 对v中的每个成员进行遍历
        for (const p in v) {
          // 如果成员名不为productionLine && 成员的类型不是函数
          if (p && p !== 'productionLine' && typeof v[p] !== 'function') {
            v[p].forEach(item => {
              // 添加颜色class，添加显示的编号
              item.className = WorkshopHelper.checkSubProjectState(item);
              item.displayNo = WorkshopHelper.calculatePedestalNo(item);
            });
          }
        }
      });
      this.generateOutputs = result;
      this.loading = false;
    });
  }

  // 选择构件方法
  choosePedestal(block: PedestalDto, event: Event) {
    // 如果不是只读，说明可以点击
    if (!this.readonly) {
      event.stopPropagation();
      this.selection = block;
      this.selectionChange.emit(this.selection);
    }
  }
}

// 给台座提供了类名和编号
export class ExtentPedestal {
  className: '' | 'in-completing' | 'wait-assignment' | 'in-processing' | 'wait-workshop';
  displayNo: number;
}
// 额外的output类型，提供了class与显示的号码
class ExtentGenerateOutput extends GenerateOutput {
  productionLine: string | undefined;
  lU_BindRebar: (PedestalDto & ExtentPedestal)[];
  lU_BeamPedestal: (PedestalDto & ExtentPedestal)[];
  lU_SaveBeam: (PedestalDto & ExtentPedestal)[];
  rD_BindRebar: (PedestalDto & ExtentPedestal)[];
  rD_BeamPedestal: (PedestalDto & ExtentPedestal)[];
  rD_SaveBeam: (PedestalDto & ExtentPedestal)[];
}


