import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassRomPageRoutingModule } from './class-rom-routing.module';

import { ClassRomPage } from './class-rom.page';
import { PipesModule } from 'src/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ClassRomPageRoutingModule
  ],
  declarations: [ClassRomPage]
})
export class ClassRomPageModule {}
