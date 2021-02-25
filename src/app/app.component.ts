import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ActionSheetController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Login } from '../services/Login';
import { GetPlatformService } from '../services/getPlatform';
// import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';
import {NativeService} from '../services';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public keyValue = false; // 键盘目前是关闭还是打开，默认关闭
  public lastTimeBackPress = 0;   // 上次点击的时间
  public timePeriodToExit = 2000; // 连续2s点击退出应用

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public loginServe: Login,
    public GetPlatformService: GetPlatformService,
    // public keyboard: NativeKeyboard,
    public actionsheetctrl: ActionSheetController,
    public modalCtrl: ModalController,
    public router: Router,
    public native: NativeService,
  ) {
    // console.time();
    this.initializeApp();
    this.exitApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {

      // this.statusBar.styleBlackOpaque(); // 浅色文本
      // this.statusBar.backgroundColorByHexString("#2d4966"); // 深色背景
      this.statusBar.backgroundColorByHexString('#fff'); // 浅色背景
      this.statusBar.styleDefault(); // 深色文本, 用于浅色背景
      this.splashScreen.hide();
      // 获取入口类型
      this.GetPlatformService.getEntryType();
      // 获取App版本号
      this.GetPlatformService.getLocalAppVersion();
    });
  }

  ngOnInit() {
    try {
      /**
       * safari开启隐身模式时，localStorage无法写入新的内容，
       * 并且会抛出异常导致js无法正常执行，最终页面无法正常加载
       */
      window.localStorage.foobar = 'foobar';
    } catch (_) {
      alert('本地储存写入错误，若为safari浏览器请关闭隐身模式浏览。');
    }

    // 用户从多公众号授权带上token，登录自己商城
    this.loginServe.multipleWechatLogin();

    // 解决 andriod 物理返回键  卡半屏的现象
    // this.loginServe.debugAndriod();
  }

  // 监听App物理返回键点击2次退出
  exitApp(){
      this.platform.backButton.subscribe(async () => {
          // 关闭键盘
          // try {
          //     if (this.keyValue){
          //         this.keyboard.hideMessengerKeyboard();
          //         this.keyValue = false;
          //         return;
          //     }
          // }catch (error) { console.log(error); }
          // 关闭 action sheet
          try{
              const element = await this.actionsheetctrl.getTop();
              if ( element ) {
                  element.dismiss();
                  return;
              }
          } catch ( error ) { console.log(error); }
          // 关闭modal
          try {
              const element = await this.modalCtrl.getTop();
              if (element) {
                  element.dismiss();
                  return;
              }
          } catch (error) { console.log(error); }
          if (this.router.url.indexOf('tabs') >= 0) {
              if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                  navigator['app'].exitApp(); // 退出APP
              } else {
                  this.native.showToastTips('再次点击退出应用');
                  this.lastTimeBackPress = new Date().getTime();
              }
          }
      });
  }
}
