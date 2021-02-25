import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoodsSizePage } from './goods-size.page';

const routes: Routes = [
  {
    path: '',
    component: GoodsSizePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsSizePageRoutingModule {}
