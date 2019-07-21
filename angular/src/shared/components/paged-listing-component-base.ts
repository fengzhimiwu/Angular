import {AppComponentBase} from 'shared/components/app-component-base';
import {Injector, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@node_modules/@angular/router';

// abp框架自带的列表基类组件
export class PagedResultDto {
  items: any[];
  totalCount: number;
}

export class EntityDto {
  id: number;
}

export class PagedRequestDto {
  skipCount: number;
  maxResultCount: number;
}

export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {

  public pageSize = 10; // 每页数量
  public pageNumber = 1; // 当前页面
  public totalPages = 1; // 总页数
  public totalItems: number; // 总数
  public isTableLoading = false; // 是否正在加载
  protected route: ActivatedRoute;

  protected constructor(injector: Injector) {
    super(injector);
    this.route = injector.get(ActivatedRoute);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    // 读取当前路由中的页号
    const page = +this.route.snapshot.paramMap.get('pageNumber');
    if (page > 1) {
      this.pageNumber = page;
    }
    // 获取数据，手动获取数据直接使用getDataPage
    this.getDataPage(this.pageNumber);
  }

  public showPaging(result: PagedResultDto, pageNumber: number): void {
    this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;

    this.totalItems = result.totalCount;
    this.pageNumber = pageNumber;
  }

  public getDataPage(page: number): void {
    const req = new PagedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;
    // 表格加载动画开启
    this.isTableLoading = true;
    this.list(req, page, () => {
      this.isTableLoading = false;
    });
  }

  protected abstract list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void;

  protected abstract delete(entity: TEntityDto): void;
}
