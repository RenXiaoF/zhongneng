import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddToCartPage } from './add-to-cart.page';
import { PipesModule } from 'src/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: AddToCartPage
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
  declarations: [AddToCartPage]
})
export class AddToCartPageModule { }
