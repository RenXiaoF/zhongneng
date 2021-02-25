import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartPage } from './cart.page';

const routes: Routes = [
  {
    path: '',
    component: CartPage
  },
  {
    path: 'fillorder',
    loadChildren: () => import('./fill-order/fill-order.module').then( m => m.FillOrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartPageRoutingModule {}
