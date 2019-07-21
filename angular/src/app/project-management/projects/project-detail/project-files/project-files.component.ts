import {Component, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {FileItemCategory} from '@shared/AppEnums';
import {finalize} from '@node_modules/rxjs/operators';
import {ProjectDto} from '@shared/service-proxies/service-proxies';
import {MatDialog} from '@node_modules/@angular/material';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.css']
})
export class ProjectFilesComponent extends PagedListingComponentBase<FileItem> {
  @Input() project: ProjectDto;
  fileItems: FileItem[] = [];

  constructor(
    injector: Injector,
    private _fileItemService: FileItemService,
    private dialog: MatDialog,
  ) {
    super(injector);
  }
  download(entity: FileItem) {
    this._fileItemService.get(entity.id);
  }

  changeFile(event) {
    const dialogLoading = this.openLoadingDialog(this.dialog);
    const formData = new FormData();
    const fileList = event.target.files;
    const file: File = fileList[0];
    formData.append('FormFile', file, file.name);
    formData.append('RelationalId', this.project.id);
    formData.append('FileItemCategory', FileItemCategory.Project.toString());
    // this.filename = file.name;
    this._fileItemService.create(formData).subscribe(() => {
      this.snackBar.open(this.l('上传文件成功'), '关闭', {duration: 2_000});
      this.refresh();
      dialogLoading.close();
    });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._fileItemService.getAll(FileItemCategory.Project, this.project.id).pipe(
      finalize(() => finishedCallback())
    ).subscribe(result => {
      this.fileItems = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: FileItem): void {
    this._fileItemService.delete(entity.id).subscribe( () => {
      this.snackBar.open(this.l('删除成功'), '关闭', {duration: 2_000});
      this.fileItems.splice(this.fileItems.indexOf(entity), 1);
    });
  }
}
