import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrationAgreementPage } from './registration-agreement.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationAgreementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrationAgreementPage]
})
export class RegistrationAgreementPageModule {}
