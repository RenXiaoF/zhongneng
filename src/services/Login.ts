import { Injectable } from '@angular/core';
import { Api, NativeService, Utils, WechatConfig, GlobalData } from './index';
import { APP_CONFIG } from './Constants';
import { Platform, AlertController, ModalController, NavController, ActionSheetController } from '@ionic/angular';
import {SignInPage} from '../app/page/login/sign-in/sign-in.page';
import {SignUpPage} from '../app/page/mine/sign-up/sign-up.page';
import {IdentityPage} from '../app/page/mine/identity/identity.page';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 */
@Injectable({
    providedIn: 'root'
})
export class Login {

  constructor(
      public api: Api,
      public alertCtrl: AlertController,
      public modalCtrl: ModalController,
      public nativeservice: NativeService,
      public wconf: WechatConfig,
      public globalData: GlobalData
  ) { }

  /**
   * 监听微信授权登录
   */
  wechatLogin() {
      if (this.wconf.isWeiXin()) {
          // 清理dom对象的渲染，防止首页刷新两次。
          let objd = document.querySelectorAll('body')[0];
          objd.parentNode.removeChild(objd);

          // http://erha.rossai.cn/mp/Wechat/oauth?store_id=1&target_url=http://mall.rossai.cn/www?storeId=1
          let oauth_url = 'http://erha.rossai.cn/mp/Wechat/oauth?store_id=1&target_url=aHR0cDovL21hbGwucm9zc2FpLmNuL3d3dz9zdG9yZUlkPTE=';
          window.location.href = oauth_url;
      }
  }

    /**
     * 监听微信授权登录, 有确认按钮（可选账号密码登录或微信授权登录）
     */
    async wechatLoginAll() {
        if (this.wconf.isWeiXin()) {
            let alert = await this.alertCtrl.create({
                header: '授权提示',
                message: '您是否授权使用微信登陆，以便更好的体验我们的服务,取消授权则需要手机账号登录',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                            this.normalLogin();
                        }
                    },
                    {
                        text: '授权',
                        handler: async () => {
                            // let askurl = window.location.href.split('?')[0];
                            // let store_id = Utils.localStorageGetItem('store_id');
                            // store_id = store_id ? store_id : 1;
                            // let back_url = askurl + '?storeId=' + store_id;
                            //
                            // let target_url = window.btoa(back_url);
                            // window.location.href = 'http://test.rossai.cn/mp/Wechat/oauth?store_id=' + store_id + '&target_url=' + target_url;

                            // http://erha.rossai.cn/mp/Wechat/oauth?store_id=1&target_url=http://mall.rossai.cn/www?storeId=1
                            let oauth_url = 'http://erha.rossai.cn/mp/Wechat/oauth?store_id=1&target_url=aHR0cDovL21hbGwucm9zc2FpLmNuL3d3dz9zdG9yZUlkPTE=';
                            window.location.href = oauth_url;
                        }
                    }
                ]
            });
            await alert.present();
        }
    }

  /**
   * 监听普通账号登录
   */
  async normalLogin() {
      Utils.localStorageRemoveItem(APP_CONFIG.USER_KEY);
      let addModal = await this.modalCtrl.create({
          component: SignInPage,
          componentProps: {
              type: 'relogin',
          }
      });
      await addModal.present();
      // let { data } = await addModal.onDidDismiss();
      // if (data) {
      //     this.onLoginpage = false;
      // }
  }

  /**
   * 用户从多公众号授权登录自己商城
   */
  multipleWechatLogin() {
      // 如果是 微信环境
      if (this.wconf.isWeiXin()) {

          // 多公众号商城登录的处理
          let url = window.location.href;
          let store_id = this.getUrlParam(url, 'storeId');
          let token = this.getUrlParam(url, 'token');
          let user_id = this.getUrlParam(url, 'user_id');
          // console.log(url+'==='+store_id+'==='+token+'==='+user_id);
          if (store_id && token && user_id) {
              // 微信公众号菜单栏，授权登录，回调获取用户信息。
              let data = {
                  store_id: store_id,
                  token: token,
                  user_id: user_id
              };
              this.api.postFormData('User/getWechatUser', data).subscribe((res: any) => {
                  if (res.status == 200) {
                      Utils.localStorageSetItem(APP_CONFIG.USER_KEY, res.data);
                  } else {
                      this.nativeservice.showToast(res.msg, 1000);
                  }
              }, (err) => {
                  console.error('ERROR', err);
              });
          } else {
              // 自动微信授权登录
              // this.wechatLogin();
          }
      }
  }

  /**
   * 根据url，获取参数的值
   */
  getUrlParam(url, name) {
      let pattern = new RegExp('[?&]' + name + '\=([^&]+)', 'g');
      let matcher = pattern.exec(url);
      let items = null;
      if (null != matcher) {
          try {
              items = decodeURIComponent(decodeURIComponent(matcher[1]));
          } catch (e) {
              try {
                  items = decodeURIComponent(matcher[1]);
              } catch (e) {
                  items = matcher[1];
              }
          }
      }
      return items;
  }

  /** 解决 andriod 物理返回键  卡半屏的现象
   * 出现这种现象 可能是@angular/animations版本兼容性 所造成的
   * 在全局监听路由变化，每次路由发生变化就刷新页面
   * 缺陷：每次修改路由都要刷新页面，资源需要重新加载，导致页面变得有延迟，而且部分页面刷新后一些服务的数据会清空
   */
  debugAndriod() {
      if (Utils.localStorageGetItem('entryType') !== 'app') {
          if (window.history && window.history.pushState) {
              window.addEventListener('popstate', async () => {
                  location.reload();
              });
          }
      }
  }

    /**
     * 用户没有手机号跳到完善个人信息，用户未实名认证跳认证页
     */
    goIdentityOrRegister() {
        if (this.globalData.user.mobile) {
            this.modalCtrl.create({
                component: IdentityPage,
                componentProps: {
                    dosignup: true,
                }
            }).then(
                view => {
                    view.present();
                }
            );
        } else {
            this.modalCtrl.create({
                component: SignUpPage,
                componentProps: {
                    dosignup: true,
                    type: 'edit'
                }
            }).then(
                view => {
                    view.present();
                }
            );
        }
    }
}
