import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponseBase} from '@node_modules/@angular/common/http';
import {Observable, pipe, throwError} from '@node_modules/rxjs';
import {AppConsts} from '@shared/AppConsts';
import {catchError, map, mergeMap} from '@node_modules/rxjs/operators';
import {PagedResultDto} from '@shared/components/paged-listing-component-base';
import {FileItemCategory} from '@shared/AppEnums';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// 文件服务，对应后台Web.Core/Controller的FileItemController
@Injectable()
export class FileItemService {
  private readonly http: HttpClient;
  private readonly baseUrl = AppConsts.remoteServiceBaseUrl;

  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }
  // 下载文件的方法
  // 常规时候id是文件id，其他types的下载id会有不同的作用，详情看fileItemController代码的switch
  get(id = '', types: FileItemCategory = 0): void {
    window.location.href = this.getUrl(id, types);
  }
  // 获取文件的下载地址，一般用于展示图片
  getUrl(id = '', types: FileItemCategory = 0): string {
    return this.baseUrl + `/FileItem/Get?id=${id}&types=${types}`;
  }
  // 获取文件的信息，即fileItem的信息
  getInfo(id): Observable<FileItem> {
    const url = this.baseUrl + '/FileItem/GetInfo';
    // 构造请求头
    let params = new HttpParams();
    params = params.append('fileItemId', id);
    // headers = headers.append('Content-Type', 'multipart/form-data;boundary=any_random_value');
    return this.http.get(url, {params: params}).pipe(
      // 取得result里面的数据
      map((response: any) => response.result),
      // 错误抓取，弹窗显示错误
      catchError(response => {
        abp.message.error(JSON.stringify(response.error.error), '出现未知错误');
        return throwError(response);
      }),
    ) as Observable<FileItem>;
  }
  // 创建文件
  create(formData: FormData): Observable<FileItem> {
    const url = this.baseUrl + '/FileItem/Create';
    const headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'multipart/form-data;boundary=any_random_value');
    return this.http.post(url, formData, {headers: headers}).pipe(
      map((response: any) => response.result),
      catchError(response => {
        abp.message.error(JSON.stringify(response.error.error), '出现未知错误');
        return throwError(response);
      }),
    ) as Observable<FileItem>;
  }
  // 获取所有文件
  getAll(fileItemCategory: FileItemCategory, relationalId?: string): Observable<PagedResultDto> {
    const url = this.baseUrl + '/FileItem/GetAll';
    const headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('FileItemCategory', fileItemCategory.toString());
    if (relationalId) {
      params = params.append('RelationalId', relationalId);
    }
    return this.http.get(url, {params: params, headers: headers}).pipe(
      map((response: any) => response.result),
      catchError(response => {
         abp.message.error(JSON.stringify(response.error.error), '出现未知错误');
        return throwError(response);
      }),
    ) as Observable<PagedResultDto>;
  }
  // 删除文件
  delete(id: string): Observable<void> {
    const url = this.baseUrl + '/FileItem/Delete';
    const headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(url, {params: params, headers: headers}).pipe(
      map((response: any) => response.result),
      catchError(response => {
         abp.message.error(JSON.stringify(response.error.error), '出现未知错误');
        return throwError(response);
      }),
    ) as Observable<void>;
  }
}

// 文件实体
export class FileItem {
  public id: string;
  public fileName: string;
  public fileSize: number;
  public filePath: string;
  public fileType: string;
  public relationalId: string;
  public fileItemCategory: FileItemCategory;
}
