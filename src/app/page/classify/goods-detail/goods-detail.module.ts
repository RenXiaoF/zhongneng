import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GoodsDetailPage } from './goods-detail.page';
// import { DirectivesModule } from 'src/directives/directives.module';
import { PipesModule } from 'src/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: GoodsDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    // SharedModule,
    // DirectivesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GoodsDetailPage]
})
export class GoodsDetailPageModule {}
