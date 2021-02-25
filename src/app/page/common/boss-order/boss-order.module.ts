import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BossOrderPageRoutingModule } from './boss-order-routing.module';

import { BossOrderPage } from './boss-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BossOrderPageRoutingModule
  ],
  declarations: [BossOrderPage]
})
export class BossOrderPageModule {}
