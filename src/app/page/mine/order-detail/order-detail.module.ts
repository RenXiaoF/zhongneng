import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { OrderDetailPage } from './order-detail.page';

import { PipesModule } from 'src/pipes/pipes.module';
const routes: Routes = [
  {
    path: '',
    component: OrderDetailPage
  }
];
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OrderDetailPage,
  ],
  entryComponents: [
  ]
})
export class OrderDetailPageModule {}
