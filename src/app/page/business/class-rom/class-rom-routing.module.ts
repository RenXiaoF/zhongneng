import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassRomPage } from './class-rom.page';

const routes: Routes = [
  {
    path: '',
    component: ClassRomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassRomPageRoutingModule {}
