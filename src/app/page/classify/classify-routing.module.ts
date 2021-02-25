import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassifyPage } from './classify.page';

const routes: Routes = [
  {
    path: '',
    component: ClassifyPage
  },
  {
    path: 'goods-list', data: {preload: false},
    loadChildren: () => import('./goods-list/goods-list.module').then( m => m.GoodsListPageModule)
  },
  {
    path: 'goods-detail', data: {preload: false},
    loadChildren: () => import('./goods-detail/goods-detail.module').then( m => m.GoodsDetailPageModule)
  },
  {
      path: 'add-cart', data: {preload: false},
      loadChildren: () => import('./add-to-cart/add-to-cart.module').then( m => m.AddToCartPageModule)
  },  {
    path: 'brand-street',
    loadChildren: () => import('./brand-street/brand-street.module').then( m => m.BrandStreetPageModule)
  },
  {
    path: 'brand-classify',
    loadChildren: () => import('./brand-classify/brand-classify.module').then( m => m.BrandClassifyPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassifyPageRoutingModule {}
