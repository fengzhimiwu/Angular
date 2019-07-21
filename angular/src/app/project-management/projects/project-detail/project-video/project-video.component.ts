import {Component, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {FileItemCategory} from '@shared/AppEnums';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {AppComponentBase} from '@shared/components/app-component-base';
import {ProjectDto} from '@shared/service-proxies/service-proxies';
import {MatDialog} from '@node_modules/@angular/material';

@Component({
  selector: 'app-project-video',
  templateUrl: './project-video.component.html',
  styleUrls: ['./project-video.component.css']
})
export class ProjectVideoComponent extends AppComponentBase implements OnInit {
  FileItemCategory = FileItemCategory;
  @Input() project: ProjectDto;

  constructor(
    injector: Injector,
    public _fileItemService: FileItemService,
    private dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  uploadVideo(event) {
    const dialogLoading = this.openLoadingDialog(this.dialog);
    const file: File = event.target.files[0];
    const formFile = new FormData();
    formFile.append('FormFile', file, file.name);
    formFile.append('RelationalId', this.project.id);
    formFile.append('FileItemCategory', FileItemCategory.HomeVideo.toString());
    this._fileItemService.create(formFile).subscribe((result) => {
      this.snackBar.open('上传成功', '关闭', {duration: 2_000});
      dialogLoading.close();
    });
  }

  getFileUrl() {
    return this._fileItemService.getUrl(this.project.id, FileItemCategory.HomeVideo);
  }
}
