import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarterAreaPage } from './barter-area.page';

const routes: Routes = [
  {
    path: '',
    component: BarterAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarterAreaPageRoutingModule {}
