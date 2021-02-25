import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonInfoPage } from './person-info.page';

const routes: Routes = [
  {
    path: '',
    component: PersonInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonInfoPageRoutingModule {}
