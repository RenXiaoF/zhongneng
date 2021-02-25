import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BossAreaPage } from './boss-area.page';

const routes: Routes = [
  {
    path: '',
    component: BossAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BossAreaPageRoutingModule {}
