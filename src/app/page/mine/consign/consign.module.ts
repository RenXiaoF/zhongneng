import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConsignPage } from './consign.page';
import { PipesModule } from 'src/pipes/pipes.module';
const routes: Routes = [
  {
    path: '',
    component: ConsignPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsignPage]
})
export class ConsignPageModule {}
