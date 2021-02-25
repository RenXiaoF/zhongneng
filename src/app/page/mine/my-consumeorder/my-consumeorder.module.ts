import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyConsumeorderPageRoutingModule } from './my-consumeorder-routing.module';

import { MyConsumeorderPage } from './my-consumeorder.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
      PipesModule,
    MyConsumeorderPageRoutingModule
  ],
  declarations: [MyConsumeorderPage]
})
export class MyConsumeorderPageModule {}
