import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuliAreaPage } from './fuli-area.page';

const routes: Routes = [
  {
    path: '',
    component: FuliAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuliAreaPageRoutingModule {}
