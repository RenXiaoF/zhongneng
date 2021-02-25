import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BCoinAccountPage } from './bCoinAccount.page';

const routes: Routes = [
  {
    path: '',
    component: BCoinAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BCoinAccountPage]
})
export class BCoinAccountPageModule {}
