import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyConsumeorderPage } from './my-consumeorder.page';

const routes: Routes = [
  {
    path: '',
    component: MyConsumeorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyConsumeorderPageRoutingModule {}
