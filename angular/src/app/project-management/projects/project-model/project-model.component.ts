import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AppComponentBase} from '@shared/components/app-component-base';
import {ProjectDto, ProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import {FileItemService} from '@shared/service-proxies/file-item.service';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {FileItemCategory} from '@shared/AppEnums';
import {BimViewerComponent} from '@shared/components/bim-viewer/bim-viewer.component';
import {MatDialog} from '@node_modules/@angular/material';
import {AddSubDialogComponent} from '@app/project-management/plans/bind-sub-project/add-sub-dialog/add-sub-dialog.component';

@Component({
  selector: 'app-project-model',
  templateUrl: './project-model.component.html',
  styleUrls: ['./project-model.component.css'],
  animations: [appModuleAnimation()]
})
export class ProjectModelComponent extends AppComponentBase implements OnInit {
  @ViewChild('bimViewer') bimViewer: BimViewerComponent;
  project: ProjectDto;
  isRefreshModel = true;

  constructor(
    injector: Injector,
    private _projectService: ProjectServiceProxy,
    private fileItemService: FileItemService,
    private dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit() {
  }
  changeBimFile(event) {
    const loadingRef = this.openLoadingDialog(this.dialog);
    // 组织上传的内容
    this.isRefreshModel = false;
    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('FormFile', file, file.name);
    formData.append('RelationalId', this.project.id);
    formData.append('FileItemCategory', FileItemCategory.BimModel.toString());
    // 调用接口上传文件
    this.fileItemService.create(formData).subscribe((fileItem) => {
      loadingRef.close();
      // 传入新模型后会刷新
      this.bimViewer.list(fileItem.id);
      this.snackBar.open('上传Bim模型成功', '关闭', {duration: 2_000});
    });
  }

  onOptionSelected(event: ProjectDto) {
    this.isRefreshModel = false;
    this.project = event;
    const myTimer = setTimeout(() => {
      this.isRefreshModel = true;
      clearTimeout(myTimer);
    }, 600);
  }

  delete() {
    abp.message.confirm('确定删除本模型？', (result) => {
      if (result) {
        this._projectService.deleteBimModel(this.bimViewer.selectedBimModel.id).subscribe(() => {
          this.bimViewer.list();
          this.snackBar.open('删除模型成功', '关闭', {duration: 2_000});
        });
      }
    });
  }
}
