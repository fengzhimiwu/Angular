import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicComponent} from './public-pages.component';
import {PublicRoutingModule} from './public-pages.routing';
import {SubProjectRelationalInfoComponent} from './sub-project-relational-info/sub-project-relational-info.component';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTooltipModule
} from '@node_modules/@angular/material';
import {SharedModule} from '@shared/shared.module';

/** 本模块适用于公共部分，即不需要登陆的部分。例如查询构件的信息 */
@NgModule({
  declarations: [
    PublicComponent,
    SubProjectRelationalInfoComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatToolbarModule,
  ]
})
export class PublicPagesModule { }
