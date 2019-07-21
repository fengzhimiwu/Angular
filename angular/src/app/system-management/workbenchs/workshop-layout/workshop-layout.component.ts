import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkshopLayoutServiceProxy, WorkshopTypeServiceProxy, PagedResultDtoOfWorkshopTypeDto, WorkshopLayoutDto, PagedResultDtoOfWorkshopLayoutDto } from '@shared/service-proxies/service-proxies';
import { CreateWorkshopComponent } from "./create-workshop/create-workshop.component"
import { EditWorkshopComponent } from "./edit-workshop/edit-workshop.component"
import { finalize } from 'rxjs/operators';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/components/paged-listing-component-base';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-workshop-layout',
  templateUrl: './workshop-layout.component.html',
  styleUrls: ['./workshop-layout.component.css'],
  animations: [appModuleAnimation()]
})
export class WorkshopLayoutComponent extends PagedListingComponentBase<WorkshopLayoutDto> {
  
  @ViewChild('createWorkshopModal') createWorkshopModal: CreateWorkshopComponent;
  @ViewChild('editWorkshopModal') editWorkshopModal: EditWorkshopComponent;

  flowLine: string;
  layoutItem = [];
  constructor(
    injector: Injector,
    private workshopLayoutService: WorkshopLayoutServiceProxy,
    route: ActivatedRoute
  ) {
    super(injector);
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.workshopLayoutService.getAll(0, 100)
    .pipe(finalize(() => {
      finishedCallback();
    }))
    .subscribe((result: PagedResultDtoOfWorkshopLayoutDto) => {
      this.layoutItem = result.items;
      this.showPaging(result, pageNumber);
    });
  }

  protected delete(entity: WorkshopLayoutDto): void {
    abp.message.confirm(
      '删除生产线布局 ' + entity.layoutName + '?',
      (result: boolean) => {
          if (result) {
              this.workshopLayoutService.delete(entity.id)
                  .subscribe(() => {
                    this.snackBar.open('删除生产线布局: ' + entity.layoutName, '关闭', {duration: 2000});
                      this.refresh();
                  });
          }
      }
    );
  }

  addParameter(): void {
    this.createWorkshopModal.show();
  }
  editLayout(item): void {
    this.editWorkshopModal.show(item);
  }
  form = {
    productionLine: null,
    beamPiece: null,
    systemBeam: null,
    saveBeam: null,
  }
  close(): void {
    this.form = {
      productionLine: null,
      beamPiece: null,
      systemBeam: null,
      saveBeam: null,
    }
  }
}
