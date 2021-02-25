import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { GlobalData, NativeService, WechatConfig } from './index';
import { TimeoutError } from 'rxjs';
import { User } from '../services/User';
import { Utils } from './Utils';
import {Login} from './Login';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(
    public globalData: GlobalData,
    public wconf: WechatConfig,
    public user: User,
    public nativeService: NativeService,
    public loginServe: Login
  ) {
  }

  /** 拦截 */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq;
    if (req.url.indexOf('/assets') > -1) {
      authReq = req.clone({
        url: (req.url)
      });
    } else {
      authReq = req.clone({
        url: (req.url),
        setHeaders: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          IsApi: 'true',
          Token:  this.globalData.token ? this.globalData.token : ''
        }
      });
    }

    if (authReq.method != 'GET') {
      this.showLoading();
    }
    // return <any>next.handle(authReq).pipe(mergeMap((event: any) => {
    return (next.handle(authReq) as any).pipe(mergeMap((event: any) => {
      if (event instanceof HttpResponse && event.status !== 200) {
        return throwError(event);
      }
      // console.log(event);
      return Observable.create(observer => {
        if (event.body) {
          if (event.body.status == -99) { // 账号重新登录
              this.loginServe.normalLogin();
          } else if (event.body.status == -100) { // 微信授权重新登录
              this.loginServe.wechatLogin();
          }
          // if (Utils.localStorageGetItem('store_id') != this.globalData.user.store_id) { // 账号是其他店铺的，要重新登录
          //   if (this.wconf.isWeiXin()) {
          //     window['epInstance']['emit']('wechatLogin', event.body);
          //   } else {
          //     window['epInstance']['emit']('toLogin', 0);
          //   }
          // }
          observer.next(event);
        } else {
          observer.next(event);
        }
        if (event.type > 0) {
          this.hideLoading();
        }
      }); // 请求成功返回响应
    }),
      catchError((res: HttpResponse<any>) => {
        // 请求失败处理
        this.hideLoading();
        if (!this.nativeService.isConnecting()) {
          this.nativeService.showToastTips('请连接网络');
        } else if (res instanceof TimeoutError) {
          this.nativeService.showToastTips('请求超时,请稍后再试!');
        } else {
          let msg = '请求发生异常';
          switch (res.status) {
            case 0:
              //console.log('未知的Api');
              msg = '未知的Api';
              break;
            case 401:
              break;
            case 404:
              //console.log('Api请求地址不存在');
              msg = 'Api请求地址不存在';
              //this.events.publish('toLogin');
              break;
            case 403:
              //console.log('业务错误');
              break;
            case 500:
              //console.log('服务器出错');
              msg = 'Api请求地址不存在';
              break;
          }
          // this.nativeService.showToastTips(msg);
        }

        return throwError(event);
      }));
  }

  private count = 0; //  记录未完成的请求数量,当请求数为0关闭loading,当不为0显示loading

  private async showLoading() {
    if (++this.count > 0) {// 一旦有请求就弹出loading
      this.globalData.showLoading && await this.nativeService.showLoading();
    }
  }

  private hideLoading() {
    if (this.globalData.showLoading) {
      // 延迟处理可以避免嵌套请求关闭了第一个loading,突然后弹出第二个loading情况(结合nativeService.showLoading())
      setTimeout(() => {
        if (--this.count === 0) {// 当正在请求数为0,关闭loading
          this.nativeService.hideLoading();
        }
      }, 200);
    } else {
      this.globalData.showLoading = true;
    }
  }
}

