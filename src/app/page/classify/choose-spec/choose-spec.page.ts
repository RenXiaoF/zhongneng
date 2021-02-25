import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, AlertController, ModalController } from '@ionic/angular';
import { Api, NativeService, Utils } from 'src/services';
import { ActivatedRoute, Params } from '@angular/router';
// import { SearchFactoryPage } from '../search-factory/search-factory.page';

@Component({
  selector: 'app-choose-spec',
  templateUrl: './choose-spec.page.html',
  styleUrls: ['./choose-spec.page.scss'],
})
export class ChooseSpecPage implements OnInit {
  // 是否有规格尺寸
  public hascs = true;
  // color+size
  public speccolor: any = [];
  public specsize: any = [];
  public singleprice: any = 0;
  public singlenum: any = 0;
  // 提交按钮
  public cansubmit = true;

  public slideItems = [];
  // 提交的数据
  public orderdata: any = {
    csarr: [],
    goods_id: '',
    //  process_id: '',
  };

  // 合计数量
  public totalnum: any = 0;
  public csarr = [];

  // 商品数据
  public goodsdetail: any = {
    goods_id: '',
    goods_name: ' ',
    market_price: ' ',
    shop_price: ' ',
    spec: [],
  };
  public goodsdata: any = [];

  // 可指派的加工厂列表
  public factorydata = [];
  // 选择的加工厂id
  public process_id = '';
  public process_name = '请选择';
  public result: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    //  public viewCtrl: ViewController,
    public api: Api,
    public alertCtrl: AlertController,
    public native: NativeService,
    //  public toast: Toast,
    public ModalController: ModalController,
    public activatedRoute: ActivatedRoute,
  ) {
    this.goodsdetail = this.navParams.get('goodsdetail');
    if (this.goodsdetail.spec.length != 0) {
      this.hascs = true;
      this.goodsdata = this.goodsdetail.spec;
      this.speccolor = this.goodsdata[1].spec ? this.goodsdata[1].spec : '';
      this.specsize = this.goodsdata[0].spec ? this.goodsdata[0].spec : '';
      this.speccolor.forEach(cval => {
        this.specsize.forEach(sval => {
          let obj = {
            citem_id: cval.item_id,
            citem: cval.item,
            sitem_id: sval.item_id,
            sitem: sval.item,
            num: 0,
            price: this.goodsdetail.cost_price,
          };
          this.csarr.push(obj);
        });
      });
    } else {
      this.hascs = false;
      this.singleprice = this.goodsdetail.cost_price;
      this.singlenum = 0;

      this.csarr = [{
        citem_id: 0,
        citem: '默认',
        sitem_id: 0,
        sitem: '默认',
        num: this.singlenum,
        price: this.singleprice,
      }];

    }
  }
  /** 初始化 */
  ngOnInit() { }
  /** 返回 上一页 */
  goback() {
    this.navCtrl.back();
  }
  /** 当将要进入页面时触发 */
  ionViewWillEnter() {
    console.log(this.goodsdetail.spec.length);
    console.log('csarr');
    console.log(this.csarr);
    this.getStoreList();
  }
  /** 关闭 modal */
  dismiss() {
    this.ModalController.dismiss();
  }
  /** 提交 */
  submit() {
    this.native.showLoading();

    this.cansubmit = false;

    if (this.totalnum == 0) {
      this.native.hideLoading();
      this.cansubmit = true;
      this.native.showToastTips('数量不能为0');
      //  this.native.testnativetoast();
      //  this.toast.show(`I'm a toast`, '500', 'center').subscribe(
      //    toast => {
      //      console.log(toast);
      //    }
      //  );
    } else {
      if (this.hascs) {
        this.orderdata.csarr = this.csarr;
      } else {
        this.orderdata.csarr = [{
          citem_id: 0,
          citem: '默认',
          sitem_id: 0,
          sitem: '默认',
          num: this.singlenum,
          price: this.singleprice,
        }];
      }
      this.orderdata.goods_id = this.goodsdetail.goods_id;
      this.orderdata.process_id = this.process_id;
      console.log('this.orderdata');
      console.log(this.orderdata);
      let arr = JSON.stringify(this.orderdata);
      this.api.postFormData('Cart/produceAddCart', { 'csarr': arr }).subscribe((res: any) => {
        console.log('submitorder');
        console.log(res);
        this.native.hideLoading();
        this.cansubmit = true;
        if (res.status == 1) {
          this.native.showToastTips(res.msg);
          this.ModalController.dismiss();
        } else {
          this.native.showToastTips(res.msg);
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  //  showtoast() {
  //    this.toast.show(`I'm a toast`, '500', 'center').subscribe(
  //      toast => {
  //        console.log(toast);
  //      }
  //    );
  //  }
  /** 获得 工厂列表 */
  getStoreList() {
    this.api.postFormData('Cart/processStoreList').subscribe((res: any) => {
      if (res.status == 1) {
        this.factorydata = res.result;
        //  this.factorydata.forEach((val, idx) => {
        //    if (idx == 0) {
        //      //  val.checked = true;
        //      this.process_id = val.process_id;
        //    }
        //  })
        console.log('this.factorydata');
        console.log(this.factorydata);
      }
    }, (err) => {
      console.log(err);
    });
  }
  /** 批量修改数量 */
  async changenum() {
    const prompt = await this.alertCtrl.create({
      header: '批量修改数量',
      inputs: [{
        name: 'batchname',
        placeholder: '输入数量',
        value: '',
        type: 'number',
      }],
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        }, {
          text: '保存',
          handler: data => {
            if (this.hascs) {
              this.csarr.forEach(val => {
                val.num = data.batchname;
              })
            } else {
              this.csarr[0]['num'] = data.batchname;
              this.singlenum = data.batchname;
            }

          }
        }
      ]
    });
    await prompt.present();
  }
  /** 批量修改单价 */
  async changeprice() {
    const prompt = await this.alertCtrl.create({
      header: '批量修改单价',
      inputs: [{
        name: 'batchname',
        placeholder: '输入价格',
        value: '',
        type: 'number',
      }],
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        }, {
          text: '保存',
          handler: data => {
            if (this.hascs) {
              this.csarr.forEach(val => {
                val.price = data.batchname;
              })
            } else {
              this.csarr[0]['price'] = data.batchname;
              this.singleprice = data.batchname;
            }

          }
        }
      ]
    });
    await prompt.present();
  }

  /**  计算总数量 */
  change(evt) {
    console.log(evt);
    this.totalnum = 0;
    if (this.hascs) {
      this.csarr.forEach(val => {
        if (parseInt(val.num) >= 0) {
          this.totalnum += parseInt(val.num);
        }
      })
    } else {
      this.totalnum = this.singlenum;
    }

  }
  /** 按键  按下 */
  keydown(evt) {
    return (Utils.checknumber(evt));
    //  Utils.checknumber(evt)
  }

  changefac(evt) {
    console.log(evt);
    this.process_id = evt;
    console.log('this.process_id_' + this.process_id);
  }

  changefaccc(evt) {
    console.log(evt);
    console.log(evt.target.value);
    this.process_id = evt.target.value;
  }
  /** 打开modal 搜索 工厂 */
  async gotosearh_factory() {
    // const modal = await this.ModalController.create({
    //   component: SearchFactoryPage,
    //   componentProps: { prop1: 345 }
    // });
    // await modal.present();
    // const { data } = await modal.onDidDismiss();
    // console.log(data);
    // if (data.status > 0) {
    //   this.alterfactory(data.item);
    // }
  }
  
  alterfactory(item) {
    this.process_id = item.store_id;
    this.process_name = item.store_name;
  }

  close() {
    this.ModalController.dismiss();
  }

}
