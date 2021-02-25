import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Api, NativeService, Utils } from 'src/services';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  public index: number | string = ''; // 保存上个页面是从哪里进入，返回时会使用
  public index2: number | string = ''; // 保存上个页面是从哪里进入，返回时会使用
  public order_id: string = ''; // 保存订单id
  public user_id: string = ''; // 是否为下级订单列表，如果有值则为下级订单列表，如果为空则为当前用户，下级订单不可操作订单
  // 保存订单信息
  public order_info: any = {
    'order_status_code': '',  // 保存订单状态
    'order_status_desc': '',  // 保存订单状态描述
    'order_amount': 0,        // 订单总金额
    'consignee': '',          // 地址联系人
    'goods_list': [],         // 商品列表
    'goods_price': '',        // 订单商品金额
    'shipping_price': '',     // 订单运费
    'order_sn': '',           // 地址联系人
    'create_time': ''         // 创建时间
  };
  // 保存地址信息
  public address_info: any = {
    'address': '',  // 地址信息
    'user': ''      // 下单人
  };
  // 保存订单信息
  public store: any = {
    'store_name': ''  // 商家名称
  };
  is_click: boolean = false ;

  end_time = '';

  constructor(
    private router: Router,
    private api: Api,
    private native: NativeService,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    public navController: NavController
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.index = params.index;
      this.index2 = params.index2;
      this.is_click = params.is_click ?  params.is_click  : false ;
      this.order_id = params.order_id;
      this.user_id = params.user_id;
      this.end_time =  params.end_time ? params.end_time : '';
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getOrderDetail();
  }

  /** 获取订单详情 */
  getOrderDetail() {
    this.api.postFormData('Order/orderDetailNew', { order_id: this.order_id }).subscribe(
      (res: any) => {
        console.log(res)
        this.address_info.user = '';
        this.address_info.address = '';
        if (res.status > 0) {
          this.order_info = res.result.order_info; // 订单信息
          this.order_info.create_time = Utils.dateFormat(new Date(this.order_info.add_time * 1000), 'yyyy-MM-dd HH:mm:ss')
          //  地址信息
          this.address_info.user += res.result.order_info.consignee;
          for (let key in res.result.regionLits) {
            this.address_info.address += res.result.regionLits[key];
          }
          this.address_info.address += ' ' + res.result.order_info.address;
          //  商家名称
          this.store = res.result.store;
        } else {
          this.native.showToastTips(res.msg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  /** 取消订单 */
  async cancelorder() {
    let alert3 = await this.alertCtrl.create({
      message: '确认取消该订单?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: '确定',
          handler: () => {
            this.native.showLoading();
            this.api.get('Order/cancel_order', {
              order_id: this.order_id
            }).subscribe(
              (res: any) => {
                //  跟新用户数据
                this.native.hideLoading();
                this.native.showToast(res.msg);
                this.goback();
              },
              (err) => {
                this.native.hideLoading();
                console.log(err);
              }
            );
          }
        }
      ]
    });
    await alert3.present();
  }
  /** 去支付 */
  gotofacbuy() {
    if (this.order_info.is_reserve == 1 && this.order_info.reserve_pay_status == 1) {
      this.native.showToast('请联系上级代理商或总部付款');
      return;
    }
    this.router.navigate(['fac-buy'], {
      queryParams: {
        total_amount: this.order_info.order_amount,
        order_sn: this.order_info.order_sn,
        order_id: this.order_id,
      }
    });
  }

  /** 返回上一级页面(tabs/tab-my) */
  goback() {
     this.router.navigate(['myconsumeorder'], {
       queryParams:{
         'index':this.index,
         'index2':this.index2,
         'user_id':this.user_id,
       }
     });
    // this.navController.back();
  }

}
