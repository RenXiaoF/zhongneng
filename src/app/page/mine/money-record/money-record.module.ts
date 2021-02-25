import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MoneyRecordPage } from './money-record.page';
import { PipesModule } from 'src/pipes/pipes.module'
const routes: Routes = [
  {
    path: '',
    component: MoneyRecordPage
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
  declarations: [MoneyRecordPage]
})
export class MoneyRecordPageModule {}
