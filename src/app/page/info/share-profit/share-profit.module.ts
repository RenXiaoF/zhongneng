import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareProfitPageRoutingModule } from './share-profit-routing.module';

import { ShareProfitPage } from './share-profit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareProfitPageRoutingModule
  ],
  declarations: [ShareProfitPage]
})
export class ShareProfitPageModule {}
