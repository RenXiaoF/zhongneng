import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AftermarketPage } from './aftermarket.page';
import { PipesModule } from 'src/pipes/pipes.module';
// import { DirectivesModule } from 'src/directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: AftermarketPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    // DirectivesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AftermarketPage]
})
export class AftermarketPageModule {}
