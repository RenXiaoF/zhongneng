import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ACoinAccountPage } from './aCoinAccount.page';

const routes: Routes = [
  {
    path: '',
    component: ACoinAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ACoinAccountPage]
})
export class ACoinAccountPageModule {}
