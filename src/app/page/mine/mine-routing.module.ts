import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinePage } from './mine.page';

const routes: Routes = [
  {
    path: '',
    component: MinePage
  },
  {
    path: 'myconsumeorder',
    loadChildren: () => import('./my-consumeorder/my-consumeorder.module').then( m => m.MyConsumeorderPageModule)
  },
  {
    path: 'set',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
  },
  {
    path: 'sel-area',
    loadChildren: () => import('./sel-area/sel-area.module').then( m => m.SelAreaPageModule)
  },  {
    path: 'boss-order-detail',
    loadChildren: () => import('./boss-order-detail/boss-order-detail.module').then( m => m.BossOrderDetailPageModule)
  },
  {
    path: 'fans-detail',
    loadChildren: () => import('./fans-detail/fans-detail.module').then( m => m.FansDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinePageRoutingModule {}
