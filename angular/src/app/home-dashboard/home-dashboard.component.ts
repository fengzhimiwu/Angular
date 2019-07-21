import {Component, Injector, AfterViewInit, OnInit} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import * as Chart from 'chart.js';
import {
  GetDashboardInfoOutput, GetDashboardTaskOutput,
  HomeServiceProxy,
  ProjectDto,
} from '@shared/service-proxies/service-proxies';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {finalize} from '@node_modules/rxjs/operators';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {FileItemCategory} from '@shared/AppEnums';

@Component({
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css'],
  animations: [appModuleAnimation()]
})

export class HomeDashboardComponent extends PagedListingComponentBase<any> implements OnInit, AfterViewInit {
  FileItemCategory = FileItemCategory;
  project: ProjectDto;
  // 仪表盘的图标信息
  dashboardInfo: GetDashboardInfoOutput;
  // 首页任务的信息
  dashboardTask: GetDashboardTaskOutput;
  // 定义图表对象
  charts = {subChart: null, qualityChart: null};

  constructor(injector: Injector, private _homeService: HomeServiceProxy, public _fileItemService: FileItemService) {
    super(injector);
    this.stateChanger.init('homeDashboard', 1, () => this.refresh());
  }

  getFileUrl() {
    return this._fileItemService.getUrl(this.project.id, FileItemCategory.HomeVideo);
  }

  ngOnInit() {
    this._homeService.geDashboardTask().subscribe(result => this.dashboardTask = result);
  }

  // 原有的dashboard方法
  ngAfterViewInit(): void {
    this.stateChanger.next('homeDashboard');
    // 首页大标签从0到某个数字的特效
    $(function () {
      // Widgets count
      $('.count-to').countTo();
      // Sales count to
      $('.sales-count-to').countTo({
        formatter: function (value, options) {
          return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ' ').replace('.', ',');
        }
      });
      // initRealTimeChart1();
    });
  }
  // 初始化圆饼图
  initDonutChart() {
    const subChartData = {
      datasets: [{
        data: [this.dashboardInfo.finishedCount, this.dashboardInfo.noStateCount, this.dashboardInfo.processingCount,
          this.dashboardInfo.offStateCount],
        backgroundColor: ['#4caf50', '#ff6484', '#f4c24f', '#9F9F9F']
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ['已完成', '未生产', '正在生产', '运往现场']
    };
    this.charts.subChart = new Chart($('#sub_donut_chart'), {
      type: 'doughnut',
      data: subChartData,
      options: Chart.default.pie
    });
    this.charts.subChart.update();
    // 因为质量图标部分隐藏了，所以这里要注释
    // this.charts.qualityChart = new Chart($('#quality_donut_chart'), {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     }
    //   }
    // });
    // this.charts.qualityChart.update();
  }
  // 计算计划进度
  calculatePlanProgress(): number {
    return this.dashboardInfo.planProgressCount * 100 / this.dashboardInfo.planTotalCount;
  }
  // 计算当前进度
  calculateCurrentProgress(): number {
    return (this.dashboardInfo.offStateCount + this.dashboardInfo.finishedCount) * 100 / this.dashboardInfo.planTotalCount;
  }
  // 计算标签的样式。div标签的容器，isCurrentProgress计算哪个进度，inner内部标签
  calculateProgressLabel(div: HTMLDivElement, isCurrentProgress: boolean, inner: HTMLDivElement): {} {
    let left = isCurrentProgress ? this.calculateCurrentProgress() : this.calculatePlanProgress();
    left = div.clientWidth * left / 100;
    const halfContainer = div.clientWidth / 2;
    return {
      'left': left + 'px',
      'margin-left': left < halfContainer ? '0' : '-' + inner.clientWidth + 'px'
    };
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    if (this.project) {
      this._homeService.getDashboardInfo(this.project.id).pipe(finalize(() => finishedCallback())).subscribe(result => {
        this.dashboardInfo = result;
        this.initDonutChart();
      });
    } else {
      finishedCallback();
    }
  }

  protected delete(entity: any): void {
  }
}
