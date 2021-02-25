import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PswSettingPage } from './psw-setting.page';

const routes: Routes = [
  {
    path: '',
    component: PswSettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PswSettingPage]
})
export class PswSettingPageModule {}
