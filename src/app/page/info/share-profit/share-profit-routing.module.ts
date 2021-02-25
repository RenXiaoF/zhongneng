import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareProfitPage } from './share-profit.page';

const routes: Routes = [
  {
    path: '',
    component: ShareProfitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareProfitPageRoutingModule {}
