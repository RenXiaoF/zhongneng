import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillOrderPage } from './fill-order.page';

const routes: Routes = [
  {
    path: '',
    component: FillOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillOrderPageRoutingModule {}
