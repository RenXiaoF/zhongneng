import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BossOrderDetailPage } from './boss-order-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BossOrderDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BossOrderDetailPageRoutingModule {}
