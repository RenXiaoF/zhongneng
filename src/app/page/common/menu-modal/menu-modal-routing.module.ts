import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuModalPage } from './menu-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MenuModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuModalPageRoutingModule {}
