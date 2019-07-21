import {Component, Injector, OnInit} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/components/paged-listing-component-base';
import {FileItem, FileItemService} from '@shared/service-proxies/file-item.service';
import {FileItemCategory} from '@shared/AppEnums';
import {debounceTime, distinctUntilChanged, finalize, switchMap} from '@node_modules/rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {
  GenerateStatementInput,
  PagedResultDtoOfSubProjectDto,
  ProjectDto,
  StatementServiceProxy,
  SubProjectDto,
} from '@shared/service-proxies/service-proxies';
import {FormControl} from '@node_modules/@angular/forms';
import {DomSanitizer, SafeUrl} from '@node_modules/@angular/platform-browser';
import {AppConsts} from '@shared/AppConsts';
import {switchIn} from '@shared/animations/data-animation';
import {MatBottomSheet, MatDialog} from '@node_modules/@angular/material';
import {ChooseStatementAssignmentBottomComponent} from '@app/project-management/statements/choose-statement-assignment-bottom/choose-statement-assignment-bottom.component';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css'],
  animations: [appModuleAnimation(), switchIn]
})
export class StatementsComponent extends PagedListingComponentBase<FileItem> implements OnInit {
  // 报表模板
  allFileItems: FileItem[];
  filteredFileItems: FileItem[];
  // 选择要生成报表的构件
  selectedSubProject: SubProjectDto;
  // 项目及构件
  project: ProjectDto;
  searchSubControl = new FormControl('');
  subProjects: SubProjectDto[];
  // word预览地址
  safeUrl: SafeUrl;

  constructor(
    injector: Injector,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private _fileItemService: FileItemService,
    private _statementService: StatementServiceProxy,
    private sanitizer: DomSanitizer) {
    super(injector);
  }

  ngOnInit(): void {
    // 构件搜索管道定义
    this.searchSubControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(v => this._statementService.getAll(this.project ? this.project.id : undefined, undefined,
        undefined, v,  undefined, 0, 10))
    ).subscribe((result: PagedResultDtoOfSubProjectDto) => {
      this.subProjects = result.items;
    });
    super.ngOnInit();
    // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(wordSrc);
  }

  openBottomSheet(f: FileItem, isDownloadMode: boolean) {
    this.bottomSheet.open(ChooseStatementAssignmentBottomComponent, {
      data: {
        fileItem: f,
        isDownloadMode: isDownloadMode,
        subProject: this.selectedSubProject
      }
    });
  }

  // 打开网上预览word工具
  openOnlineOffice(f: FileItem, s: SubProjectDto) {
    const input = new GenerateStatementInput({fileItemId: f.id, subProjectId: s.id});
    this._statementService.generateStatement(input).subscribe((result) => {
      // http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls
      const wordSrc = `https://view.officeapps.live.com/op/view.aspx?src=${AppConsts.remoteServiceBaseUrl}/${result}`;
      window.open(wordSrc);
    });
  }

  // 模板搜索
  searchTemplateStart(searchString: string) {
    if (searchString) {
      this.filteredFileItems = this.allFileItems.filter(v => v.fileName.includes(searchString));
    } else {
      this.filteredFileItems = this.allFileItems;
    }
  }

  // 报表下载
  download(f: FileItem, s: SubProjectDto) {
    const loadingRef = this.openLoadingDialog(this.dialog);
    const input = new GenerateStatementInput({fileItemId: f.id, subProjectId: s.id});
    this._statementService.generateStatement(input).subscribe((result) => {
      location.href = `${AppConsts.remoteServiceBaseUrl}/${result}`;
      loadingRef.close();
    });
  }

  // 模板列表获取
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._fileItemService.getAll(FileItemCategory.StatementTemplate).pipe(
      finalize(() => finishedCallback())
    ).subscribe(result => {
      this.allFileItems = result.items;
      this.filteredFileItems = this.allFileItems;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: FileItem): void {
  }

}
