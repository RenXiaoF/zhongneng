import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresellPage } from './presell.page';

const routes: Routes = [
  {
    path: '',
    component: PresellPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresellPageRoutingModule {}
