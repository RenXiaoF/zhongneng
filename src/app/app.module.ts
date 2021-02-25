import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Api } from 'src/services/api';
import { NativeService } from 'src/services/NativeService';
import { Utils } from 'src/services/Utils';
import { User } from 'src/services/User';
import { InterceptorService } from '../services/interceptor.service';
import { GlobalData } from '../services';

import { PipesModule } from '../pipes/pipes.module';
import { NewMsgCode } from 'src/services/NewMsgCode';
import { AddToCartPageModule } from './page/classify/add-to-cart/add-to-cart.module';
import { ZeroAreaPageModule } from './page/common/zero-area/zero-area.module';
import { SelAreaPageModule } from './page/mine/sel-area/sel-area.module';
import { MyaddressPageModule } from './page/mine/myaddress/myaddress.module';
import { SharePageModule } from './page/mine/share/share.module';
import { SignInPageModule } from './page/login/sign-in/sign-in.module';
import { UploadService } from 'src/services/UploadService';
import { IdentityPageModule } from './page/mine/identity/identity.module';
import { FormsModule } from '@angular/forms';
import { NewaddressPageModule } from './page/mine/newaddress/newaddress.module';
import { GoodsSizePageModule } from './page/common/goods-size/goods-size.module';
import { BusinessPageModule } from './page/business/business.module';
import { GetPlatformService } from 'src/services/getPlatform';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { SignUpPageModule } from './page/mine/sign-up/sign-up.module';
// import { FileTransfer } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file/ngx';
import { Alipay } from '@ionic-native/alipay/ngx';
import { Wechat } from '@ionic-native/wechat/ngx';
// import { Clipboard } from '@ionic-native/clipboard/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios',  // 配置android ios用统一的样式
      backButtonText: ''  // 修改默认返回文字
    }),
    AppRoutingModule,
    PipesModule,
    FormsModule,
    AddToCartPageModule,
    ZeroAreaPageModule,
    MyaddressPageModule,
    NewaddressPageModule,
    SelAreaPageModule,
    SharePageModule,
    SignInPageModule,
    IdentityPageModule,
    GoodsSizePageModule,
    BusinessPageModule,
    SignUpPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Api,
    Utils,
    NativeService,
    User,
    NewMsgCode,
    GlobalData,
    UploadService,
    AppUpdate,
    AppVersion,
    GetPlatformService,
    Device,
    // FileTransfer,
    // File,
    Alipay,
    Wechat,
    // Clipboard,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
