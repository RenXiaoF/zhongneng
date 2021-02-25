import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarterAreaPageRoutingModule } from './barter-area-routing.module';

import { BarterAreaPage } from './barter-area.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarterAreaPageRoutingModule,
    PipesModule
  ],
  declarations: [BarterAreaPage]
})
export class BarterAreaPageModule {}
