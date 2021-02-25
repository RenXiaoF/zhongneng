import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZeroAreaPageRoutingModule } from './zero-area-routing.module';

import { ZeroAreaPage } from './zero-area.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZeroAreaPageRoutingModule,
      PipesModule
  ],
  declarations: [ZeroAreaPage]
})
export class ZeroAreaPageModule {}
