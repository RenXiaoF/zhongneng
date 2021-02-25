import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandStreetPageRoutingModule } from './brand-street-routing.module';

import { BrandStreetPage } from './brand-street.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    BrandStreetPageRoutingModule
  ],
  declarations: [BrandStreetPage]
})
export class BrandStreetPageModule {}
