import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/pipes/pipes.module';


import { BossOrderDetailPageRoutingModule } from './boss-order-detail-routing.module';

import { BossOrderDetailPage } from './boss-order-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    BossOrderDetailPageRoutingModule
  ],
  declarations: [BossOrderDetailPage]
})
export class BossOrderDetailPageModule {}
