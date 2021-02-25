import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresellPageRoutingModule } from './presell-routing.module';

import { PresellPage } from './presell.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PresellPageRoutingModule,
  ],
  declarations: [PresellPage]
})
export class PresellPageModule {}
