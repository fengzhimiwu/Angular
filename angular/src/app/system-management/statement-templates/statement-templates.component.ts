import {Component, Injector, OnInit} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {TaskItemDto} from '@shared/service-proxies/service-proxies';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {FileItemCategory} from '@shared/AppEnums';
import {finalize} from '@node_modules/rxjs/operators';
import {MatDialog} from '@node_modules/@angular/material';
import {StatementTemplateDialogComponent} from '@app/system-management/statement-templates/statement-template-dialog/statement-template-dialog.component';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {AppConsts} from '@shared/AppConsts';

@Component({
  selector: 'app-statement-templates',
  templateUrl: './statement-templates.component.html',
  styleUrls: ['./statement-templates.component.css'],
  animations: [appModuleAnimation()]
})
export class StatementTemplatesComponent extends PagedListingComponentBase<FileItem> {
  fileItems: FileItem[];

  constructor(injector: Injector, private _fileItemService: FileItemService, private dialog: MatDialog) {
    super(injector);
  }

  openDialog(item: FileItem) {
    this.dialog.open(StatementTemplateDialogComponent, {width: '640px', data: item});
  }

  changeFile(event) {
    const formData = new FormData();
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }
    formData.append('FormFile', file);
    formData.append('FileItemCategory', FileItemCategory.StatementTemplate.toString());
    // this.filename = file.name;
    this._fileItemService.create(formData).subscribe(() => {
      this.snackBar.open(this.l('上传文件成功'), '关闭', {duration: 2_000});
      this.refresh();
    });
  }

  gotoHelp(position) {
    window.open(AppConsts.appBaseUrl + '/assets/help/docs.html' + '#' + position );
  }



  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._fileItemService.getAll(FileItemCategory.StatementTemplate).pipe(
      finalize(() => finishedCallback())
    ).subscribe(result => {
      this.fileItems = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: FileItem): void {
    this._fileItemService.delete(entity.id).subscribe(() => {
      this.snackBar.open(this.l('删除成功'), '关闭', {duration: 2_000});
      this.fileItems.splice(this.fileItems.indexOf(entity), 1);
    });
  }
}
