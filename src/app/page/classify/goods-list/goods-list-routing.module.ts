import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoodsListPage } from './goods-list.page';

const routes: Routes = [
  {
    path: '',
    component: GoodsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsListPageRoutingModule {}
