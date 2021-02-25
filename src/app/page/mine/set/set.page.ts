import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeService, User, Utils, Api } from 'src/services/index';
import { NavController, AlertController } from '@ionic/angular';
declare var window: any;


@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit {

  public version: any;
  public can_show = true;

  constructor(
    private router: Router,
    public user: User,
    public native: NativeService,
    public nav: NavController,
    private api: Api,
    public utils: Utils,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.getAppVersion();
  }
  /** 获取线上最新的版本号 */
  getAppVersion() {
    this.api.get('User/getAppVersion').subscribe(
      (res: any) => {
        if (res.status == 200) {
          console.log(res);

          this.version = res.data.appversion['0'];
          //   alert('111'+res.data); // 1105
          document.addEventListener('deviceready', () => {
            // 插件1
            let versionCode = window.AppVersion.version;
            //   alert('222'+versionCode); // 0.11.5
            this.can_show = (this.version == versionCode) ? false : true;
          });
        }
      },
      err => {
        console.error('ERROR', err);
      }
    );
  }

  /** 返回上一级页面(主页面) */
  goback() {
    this.router.navigate(['tabs/mine']);
    // this.nav.navigateRoot(['/tabs/tab-my']);

  }
  /** 清除缓存数据 */
  clearData() {
    // 清除缓存数据
    window.localStorage.clear();
    this.native.showToast('清除缓存成功', 1000);
  }
  /** 跳到关于我们的页面 */
  aboutUs() {
    this.router.navigate(['productagreement']);
  }
  /** 检测版本更新 */
  checkVersion() {
    if (this.can_show) {
      this.presentAlertConfirm();
    }
  }

  /** 是否更新的弹框 */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'app版本更新',
      message: '<strong>已有新版本，是否更新?</strong>',
      buttons: [
        {
          text: '以后再说',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.alertController.dismiss();
          }
        }, {
          text: '立即更新',
          handler: () => {
            this.alertController.dismiss();
            Utils.testAppVersion();
          }
        }
      ]
    });

    await alert.present();
  }

  /**  登录退出 */
  logout() {
    this.user.logout();
    this.native.showToast('退出成功', 1000);
    this.router.navigate(['login']);
  }
}
