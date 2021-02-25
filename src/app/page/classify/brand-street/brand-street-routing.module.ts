import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandStreetPage } from './brand-street.page';

const routes: Routes = [
  {
    path: '',
    component: BrandStreetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandStreetPageRoutingModule {}
