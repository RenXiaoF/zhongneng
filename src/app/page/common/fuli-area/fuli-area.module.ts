import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuliAreaPageRoutingModule } from './fuli-area-routing.module';

import { FuliAreaPage } from './fuli-area.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuliAreaPageRoutingModule,
    PipesModule
  ],
  declarations: [FuliAreaPage]
})
export class FuliAreaPageModule {}
