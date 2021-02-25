import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from 'src/models/CustomPreloadingStrategy';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: '', data: { preload: true },
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home', data: { preload: true },
    loadChildren: () => import('./page/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'classify', data: { preload: false },
    loadChildren: () => import('./page/classify/classify.module').then(m => m.ClassifyPageModule)
  },
  {
    path: 'cart', data: { preload: false },
    loadChildren: () => import('./page/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'mine', data: { preload: false },
    loadChildren: () => import('./page/mine/mine.module').then(m => m.MinePageModule)
  },
  {
    path: 'goods-list', data: { preload: false },
    loadChildren: () => import('./page/classify/goods-list/goods-list.module').then(m => m.GoodsListPageModule)
  },
  {
    path: 'goods-detail', data: { preload: false },
    loadChildren: () => import('./page/classify/goods-detail/goods-detail.module').then(m => m.GoodsDetailPageModule)
  },
  {
    path: 'share-profit', data: { preload: false },
    loadChildren: () => import('./page/info/share-profit/share-profit.module').then(m => m.ShareProfitPageModule)
  },
  {
    path: 'sign-in', data: { preload: false },
    loadChildren: () => import('./page/login/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'boss-area', data: { preload: false },
    loadChildren: () => import('./page/common/boss-area/boss-area.module').then(m => m.BossAreaPageModule)
  },
  {
    path: 'zero-area', data: { preload: false },
    loadChildren: () => import('./page/common/zero-area/zero-area.module').then(m => m.ZeroAreaPageModule)
  },
  {
    path: 'barter-area', data: { preload: false },
    loadChildren: () => import('./page/common/barter-area/barter-area.module').then(m => m.BarterAreaPageModule)
  },
  {
    path: 'fuli-area', data: { preload: false },
    loadChildren: () => import('./page/common/fuli-area/fuli-area.module').then(m => m.FuliAreaPageModule)
  },
  {
    path: 'fill-order', data: { preload: false },
    loadChildren: () => import('../app/page/cart/fill-order/fill-order.module').then(m => m.FillOrderPageModule)
  },
  {
    path: 'place-order', data: { preload: false },
    loadChildren: () => import('../app/page/cart/place-order/place-order.module').then(m => m.PlaceOrderPageModule)
  },
  {
    path: 'boss-order', data: { preload: false },
    loadChildren: () => import('./page/common/boss-order/boss-order.module').then(m => m.BossOrderPageModule)
  },
  {
    path: 'menu-modal', data: { preload: false },
    loadChildren: () => import('./page/common/menu-modal/menu-modal.module').then(m => m.MenuModalPageModule)
  },
  {
    path: 'login', data: { preload: false },
    loadChildren: () => import('./page/login/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'myconsumeorder', data: { preload: false },
    loadChildren: () => import('./page/mine/my-consumeorder/my-consumeorder.module').then(m => m.MyConsumeorderPageModule)
  },
  {
    path: 'set', data: { preload: false },
    loadChildren: () => import('./page/mine/set/set.module').then(m => m.SetPageModule)
  },
  {
    path: 'after-market', data: { preload: false },
    loadChildren: () => import('./page/mine/aftermarket/aftermarket.module').then(m => m.AftermarketPageModule)
  },
  {
    path: 'sharecode', data: { preload: false },
    loadChildren: () => import('./page/mine/share-code/share-code.module').then(m => m.ShareCodePageModule)
  },
  {
    path: 'pswsetting', data: { preload: false },
    loadChildren: () => import('./page/mine/psw-setting/psw-setting.module').then(m => m.PswSettingPageModule)
  },
  {
    path: 'changepsw', data: { preload: false },
    loadChildren: () => import('./page/mine/change-psw/change-psw.module').then(m => m.ChangePswPageModule)
  },
  {
    path: 'bankcard', data: { preload: false },
    loadChildren: () => import('./page/mine/bank-card/bank-card.module').then(m => m.BankCardPageModule)
  },
  {
    path: 'addcard', data: { preload: false },
    loadChildren: () => import('./page/mine/addcard/addcard.module').then(m => m.AddcardPageModule)
  },
  {
    path: 'identity', data: { preload: false },
    loadChildren: () => import('./page/mine/identity/identity.module').then(m => m.IdentityPageModule)
  },
  {
    path: 'sel-area', data: { preload: false },
    loadChildren: () => import('./page/mine/sel-area/sel-area.module').then(m => m.SelAreaPageModule)
  },
  {
    path: 'newaddress', data: { preload: false },
    loadChildren: () => import('./page/mine/newaddress/newaddress.module').then(m => m.NewaddressPageModule)
  },
  {
    path: 'myaddress', data: { preload: false },
    loadChildren: () => import('./page/mine/myaddress/myaddress.module').then(m => m.MyaddressPageModule)
  },
  {
    path: 'downloadapp', data: { preload: false },
    loadChildren: () => import('./page/mine/download-app/download-app.module').then(m => m.DownloadAppPageModule)
  },
  {
    path: 'withdraw', data: { preload: false },
    loadChildren: () => import('./page/mine/withdraw/withdraw.module').then(m => m.WithdrawPageModule)
  },
  {
    path: 'myfans', data: { preload: false },
    loadChildren: () => import('./page/mine/my-fans/my-fans.module').then(m => m.MyFansPageModule)
  },
  {
    path: 'commission', data: { preload: false },
    loadChildren: () => import('./page/mine/commission/commission.module').then(m => m.CommissionPageModule)
  },
  {
    path: 'consignOrder', data: { preload: false },
    loadChildren: () => import('./page/mine/consign/consign.module').then(m => m.ConsignPageModule)
  },
  {
    path: 'fac-buy', data: { preload: false },
    loadChildren: () => import('./page/mine/facbuy/facbuy.module').then(m => m.FacbuyPageModule)
  },
  {
    path: 'cashdetail', data: { preload: false },
    loadChildren: () => import('./page/mine/cashdetail/cashdetail.module').then(m => m.CashdetailPageModule)
  },
  {
    path: 'share', data: { preload: false },
    loadChildren: () => import('./page/mine/share/share.module').then(m => m.SharePageModule)
  }, {
    path: 'detail', data: { preload: false },
    loadChildren: () => import('./page/common/detail/detail.module').then(m => m.DetailPageModule)
  }, {
    path: 'order-detail', data: { preload: false },
    loadChildren: () => import('./page/mine/order-detail/order-detail.module').then(m => m.OrderDetailPageModule)
  }, {
    path: 'aftersale', data: { preload: false },
    loadChildren: () => import('./page/mine/after-sale/after-sale.module').then(m => m.AfterSalePageModule)
  }, {
    path: 'after-sale-process', data: { preload: false },
    loadChildren: () => import('./page/mine/after-sale-process/after-sale-process.module').then(m => m.AfterSaleProcessPageModule)
  }, {
    path: 'divideinformation', data: { preload: false },
    loadChildren: () => import('./page/mine/divide-information/divide-information.module').then(m => m.DivideInformationPageModule)
  }, {
    path: 'distribut', data: { preload: false },
    loadChildren: () => import('./page/mine/distributAccount/distributAccount.module').then(m => m.DistributAccountPageModule)
  },
  {
    path: 'goods-size',
    loadChildren: () => import('./page/common/goods-size/goods-size.module').then(m => m.GoodsSizePageModule)
  },
  {
    path: 'business',
    loadChildren: () => import('./page/business/business.module').then(m => m.BusinessPageModule)
  },
  {
    path: 'boss-detail',
    loadChildren: () => import('./page/mine/boss-order-detail/boss-order-detail.module').then(m => m.BossOrderDetailPageModule)
  },
  {
    path: 'money-record', data: { preload: false },
    loadChildren: () => import('./page/mine/money-record/money-record.module').then(m => m.MoneyRecordPageModule)
  },
  {
    path: 'sign-up', data: { preload: false },
    loadChildren: () => import('./page/mine/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'class-rom', data: { preload: false },
    loadChildren: () => import('./page/business/class-rom/class-rom.module').then(m => m.ClassRomPageModule)
  },
  {
    path: 'recommended-course', data: { preload: false },
    loadChildren: () => import('./page/business/recommended-course/recommended-course.module').then(m => m.RecommendedCoursePageModule)
  },
  {
    path: 'course-detail', data: { preload: false },
    loadChildren: () => import('./page/business/course-detail/course-detail.module').then(m => m.CourseDetailPageModule)
  },
  {
    path: 'account', data: { preload: false },
    loadChildren: () => import('./page/mine/account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'bcoin', data: { preload: false },
    loadChildren: () => import('./page/mine/bCoinAccount/bCoinAccount.module').then(m => m.BCoinAccountPageModule)
  },
  {
    path: 'acoin', data: { preload: false },
    loadChildren: () => import('./page/mine/aCoinAccount/aCoinAccount.module').then(m => m.ACoinAccountPageModule)
  },
  {
    path: 'points', data: { preload: false },
    loadChildren: () => import('./page/mine/pointsAccount/pointsAccount.module').then(m => m.PointsAccountPageModule)
  },
  {
    path: 'notice', data: { preload: false },
    loadChildren: () => import('./page/mine/notice/notice.module').then(m => m.NoticePageModule)
  },
  {
    path: 'business', data: { preload: false },
    loadChildren: () => import('./page/business/business.module').then(m => m.BusinessPageModule)
  },
  {
    path: 'brand-street',
    loadChildren: () => import('./page/classify/brand-street/brand-street.module').then( m => m.BrandStreetPageModule)
  },
  {
    path: 'brand-classify',
    loadChildren: () => import('./page/classify/brand-classify/brand-classify.module').then( m => m.BrandClassifyPageModule)
  },
  {
    path: 'fans-detail',
    loadChildren: () => import('./page/mine/fans-detail/fans-detail.module').then( m => m.FansDetailPageModule)
  },  {
    path: 'tmall',
    loadChildren: () => import('./page/popularize/tmall/tmall.module').then( m => m.TmallPageModule)
  },
  {
    path: 'presell',
    loadChildren: () => import('./page/common/presell/presell.module').then( m => m.PresellPageModule)
  },
  {
    path: 'application-agent',
    loadChildren: () => import('./page/common/application-agent/application-agent.module').then( m => m.ApplicationAgentPageModule)
  },
  {
    path: 'person-info',
    loadChildren: () => import('./page/common/person-info/person-info.module').then( m => m.PersonInfoPageModule)
  },
  {
    path: 'guide',
    loadChildren: () => import('./page/common/guide/guide.module').then( m => m.GuidePageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy })
  ],
  providers: [
    CustomPreloadingStrategy,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
