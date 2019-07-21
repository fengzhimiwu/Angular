import {Injector} from '@node_modules/@angular/core';
import {ExaminationServiceProxy, InventoryServiceProxy, ProviderServiceProxy} from '@shared/service-proxies/service-proxies';
import {TaskInputAutocompleteType} from '@shared/AppEnums';
import {Observable, Subject} from '@node_modules/rxjs';
import {debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap} from '@node_modules/rxjs/operators';

// 表格搜索并选择控件的数据来源工具
export class TaskAutocompleteDataSourceHelper {
  // 数据来源的可选项列表
  public searchObservables: {[key: string]: Observable<string[]>} = {};
  private searchSubjects: {[key: string]: Subject<string>} = {};

  constructor(private injector: Injector) { }
  // 添加一个subject
  public addSearchSubject(name: string, type: TaskInputAutocompleteType): void {
    this.searchSubjects[name] = new Subject<string>();
    // 配置一些搜索参数，并订阅搜索
    this.searchObservables[name] = this.searchSubjects[name].pipe(
      debounceTime(500),
      // startWith(''),
      distinctUntilChanged(),
      switchMap(keyword => {
        // 选择注入的服务，动态的注入使用
        switch (type) {
          case TaskInputAutocompleteType.provider:
            return this.injector.get(ProviderServiceProxy).getAll(keyword, 0, 10)
              .pipe(map(result => result.items.map(v => v.providerName)));
          case TaskInputAutocompleteType.inventory:
            return this.injector.get(InventoryServiceProxy).getAll(keyword, 0, 10)
              .pipe(map(result => result.items.map(v => v.code)));
          case TaskInputAutocompleteType.examination:
            return this.injector.get(ExaminationServiceProxy).getAll(keyword, 0, 10)
              .pipe(map(result => result.items.map(v => v.code)));
        }
      })
    );
  }
  // 搜索操作开始
  public doSearch(keyword: string, name: string): void {
    console.log(keyword, name)
    if (name) {
      this.searchSubjects[name].next(keyword);
    }
  }
}
