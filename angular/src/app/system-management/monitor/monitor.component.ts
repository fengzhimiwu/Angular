import { Component, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.less'],
    animations: [appModuleAnimation()]
})
export class MonitorComponent implements OnInit {
    constructor() { }
    ngOnInit() {
    }

} 