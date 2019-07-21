import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkshopLayoutServiceProxy, WorkshopTypeServiceProxy, WorkshopLayoutDto, GenerateOutput, WorkshopLayoutInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ModalDirective, AlertConfig } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';

export interface layoutStyle {
    value: string;
    viewValue: string;
}


@Component({
    selector: 'edit-workshop-modal',
    templateUrl: './edit-workshop.component.html',
    styleUrls: ['./edit-workshop.component.less'],
    animations: [appModuleAnimation()],
})
export class EditWorkshopComponent implements OnInit {
    @ViewChild('editWorkshopModal') modal: ModalDirective;
    active: boolean = false;
    flowLine: string;
    SaveBeamNum: boolean = null;
    layoutWays: layoutStyle[] = [
        { value: '横向布局', viewValue: '横向布局' }    //,
        // { value: '竖向布局', viewValue: '竖向布局' }
    ];
    GenerateOutputs = [];
    layoutWay: boolean = false;
    slayoutWay: boolean = false;
    form: WorkshopLayoutDto;
    loading: boolean = false;

    flag: boolean;
    constructor(
        private workshopTypeService: WorkshopTypeServiceProxy,
        private workshopLayoutService: WorkshopLayoutServiceProxy,
        public snackBar: MatSnackBar
    ) {

    }
    ngOnInit() {
        this.form = new WorkshopLayoutDto();
    }
    show(item): void {
        console.log(item);
        this.form = item;
        this.active = true;
        this.modal.show();
        this.autogeneration();
    }
    inputChange() {
        this.flag = false;
    }
    autogeneration() {
        this.flag = true;
        this.loading = true;
        this.layoutWay = false;
        this.slayoutWay = false;

        var input = new WorkshopLayoutInput();
        input.beamPedestal = this.form.beamPedestal;
        input.bindRebar = this.form.bindRebar;
        input.saveBeam = this.form.saveBeam;
        input.productionLine = this.form.productionLine;
        this.workshopLayoutService.generate(input)
            .pipe(finalize(() => {
            }))
            .subscribe((result: [GenerateOutput]) => {
                this.GenerateOutputs = result;
                if (this.form.layoutWay == '横向布局') {
                    if (this.form.saveBeam < 81) {
                        this.SaveBeamNum = true;
                        this.layoutWay = true;
                        this.slayoutWay = false;
                    } else {
                        this.SaveBeamNum = false;
                        this.layoutWay = true;
                        this.slayoutWay = false;
                    }
                } else {
                    this.SaveBeamNum = true;
                    this.slayoutWay = true;
                    this.layoutWay = false;
                }
                this.loading = false;
            });
    }
    cancel(): void {
        this.active = false;
        this.layoutWay = false;
        this.slayoutWay = false;
        this.form = new WorkshopLayoutDto();
        this.modal.hide();
    }
    close(): void {
        if (this.flag) {
            var html2canvas = require('html2canvas');
            var printDom = document.getElementById('printUpdateDiv');
            html2canvas(printDom,
                { height: printDom.scrollHeight }).then((canvas) => {
                    var image = canvas.toDataURL('image/jpeg');
                    this.save(image);
                });

        } else {
            this.snackBar.open('请先点击自动生成按钮', '提示', {
                duration: 2000,
                verticalPosition: 'top',
            });
        }

    }

    save(image: any): void {
        this.form.image = image;

        this.active = false;
        this.workshopLayoutService.update(this.form)
            .pipe(finalize(() => {
            }))
            .subscribe((result: WorkshopLayoutDto) => {
                if (result.id) {
                    this.layoutWay = false;
                    this.slayoutWay = false;
                    this.form = new WorkshopLayoutDto();
                    this.modal.hide();
                }
            });
    }
}
