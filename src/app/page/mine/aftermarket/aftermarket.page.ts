import { Component, OnInit } from '@angular/core';
import { Api, NativeService } from 'src/services';
import { NavController, PopoverController } from '@ionic/angular';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-after-market',
  templateUrl: './aftermarket.page.html',
  styleUrls: ['./aftermarket.page.scss'],
})
export class AftermarketPage implements OnInit {
  // 可以申请售后的子订单
  public storelist = [];
  paybtn = {
    ifclick: true,
    txt: '',
  };
  public order_sn;
  public type = 1; // 1:售后申请，2：进度查询

  ordertypes = [
    {
      type: '1',
      name: '售后申请',
      checked: true,
    }, {
      type: '2',
      name: '进度查询',
      checked: false,
    }
  ];
  chooseordertype = '';
  constructor(
    public navCtrl: NavController,
    public api: Api,
    public native: NativeService,
    public router: Router,
    public popoverCtrl: PopoverController,
    public activeRoute: ActivatedRoute
  ) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.order_sn = params['order_sn'];
    });
  }

  ngOnInit() {
    this.getorderlist();
  }

  /**
   * 可以申请售后的商品列表
   * @param order_sn 传入的 商品的order_sn
   */
  getorderlist() {
    this.api.postFormData('AfterSale/orderDetail', { 'order_sn': this.order_sn }).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.storelist = res.data;
        } else {
          this.native.showToastTips(res.msg);
        }
      }, (err) => {
        console.log(err);
      }
    );
  }

  /**
   * 申请售后的进度列表
   * @param order_sn 传入的 商品的order_sn
   */
  getreturngoods() {
    this.api.postFormData('AfterSale/returnGoods', { 'order_sn': this.order_sn }).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.storelist = res.data;
        } else {
          this.native.showToastTips(res.msg);
        }
      }, (err) => {
        console.log(err);
      }
    );
  }
  /**
   * 切换 类型
   * @param type 标题的类型 1：售后申请 / 2：进度查询
   */
  changeordertype(type) {
    this.ordertypes.forEach(val => {
      val.checked = false;
      if (val.type == type) {
        val.checked = true;
        this.chooseordertype = type;
      }
    });
    this.storelist = [];
    if (type == 1) {
      this.type = 1;
      this.getorderlist();
    } else {
      this.type = 2;
      this.getreturngoods();
    }
  }
  /** 跳转到 购物订单 页面 搜索 */
  searchorder() {
    // this.router.navigate(['search-order']);
    this.router.navigate(['myconsumeorder']);
  }

  /**  申请售后页面 */
  afterSale(key) {
    this.router.navigate(['aftersale'], {
      queryParams: {
        rec_id: this.storelist[key].rec_id,
        status_desc: this.storelist[key].status_desc,
        goods_num: this.storelist[key].goods_num,
        order_id: this.storelist[key].order_id,
        order_sn: this.storelist[key].order_sn,
        goods_id: this.storelist[key].goods_id,
        spec_key: this.storelist[key].spec_key,
      }
    });
  }

  /**  售后进度查询页面 */
  getProgress(key) {
    this.router.navigate(['after-sale-process'], {
      queryParams: {
        id: this.storelist[key].id,
      }
    });
  }

  /** 立即付款 */
  gotofacbuy(total_amount, order_sn, order_id) {
    this.router.navigate(['facbuy'], {
      queryParams: {
        total_amount: total_amount,
        order_sn: order_sn,
        order_id: order_id,
      }
    })
  }

  // 更多导航
  // async more(myEvent) {
  //   const popover = await this.popoverCtrl.create({
  //     component: PopoverMainPage,
  //     componentProps: {
  //       navActive: this.navCtrl
  //     },
  //     event: myEvent,
  //     translucent: true,
  //   });
  //   return await popover.present();
  // }

  /** 返回 购物订单 页面 */
  goback(index) {
    // this.navCtrl.navigateBack('myconsumeorder');
    this.router.navigate(['myconsumeorder'], { queryParams: { index: index } });
  }

}
