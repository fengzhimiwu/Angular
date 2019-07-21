import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceProxyModule} from '@shared/service-proxies/service-proxy.module';
import {SharedModule} from '@shared/shared.module';
import {LayoutModule} from '@app/layout/layout.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    // Register business logic modules
    LayoutModule,
  ]
})
export class AppModule {
}
