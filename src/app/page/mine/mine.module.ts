import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinePageRoutingModule } from './mine-routing.module';

import { MinePage } from './mine.page';
import { PipesModule } from 'src/pipes/pipes.module'
// import { DirectivesModule } from 'src/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinePageRoutingModule,
    PipesModule,
    // DirectivesModule
  ],
  declarations: [MinePage]
})
export class MinePageModule {}
