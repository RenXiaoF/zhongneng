import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BossAreaPageRoutingModule } from './boss-area-routing.module';

import { BossAreaPage } from './boss-area.page';

import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BossAreaPageRoutingModule,
    PipesModule
  ],
  declarations: [BossAreaPage]
})
export class BossAreaPageModule {}
