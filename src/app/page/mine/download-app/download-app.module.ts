import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DownloadAppPage } from './download-app.page';
import { PipesModule } from 'src/pipes/pipes.module'

const routes: Routes = [
  {
    path: '',
    component: DownloadAppPage
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
  declarations: [DownloadAppPage]
})
export class DownloadAppPageModule {}
