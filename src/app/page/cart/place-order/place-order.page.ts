import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { NativeService, Api, WechatConfig, GlobalData, User, Utils } from 'src/services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Wechat } from '@ionic-native/wechat/ngx';
import { Alipay } from '@ionic-native/alipay/ngx';
import {APP_CONFIG} from 'src/services/Constants';

declare var window; // 解决微信app支付bug

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.page.html',
  styleUrls: ['./place-order.page.scss'],
})
export class PlaceOrderPage implements OnInit {
  public order_id; // 订单id
  public master_order_sn; // 主订单id
  public status = 1; // 保存首次请求状态
  public show_money = ''; // 保存当前用户可用余额
  public user_money = ''; // 保存用户使用的余额
  public btn_disable = false; // 防止用户多次点击使用余额按钮
  public type = 0; // 默认为0，普通区商品

  public orderinfo = { order_sn: '', sum_order_amount: 0, pay_code: null, total_amount: 0, order_type: '0', a_coin: 0, b_coin: 0, is_reserve: 0,reserve_param:{reserve_money:0} };
  public paymentList = [];
  public isChecked = []; // 修复单选框点击两次生效
  public tips_status = false;
  public reserve_dis = 0;

  constructor(
    public navCtrl: NavController,
    public api: Api,
    public native: NativeService,
    public _WechatConfig: WechatConfig,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private alertCtrl: AlertController,
    private _GlobalData: GlobalData,
    private user: User,

    // private Wechat: Wechat,
    private alipay: Alipay,
  ) {
    // 接收 上一页 传过来的参数
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.order_id = params['order_id'];
      this.master_order_sn = params['master_order_sn'];
      this.type = params['type'];
      this.getorderinfo(this.order_id, this.master_order_sn);
    });
    this.user_money = '';
    this.show_money = this._GlobalData.user.user_money;
  }

  ngOnInit() { }
  /** 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发 */
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaceorderPage');
    this.user_money = '';
    this.show_money = this._GlobalData.user.user_money;
  }

  /**  支付回调函数 */
  payBack(order_id) {
    this.api.postFormData('cart/add_pay_order_temp', { order_id }).subscribe((res) => {
      this.pay_suess(res);
    }, (err) => { });
  }
  /**  使用余额 */
  updateprice() {
    if (Number(this.user_money) > Number(this.orderinfo.sum_order_amount)) {
      this.native.showToast('使用余额大于订单金额，请重新输入!');
      return;
    }
    let obj = {
      'order_sn': this.master_order_sn,
      'user_money': this.user_money
    };
    this.user_money = '';
    this.btn_disable = true;
    this.native.showLoading();
    if (this.btn_disable) {
      this.api.postFormData('Order/OrderSurplusPay', obj).subscribe((res: any) => {
        this.native.hideLoading();
        this.btn_disable = false;
        if (res.status == 1) {
          this.native.showToast('使用余额成功!');
          // 预定支付定金跳转
          if (res.result.is_reserve == 1 && res.result.reserve_param.is_pay == 1) {
              console.log('完成',res);
              this.router.navigate(['myconsumeorder']);
              return;
          }
          this.user.updateUser();
          this.show_money = res.user_money;
          this.orderinfo.sum_order_amount = res.result.sum_order_amount;
          if (res.result.paymentList) {
            this.paymentList = res.result.paymentList;
            this.filterPayList();
          }
          // if (res.result.ShareObj) {
          //   this._WechatConfig.ShareObj = res.result.ShareObj;
          // }
          // if (res.result.signPackage) {
          //   this._WechatConfig.configwx(res.result.signPackage);
          // }
        } else if (res.status == 3) {
          this.native.showToast('已完成支付!');
          if (this.type == 1) {
              this.router.navigate(['consignOrder']);
          } else {
              this.router.navigate(['myconsumeorder']);
          }
        } else {
          this.native.showToast(res.msg);
        }

      }, (err) => {
        this.native.hideLoading();
        this.btn_disable = false;
        console.log(err);
      });
    }
  }
  /** 支付订单 的 信息 */
  getorderinfo(order_id, master_order_sn) {
    this.user_money = '';
    this.show_money = this._GlobalData.user.user_money;
    let askurl = '';
    // if (this._WechatConfig.isWeiXin()) {
    //   askurl = encodeURIComponent(window.location.href.split('#')[0]);
    // }
    this.native.showLoading();
    this.api.postFormData('Cart/cart4',
      { 'order_id': order_id, 'master_order_sn': master_order_sn, 'askurl': askurl }).subscribe((res: any) => {
        this.native.showLoading();
        this.status = res.status;
        if (res.status == 1) {
          this.orderinfo = res.result;
          this.show_money = res.user_money;
          // 付款列表
          if (res.result.paymentList) {
            this.paymentList = res.result.paymentList;
            this.filterPayList();
          }
          // 预定订单
          if (res.result.is_reserve == 1 && res.result.reserve_param.reserve_money > 0) {
            this.user_money = res.result.reserve_param.reserve_money;
            this.reserve_dis = 1;
          }
          // if(res.result.ShareObj) {
          //   //this.signPackage = res.signPackage;
          //   this._WechatConfig.ShareObj = res.result.ShareObj;
          // }
          // if(res.result.signPackage) {
          //   //this.signPackage = res.signPackage;
          //   this._WechatConfig.configwx(res.result.signPackage);
          // }
        } else {
          this.native.showToastTips(res.msg);
          if (this.type == 2) {
            this.router.navigate(['consignOrder']);
          } else {
            this.router.navigate(['myconsumeorder']);
          }
        }
      }, (err) => {
        this.native.showLoading();
        console.log(err);
      });
  }

  /**  过滤付款列表 */
  filterPayList() {
    let tempPayList = [];
    let entryType = Utils.localStorageGetItem('entryType');
    switch (entryType) {
      // 网页端，筛选过滤条件
      case 'other':
        for (let item of this.paymentList) {
          if (item.code == 'alipayMobile') {
            tempPayList.push(item);
          }
        }
        this.paymentList = tempPayList;
        break;
      // app端，筛选过滤条件
      case 'app':
        // appAliPay/app支付宝付款 appWeixinPay/app微信付款
        for (let item of this.paymentList) {
          if (item.code == 'appAliPay' || item.code == 'appWeixinPay') {
            tempPayList.push(item);
          }
        }
        this.paymentList = tempPayList;
        break;
      // 微信端，筛选过滤条件
      case 'weixin':
        for (let item of this.paymentList) {
          if (item.code == 'weixin') {
            tempPayList.push(item);
          }
        }
        this.paymentList = tempPayList;
        break;
      default: break;
    }
    for (let i = 0; i < this.paymentList.length; i++) {
      this.isChecked[i] = false;
    }
  }

  /**  修复单选框点击两次生效问题 */
  clickRadio(myIndex) {
    for (let i = 0; i < this.paymentList.length; i++) {
      this.isChecked[i] = false;
    }
    this.isChecked[myIndex] = true;
  }
  /** 支付 */
  pay() {
    // 已完成支付
    if (this.status == 2 || this.status == 3) {
      this.router.navigate(['tabs/mine']);
      return;
    }
    if (!this.orderinfo.pay_code) {
      this.native.showToastTips('请选择支付方式');
      return false;
    }
    // 佛山沥发store_id=481，线下批发客户不需要微信支付,普通客户需要
    // let login_user = Utils.localStorageGetItem(APP_CONFIG.USER_KEY);
    // let offline_user_id = login_user ? login_user.offline_user_id : false;
    // if ((Utils.localStorageGetItem('store_id') == 481) && offline_user_id) {
    //     this.native.showToastTips('请联系商家支付订单');
    //     return false;
    // }
    this.api.postFormData('Cart/pay', {
      order_id: this.order_id,
      master_order_sn: this.master_order_sn,
      pay_code: this.orderinfo.pay_code
    }).subscribe((res: any) => {
      if (res.status > 0) {
        if (res.status === 1) {
          this.pay_suess(res.res);
        } else if (res.status === 2) {

          switch (res.res.pay_code) {
            // 微信支付
            case "weixin":
              let iswexin = this._WechatConfig.isWeiXin();
              if (iswexin) {
                new Promise((resolve, reject) => {
                  // this.navCtrl.push('LoginPage', { resolve: resolve });
                  this._WechatConfig.resolve = resolve;
                  this._WechatConfig.wechatjspay(res.html);
                }).then((rest: any) => {
                  // 若修改成功返回则在该代码块中将本页的 nickname 修改
                  console.log(rest);
                  if (rest.paystate > 0) {
                    res.res.paystate = rest.paystate;
                  } else {
                    this.native.showToastTips(rest.msg);
                  }
                  this.pay_suess(res.res);
                });
              } else {
                this.native.showToastTips('您的环境不支持微信支付');
              }
              break;
            // 支付宝支付
            case 'alipayMobile':
              // if(this._WechatConfig.isWeiXin()){//微信中支付
              //   let code_str = JSON.stringify(res.html);
              //   let b = new Base64();
              //   let result = b.encode(code_str);
              //   window.location.href = res.SITE_URL+'/mallapi/Index/paynotice?result='+result;
              // }else{//非微信中支付
              //   this.alipayMobile(res.html,0);
              // }
              this.alipayMobile(res.html, 0);
              break;
            // app微信支付
            case 'appWeixinPay':
              var params = {
                package: 'Sign=WXPay',
                partnerid: res.html.partnerid,
                prepayid: res.html.prepayid,
                noncestr: res.html.noncestr,
                timestamp: '' + res.html.timestamp,
                sign: res.html.sign,
                appid: res.html.appid
              };
              window.Wechat.sendPaymentRequest(params, (data) => {
                this.payBack(this.order_id);
                this.pay_suess(data);
              },
                (reason) => {
                  this.native.showToast('唤起微信支付失败!');
                });
              break;
            // app支付宝支付
            case 'appAliPay':
              this.alipay.pay(res.html).then(result => {
                this.payBack(this.order_id);
                this.pay_suess(result);
              }).catch(error => { });
              break;
            default: this.pay_suess(res.res); break;
          }

        }
      } else {
        this.native.showToastTips(res.msg);
      }
    }, (err) => { });
  }
  /** 阿里移动支付 */
  async alipayMobile(res, isWeiXin) {
    if (isWeiXin) {
      // const prompt = await this.alertCtrl.create({
      //   header: '支付提示',
      //   message: '因为微信屏蔽了支付宝支付,请复制链接后用浏览器打开再支付!',
      //   buttons: [
      //     {
      //       text: '取消',
      //       handler: data => {
      //         console.log('Cancel clicked');
      //       }
      //     },
      //     {
      //       text: '确定',
      //       handler: data => {
      //         // 支付
      //         const div = document.createElement('div');
      //         div.innerHTML = res;
      //         document.body.appendChild(div);
      //         document.forms[0].submit();
      //
      //         // 支付
      //       }
      //     }
      //   ]
      // });
      // await prompt.present();
    } else {
      const div = document.createElement('div');
      div.innerHTML = res;
      document.body.appendChild(div);
      document.forms[0].submit();
    }
  }
  /** 支付成功 */
  pay_suess(info) {
    if (this.type == 1) {
      this.router.navigate(['consignOrder']);
    } else {
      this.router.navigate(['myconsumeorder']);
    }
  }
  goback() {
    // this.navCtrl.back();
    this.router.navigate(['/tabs/mine']);
  }
}
