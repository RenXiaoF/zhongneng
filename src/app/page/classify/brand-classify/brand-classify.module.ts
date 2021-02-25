import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandClassifyPageRoutingModule } from './brand-classify-routing.module';

import { BrandClassifyPage } from './brand-classify.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    BrandClassifyPageRoutingModule
  ],
  declarations: [BrandClassifyPage]
})
export class BrandClassifyPageModule {}
