// import 'rxjs/add/operator/share';
import { Injectable } from '@angular/core';
import { Api } from './api';
import { Utils } from './Utils';
import { APP_CONFIG } from './Constants';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 */
@Injectable({
    providedIn: 'root'
})
export class User {
  _user: any;
  private USER_KEY: string = APP_CONFIG.USER_KEY;

  constructor(public api: Api) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   * 登陆
   */
  // login(accountInfo: any) {
  //   let seq = this.api.postFormData('user/do_login', accountInfo).share();
  //   seq.subscribe((res: any) => {
  //     if (res.status == 200) {
  //       this._loggedIn(res.data);
  //     } else {
  //
  //     }
  //   }, err => {
  //     console.error('ERROR', err);
  //   });
  //
  //   return seq;
  // }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   * 注册
   */
  // signup(accountInfo: any) {
  //   let seq = this.api.postFormData('user/do_register', accountInfo).share();
  //
  //   seq.subscribe((res: any) => {
  //     // If the API returned a successful response, mark the user as logged in
  //     if (res.status > 0) {
  //       this._loggedIn(res.data);
  //     }
  //   }, err => {
  //     console.error('ERROR', err);
  //   });
  //
  //   return seq;
  // }
  /** 判断是否 有 登陆 */
  isnologin() {
    let islogin = Utils.localStorageGetItem(this.USER_KEY) ? true : false;
    console.log(this.USER_KEY);
    console.log(Utils.localStorageGetItem(this.USER_KEY));
    console.log('islogin__________' + islogin);
    return islogin;
  }

  /**
   * Log the user out, which forgets the session
   * 退出登陆
   */
  logout() {
    this.api.get('user/logout').subscribe((res: any) => {

    });
    this._user = null;
    Utils.localStorageRemoveItem(this.USER_KEY);
    let islogin = Utils.localStorageGetItem(this.USER_KEY) ? true : false;
    console.log(this.USER_KEY);
    console.log(Utils.localStorageGetItem(this.USER_KEY));
    console.log('islogin_' + islogin);
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    // console.log('123211',resp);
    // resp.showMobile = resp.mobile ? resp.mobile.replace(/^(.{4})(?:\d+)(.{4})$/,"$1****$2") : '';
    // resp.showID = resp.idcard ?  resp.idcard.replace(/^(.{2})(?:\d+)(.{4})$/,"$1**********$2") : '';

    Utils.localStorageSetItem(this.USER_KEY, resp);
    Utils.localStorageSetItem('store_name', resp.store_name);
    // this.storage.set(this.USER_KEY, resp);
    this._user = resp;
  }
  /**  更新用户的信息 */
  updateUser() {
    this.api.get('user/getMyContent').subscribe(
      (res: any) => {
        if (res.status == 200) {
          // 更新本地user信息
          this._loggedIn(res.data);
        }
      },
      err => {
      }
    );
  }

  /* 下载 */
  downloadFile(url, filename) {
    if (!url) return
    let link = document.createElement('a') //创建a标签
    link.style.display = 'none'  //使其隐藏
    link.href = url //赋予文件下载地址
    link.setAttribute('download', filename) //设置下载属性 以及文件名
    document.body.appendChild(link) //a标签插至页面中
    link.click() //强制触发a标签事件
    document.body.removeChild(link);
  }
}
