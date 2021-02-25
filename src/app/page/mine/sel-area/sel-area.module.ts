import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelAreaPageRoutingModule } from './sel-area-routing.module';

import { SelAreaPage } from './sel-area.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelAreaPageRoutingModule
  ],
  declarations: [SelAreaPage]
})
export class SelAreaPageModule {}
