import {ExaminationsDialogComponent} from './examinations-dialog/examinations-dialog.component';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {ExaminationReportDto, ExaminationServiceProxy} from '@shared/service-proxies/service-proxies';
import {MatDialog} from '@angular/material';
import {finalize} from 'rxjs/operators';
import {Component, Injector} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {FileItemCategory} from '@shared/AppEnums';
import {FileItemService} from '@shared/service-proxies/file-item.service';

@Component({
  selector: 'app-examinations',
  templateUrl: './examinations.component.html',
  styleUrls: ['./examinations.component.css'],
  animations: [appModuleAnimation()]
})
export class ExaminationsComponent extends PagedListingComponentBase<ExaminationReportDto> {
  inspections: ExaminationReportDto[];
  // 搜索关键字
  keyword: string;

  constructor(
    injector: Injector,
    private _examinationService: ExaminationServiceProxy,
    private dialog: MatDialog,
    private _fileItemService: FileItemService
  ) {
    super(injector);
  }
  // 修改、上传操作
  openDialog(examinationId: string = null) {
    const dialogRef = this.dialog.open(ExaminationsDialogComponent, {width: '640px', data: {examinationId: examinationId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }
  // 下载报告操作
  downloadReport(reportDto: ExaminationReportDto) {
    if (reportDto.fileItemId) {
      this._fileItemService.get(reportDto.fileItemId);
    } else {
      abp.message.info('还未提交检验报告，请联系检验员提交');
    }
  }
  // 搜索
  search(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }
  // 获取列表数据操作
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._examinationService.getAll(this.keyword, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => finishedCallback())).subscribe(result => {
      this.inspections = result.items;
      this.showPaging(result, pageNumber);
      // 自动打开dialog
      this.route.queryParamMap.subscribe(param => {
        const id = param.get('id');
        if (id) {
          this.openDialog(id);
        }
      });
    });
  }
  // 删除操作
  protected delete(inspection: ExaminationReportDto): void {
    abp.message.confirm('删除送检报告' + inspection.inventoryId + '?',
      (result: boolean) => {
        if (result) {
          this._examinationService.delete(inspection.id).subscribe(() => {
            this.snackBar.open('删除送检报告: ' + inspection.inventoryId, '关闭', {duration: 2000});
            this.refresh();
          });
        }
      }
    );
  }
}
