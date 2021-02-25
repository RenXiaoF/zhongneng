import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home', data: {preload: true},
        loadChildren: () => import('../page/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'classify', data: {preload: true},
        loadChildren: () => import('../page/classify/classify.module').then(m => m.ClassifyPageModule)
      },
      {
        path: 'active', data: {preload: true},
        loadChildren: () => import('../page/common/boss-area/boss-area.module').then(m => m.BossAreaPageModule)
      },
      {
        path: 'cart', data: {preload: true},
        loadChildren: () => import('../page/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'mine', data: {preload: true},
        loadChildren: () => import('../page/mine/mine.module').then(m => m.MinePageModule)
      },
      // {
      //   path: 'business', data: {preload: true},
      //   loadChildren: () => import('../page/business/business-routing.module').then(m => m.BusinessPageRoutingModule)
      // },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
