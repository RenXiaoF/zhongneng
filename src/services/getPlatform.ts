import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Utils } from './Utils';
import { NativeService } from './NativeService';
import { AppUpdate } from '@ionic-native/app-update/ngx';  // 检测app更新
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GetPlatformService {

  constructor(
    private device: Device,
    private native: NativeService,
    private AppVersion: AppVersion,
    private alertTips: AlertController,
    private appUpdate: AppUpdate
  ) {
  }

  /** 获取用户入口类型 */
  getEntryType() {
    let ua = window.navigator.userAgent.toLowerCase();
    Utils.localStorageSetItem('entryType', 'other');  // 默认，非微信、非app入口
    // 判断当前用户入口类型
    if (ua.indexOf('micromessenger') >= 0) {
      // this.native.presentAlert('微信入口');
      // 微信入口
      Utils.localStorageSetItem('entryType', 'weixin');
    } else {
      document.addEventListener('deviceready', () => {
        if (this.device.platform) {
          // this.native.presentAlert('app入口');
          // app入口
          Utils.localStorageSetItem('entryType', 'app');
        }
      }, false);
    }
    return Utils.localStorageGetItem('entryType');
  }
  /** 获取设备类型 */
  getDeviceType() {
    Utils.localStorageSetItem('deviceType', 'other');
    if (this.native.isIos()) {
      this.native.presentAlert('ios设备');
      // ios设备
      Utils.localStorageSetItem('deviceType', 'ios');
    }
    if (this.native.isAndroid()) {
      this.native.presentAlert('andriod设备');
      // andriod设备
      Utils.localStorageSetItem('deviceType', 'android');
    }
  }
  /** 获取本地app版本号 */
  getLocalAppVersion() {
    this.AppVersion.getVersionNumber().then(
      (res) => {
        Utils.localStorageSetItem('localVersion', res);
      }
    ).catch(
      (err) => {

      }
    );
  }
  /** 检测版本更新  弃用 */
  checkVersion() {
    let version;
    let localVersion;
    if (Utils.localStorageGetItem('versionInfo')) {
      version = Utils.localStorageGetItem('versionInfo').version;
    }
    localVersion = Utils.localStorageGetItem('localVersion');
    if (Utils.localStorageGetItem('entryType') === 'app') {
      if (version > localVersion && localVersion !== null) {
        this.upDateApp();
      }
    }
  }
  /** 弹出版本更新信息 弃用 */
  async upDateApp() {
    const appDownloadUrl = 'http:/www.gdsplx.com/apps/appUpdate/version.xml'; // 服务器app下载地址
    let msg = '你是否要更新到最新版？';
    const alertBox = await this.alertTips.create({
      header: '发现新版本',
      message: msg,
      buttons: [
        {
          text: '关闭',
          handler: () => {
            console.log('取消');
          }
        },
        {
          text: '是的',
          handler: () => {
            this.appUpdate.checkAppUpdate(appDownloadUrl).then(() => { }).catch((err) => { this.native.showToast(err.msg); });
          }
        }
      ]
    });
    await alertBox.present();
  }

}
