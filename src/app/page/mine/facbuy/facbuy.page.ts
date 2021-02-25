import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Api, NativeService, GlobalData, WechatConfig, User, Utils } from 'src/services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Alipay } from '@ionic-native/alipay/ngx';
declare var Wechat: any;
declare var window; //  解决微信app支付bug

@Component({
  selector: 'app-facbuy',
  templateUrl: './facbuy.page.html',
  styleUrls: ['./facbuy.page.scss'],
})
export class FacbuyPage implements OnInit {
  public user_money = ''; // 保存用户使用的余额
  public show_money = ''; // 保存当前用户可用余额
  public btn_disable = false; // 防止用户多次点击使用余额按钮
  public should_pay = ''; // 应付金额
  public type = 0; // 默认为普通区商品,1为活动区商品,2为批发区商品
  public reserve_dis = 0;

  testradio = true;
  paymentList = [];
  paymentListCheck = []; // 保存单选按钮选中状态
  orderinfo = {
    pay_code: '',
    order_id: '',
    order_sn: '',
    total_amount: 0,
    is_reserve: 0,
    reserve_param:{
      reserve_money:0,
      is_pay:0
    }
  };
  order_use_money: any;
  constructor(
    public navCtrl: NavController,
    public api: Api,
    public _WechatConfig: WechatConfig,
    public native: NativeService,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private alertCtrl: AlertController,
    private _GlobalData: GlobalData,
    private user: User,
    private alipay: Alipay,
  ) {
    this.activateRoute.queryParams.subscribe((params: Params) => {
      this.orderinfo.total_amount = params['total_amount'];

      this.orderinfo.order_sn = params['order_sn'];
      this.orderinfo.order_id = params['order_id'];
      this.type = params['type'];
      this.user_money = '';
      this.show_money = this._GlobalData.user.user_money;
      this.getpaymentlist(this.orderinfo.order_id, this.orderinfo.order_sn);

    });
  }

