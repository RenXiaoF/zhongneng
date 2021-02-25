import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelAreaPage } from './sel-area.page';

const routes: Routes = [
  {
    path: '',
    component: SelAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelAreaPageRoutingModule {}
