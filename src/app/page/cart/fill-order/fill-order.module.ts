import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FillOrderPage } from './fill-order.page';
import { PipesModule } from 'src/pipes/pipes.module';
const routes: Routes = [
  {
    path: '',
    component: FillOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FillOrderPage]
})
export class FillOrderPageModule {}
