import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoodsListPageRoutingModule } from './goods-list-routing.module';

import { GoodsListPage } from './goods-list.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    GoodsListPageRoutingModule
  ],
  declarations: [GoodsListPage]
})
export class GoodsListPageModule {}
