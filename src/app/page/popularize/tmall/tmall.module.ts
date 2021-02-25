import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TmallPageRoutingModule } from './tmall-routing.module';

import { TmallPage } from './tmall.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    TmallPageRoutingModule
  ],
  declarations: [TmallPage]
})
export class TmallPageModule {}
