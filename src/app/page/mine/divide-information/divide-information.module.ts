import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DivideInformationPage } from './divide-information.page';

const routes: Routes = [
  {
    path: '',
    component: DivideInformationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DivideInformationPage]
})
export class DivideInformationPageModule {}
