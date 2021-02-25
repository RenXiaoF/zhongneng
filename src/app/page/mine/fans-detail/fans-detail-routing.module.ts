import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FansDetailPage } from './fans-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FansDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FansDetailPageRoutingModule {}
