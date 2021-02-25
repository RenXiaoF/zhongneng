import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandClassifyPage } from './brand-classify.page';

const routes: Routes = [
  {
    path: '',
    component: BrandClassifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandClassifyPageRoutingModule {}
