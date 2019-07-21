import {NgModule} from '@node_modules/@angular/core';
import {TopBarComponent} from '@app/layout/topbar/topbar.component';
import {SideBarUserAreaComponent} from '@app/layout/sidebar-user-area/sidebar-user-area.component';
import {SideBarNavComponent} from '@app/layout/sidebar-nav/sidebar-nav.component';
import {SideBarFooterComponent} from '@app/layout/sidebar-footer/sidebar-footer.component';
import {RightSideBarComponent} from '@app/layout/right-sidevar/right-sidebar.component';
import {ChatBoxComponent} from '@app/layout/right-sidevar/chat-box/chat-box.component';
import {CommonModule} from '@node_modules/@angular/common';
import {FormsModule} from '@node_modules/@angular/forms';
import {RouterModule} from '@node_modules/@angular/router';
import {SidebarNavExpandableDirective} from '@app/layout/sidebar-nav/sidebar-nav-expandable.directive';
import {
  MatBadgeModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatTabsModule, MatMenuModule, MatIconModule, MatButtonModule
} from '@node_modules/@angular/material';
import {MatRippleModule} from '@angular/material/core';
import {ModalModule} from '@node_modules/ngx-bootstrap';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule,
    SharedModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
  ],
  declarations: [
    TopBarComponent,
    SideBarUserAreaComponent,
    SideBarNavComponent,
    SideBarFooterComponent,
    RightSideBarComponent,
    SidebarNavExpandableDirective,
    ChatBoxComponent
  ],
  exports: [
    TopBarComponent,
    SideBarUserAreaComponent,
    SideBarNavComponent,
    SideBarFooterComponent,
    RightSideBarComponent,
  ]
})
export class LayoutModule {
}

