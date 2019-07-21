import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {
  PagedResultDtoOfSubProjectStageLogDto,
  ProductionServiceProxy,
  SubProjectDto,
  SubProjectStageLogDto
} from '@shared/service-proxies/service-proxies';
import {Router} from '@node_modules/@angular/router';
import {WorkshopHelper} from '@shared/helpers/workshop.helper';


@Component({
  selector: 'app-sub-log-preview-dialog',
  templateUrl: './sub-log-preview-dialog.component.html',
  styleUrls: ['./sub-log-preview-dialog.component.css']
})
export class SubLogPreviewDialogComponent implements OnInit {
  WorkshopHelper = WorkshopHelper;
  logs: SubProjectStageLogDto[];

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<SubLogPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubProjectDto,
    private  productionService: ProductionServiceProxy,
  ) {
  }

  ngOnInit() {
    this.productionService.getSubProjectStageLog(this.data.id).subscribe(res => this.logs = res.items);
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  openSubProjectLog() {
    const url = this.router.createUrlTree(['/app/home/relational-info', {backUrl: this.router.url}],
      {queryParams: {id: this.data.id}});
    window.open(url.toString());
  }
}
