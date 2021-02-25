import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FansDetailPageRoutingModule } from './fans-detail-routing.module';

import { FansDetailPage } from './fans-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FansDetailPageRoutingModule
  ],
  declarations: [FansDetailPage]
})
export class FansDetailPageModule {}
