import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FillOrderPageRoutingModule } from './fill-order-routing.module';

import { FillOrderPage } from './fill-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FillOrderPageRoutingModule
  ],
  declarations: [FillOrderPage]
})
export class FillOrderPageModule {}