  ngOnInit() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacbuyPage');
    this.user_money = '';
    this.show_money = this._GlobalData.user.user_money;
  }

  //  支付回调函数
  payBack(order_id) {
    this.api.postFormData('cart/add_pay_order_temp', { order_id }).subscribe((res) => { }, (err) => { });
  }
  /**  过滤付款列表 */
  filterPayList() {
    let tempPayList = [];
    let entryType = Utils.localStorageGetItem('entryType');
    switch (entryType) {
      //  网页端，筛选过滤条件
      case 'other':
        for (let item of this.paymentList) {
          if (item.code == 'alipayMobile') {
            tempPayList.push(item);
          }
        }
        this.paymentList = tempPayList;
        break;
      //  app端，筛选过滤条件
      case 'app':
        for (let item of this.paymentList) {
          if (item.code == 'appAliPay' || item.code == 'appWeixinPay') {
            tempPayList.push(item);
          }
        }
        this.paymentList = tempPayList;
        break;
      //  微信端，筛选过滤条件
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
      this.paymentListCheck[i] = false;
    }
  }
  /**  使用余额 */
  updateprice() {
    if (Number(this.user_money) > Number(this.should_pay)) {
      this.native.showToast('使用余额大于应付金额，请重新输入!');
      return;
    }
    let obj = {
      'order_id': this.orderinfo.order_id,
      'user_money': this.user_money
    };
    this.user_money = '';
    this.btn_disable = true;
    this.native.showLoading();
    if (this.btn_disable) {
      this.api.postFormData('Order/OrderSurplusPay', obj).subscribe((res: any) => {
        console.log(res);
        this.native.hideLoading();
        this.btn_disable = false;
        if (res.status == 1) {
          this.native.showToast('使用余额成功!');
          // 预定支付定金跳转
          if (res.result.is_reserve == 1 && res.result.reserve_param.is_pay == 1) {
              this.router.navigate(['myconsumeorder']);
              return;
          }
          this.show_money = res.user_money;
          this.should_pay = res.result.sum_order_amount;
          if (res.result.paymentList) {
            this.paymentList = res.result.paymentList;
            this.filterPayList();
          }
          //  if (res.result.ShareObj) {
          //    this._WechatConfig.ShareObj = res.result.ShareObj;
          //  }
          //  if (res.result.signPackage) {
          //    this._WechatConfig.configwx(res.result.signPackage);
          //  }
        } else if (res.status == 3) {
          this.user.updateUser();
          this.native.showToast('已完成支付!');
          if (this.type == 1) {
            //  批发区商品支付完成
            this.router.navigate(['consignOrder']);
          } else {
            this.router.navigate(['myconsumeorder']);
          }

        } else {
          this.native.showToastTips(res.msg);
        }

      }, (err) => {
        this.native.hideLoading();
        this.btn_disable = false;
        console.log(err);
      });
    }
  }
  /** 修复单选框点击两次生效问题 */
  clickRadio(index) {
    for (let i = 0; i < this.paymentList.length; i++) {
      this.paymentListCheck[i] = false;
    }
    this.paymentListCheck[index] = true;
  }
  /** 获取 付款 方式的  列表 */
  getpaymentlist(order_id, master_order_sn) {
    let askurl = '';
    //  if (this._WechatConfig.isWeiXin()) {
    //    askurl = encodeURIComponent(window.location.href.split('#')[0]);
    //  }
    this.api.postFormData('Cart/cart4', {
      'order_id': order_id,
      //  'master_order_id': master_order_sn,
      'askurl': askurl
    }).subscribe((res: any) => {
      console.log(res);
      this.user_money = '';
      this.show_money = this._GlobalData.user.user_money;
      if (res.status == 1) {
        this.should_pay = res.result.sum_order_amount;

        // 预定订单
        if (res.result.is_reserve == 1 && res.result.reserve_param.reserve_money > 0 && res.result.reserve_param.is_pay != 1) {
          this.user_money = res.result.reserve_param.reserve_money;
          this.reserve_dis = 1;
        }
        this.orderinfo.reserve_param = res.result.reserve_param;
        this.orderinfo.is_reserve = res.result.is_reserve;
        //  this.orderinfo=res.result;
        this.order_use_money = res.result;
        if (res.result.paymentList) {
          this.paymentList = res.result.paymentList;
          this.filterPayList();
        }
        //  if (res.result.ShareObj) {
        //    // this.signPackage = res.signPackage;
        //    this._WechatConfig.ShareObj = res.result.ShareObj;
        //  }
        //  if (res.result.signPackage) {
        //    // this.signPackage = res.signPackage;
        //    this._WechatConfig.configwx(res.result.signPackage);
        //  }
      } else {
        this.native.showToastTips(res.msg);
      }

    }, (err) => {
      console.log(err);
    });
  }
  /** 立即支付 */
  pay() {
    if (!this.orderinfo.pay_code) {
      this.native.showToastTips('请选择支付方式');
      return false;
    }
    this.api.postFormData('Cart/pay', {
      order_id: this.orderinfo.order_id,
      //  master_order_sn: this.orderinfo.order_sn,
      pay_code: this.orderinfo.pay_code
    }).subscribe((res: any) => {
      console.log(res);
      if (res.status > 0) {
        if (res.status === 1) {
          this.pay_suess(res.res);
        } else if (res.status === 2) {

          switch (res.res.pay_code) {
            //  微信支付
            case 'weixin':
              let iswexin = this._WechatConfig.isWeiXin();
              if (iswexin) {
                new Promise((resolve, reject) => {
                  // this.navCtrl.push('LoginPage', { resolve: resolve });
                  this._WechatConfig.resolve = resolve;
                  this._WechatConfig.wechatjspay(res.html);
                }).then((rest: any) => {
                  //  若修改成功返回则在该代码块中将本页的 nickname 修改
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
            //  支付宝支付
            case 'alipayMobile':
              //  console.log(this._WechatConfig.isWeiXin())
              //  if(this._WechatConfig.isWeiXin()){// 微信中支付
              //    let code_str = JSON.stringify(res.html);
              //    let b = new Base64();
              //    let result = b.encode(code_str);
              //    window.location.href = res.SITE_URL+"/mallapi/Index/paynotice?result="+result;
              //  }else{// 非微信中支付
              //    this.alipayMobile(res.html,0);
              //  }
              this.alipayMobile(res.html, 0);
              break;
            //  app微信支付
            case 'appWeixinPay':
              var params = {
                package: 'Sign=WXPay',
                partnerid: res.html.partnerid, //  merchant id
                prepayid: res.html.prepayid, //  prepay id
                noncestr: res.html.noncestr, //  nonce
                timestamp: '' + res.html.timestamp, //  timestamp
                sign: res.html.sign, //  signed string
                appid: res.html.appid
              };
              window.Wechat.sendPaymentRequest(params, (data) => {
                this.payBack(this.orderinfo.order_id);
                this.pay_suess(data);
              },
                function (reason) {
                  this.native.showToast('唤起微信支付失败!');
                });
              break;
            //  app支付宝支付
             case 'appAliPay':
               this.alipay.pay(res.html).then(result => {
                 this.payBack(this.orderinfo.order_id);
                 this.pay_suess(result);
               }).catch(error => {});
              break;
            default: this.pay_suess(res.res); break;
          }
        }
      } else {
        this.native.showToastTips(res.msg);
      }
    }, (err) => { });
  }
  /** 调用支付宝 */
  async alipayMobile(res, isWeiXin) {
    if (isWeiXin) {
      //  const prompt = await this.alertCtrl.create({
      //    header: '支付提示',
      //    message: "因为微信屏蔽了支付宝支付,请复制链接后用浏览器打开再支付!",
      //    buttons: [
      //      {
      //        text: '取消',
      //        handler: data => {
      //          console.log('Cancel clicked');
      //        }
      //      },
      //      {
      //        text: '确定',
      //        handler: data => {
      //          // 支付
      //          const div = document.createElement('div');
      //          div.innerHTML = res;
      //          document.body.appendChild(div);
      //          document.forms[0].submit();
      //          // 支付
      //        }
      //      }
      //    ]
      //  });
      //  await prompt.present();
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
  /** 测试使用 app微信支付测试   1 */
  checkInstalled() {
    Wechat.isInstalled(function (installed) {
      alert("Wechat installed: " + (installed ? "Yes" : "No"));
    }, function (reason) {
      alert("Failed: " + reason);
    });
  }
  /** 测试使用 微信授权 测试支付 2 */
  auth() {
    var scope = "snsapi_userinfo",
      state = "_" + (+new Date());
    Wechat.auth(scope, state, function (response) {
      alert(JSON.stringify(response));
    }, function (reason) {
      alert("Failed: " + reason);
    });
  }
  /** 测试使用 测试支付 3 */
  pay1() {
    this.api.postFormDatabyurl("https:// www.jason-z.com/test/wechat_order", {}).subscribe((res: any) => {
      console.log(res);
      var ret = res.json();

      //    var params = {
      //      partnerid: '10000100', //  merchant id
      //      prepayid: 'wx201411101639507cbf6ffd8b0779950874', //  prepay id
      //      noncestr: '1add1a30ac87aa2db72f57a2375d8fec', //  nonce
      //      timestamp: '1439531364', //  timestamp
      //      sign: '0CB01533B8C1EF103065174F50BCA001', //  signed string
      //  };

      if (ret.status) {
        Wechat.sendPaymentRequest(ret.data, function () {
          alert("Success");
        }, function (reason) {
          alert("Failed: " + reason);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  /** 返回 */
  goback() {
    //  this.navCtrl.back();
    this.router.navigate(['/tabs/mine']);
  }
}
