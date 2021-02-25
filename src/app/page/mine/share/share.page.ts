import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ModalController } from '@ionic/angular';
import { Api, NativeService, Utils } from 'src/services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {
  totalprice = '0'; // 总价
  num = 0; // 商品总数
  ifmanage = false; // 管理或结算
  ifall = false;
  storelist = [];
  img = '';
  goods_id = 0;

  constructor(
    public navCtrl: NavController,
    // public navParams: NavParams,
    public api: Api,
    public native: NativeService,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public router: Router,
    public activated: ActivatedRoute,
  ) {
    this.activated.queryParams.subscribe((params: Params) => {
      this.goods_id = params['goods_id'];
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SharePage');
    this.shareGoods();
    console.log('ifall_' + this.ifall);
  }

  //分享商品
  shareGoods() {
    this.api.postFormData('Goods/goodsInfoShare', { goods_id: this.goods_id, type: 'index' }).subscribe((res: any) => {
      console.log(res);
      if (res.status == 1) { // 分享的模态框
        this.img = res.msg;
      } else if (res.status == -1) { // 跳登录页
        this.router.navigate(['login']);
      } else if (res.status == -2) { // 跳商品详情
        this.goback();
      } else {
        console.log(res.msg);
      }
    }, (err) => {
      console.log(err);
    });
  }

  // more(myEvent) {
  //   let popover = this.popoverCtrl.create({
  //     component: PopoverOnePage,
  //     componentProps: {
  //       ev: myEvent,
  //       navActive: this.navCtrl
  //     }
  //   });
  // }

  gotostore(store_id) {
    this.router.navigate(['store'], {
      queryParams: {
        storeId: store_id
      }
    })
  }

  goback() {
    this.navCtrl.back();
  }

  gopege() {
    this.navCtrl.navigateRoot(['/']);
  }

}
