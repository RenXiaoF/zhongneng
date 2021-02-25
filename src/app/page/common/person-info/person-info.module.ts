import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonInfoPageRoutingModule } from './person-info-routing.module';

import { PersonInfoPage } from './person-info.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PersonInfoPageRoutingModule
  ],
  declarations: [PersonInfoPage]
})
export class PersonInfoPageModule {}
