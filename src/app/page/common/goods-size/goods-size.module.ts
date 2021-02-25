import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoodsSizePageRoutingModule } from './goods-size-routing.module';

import { GoodsSizePage } from './goods-size.page';
import { PipesModule } from 'src/pipes/pipes.module'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoodsSizePageRoutingModule,
    PipesModule,

  ],
  declarations: [GoodsSizePage]
})
export class GoodsSizePageModule {}
