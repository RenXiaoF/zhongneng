import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BossOrderPage } from './boss-order.page';

const routes: Routes = [
  {
    path: '',
    component: BossOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BossOrderPageRoutingModule {}
