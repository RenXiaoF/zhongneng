import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZeroAreaPage } from './zero-area.page';

const routes: Routes = [
  {
    path: '',
    component: ZeroAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZeroAreaPageRoutingModule {}
