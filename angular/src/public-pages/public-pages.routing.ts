import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PublicComponent} from './public-pages.component';
import {SubProjectRelationalInfoComponent} from './sub-project-relational-info/sub-project-relational-info.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PublicComponent,
        children: [
          {path: 'relational-info', component: SubProjectRelationalInfoComponent},
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PublicRoutingModule {
}
