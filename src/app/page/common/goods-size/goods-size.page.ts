import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Api } from 'src/services/api';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NativeService, GlobalData } from 'src/services';
import { SignInPage } from '../../login/sign-in/sign-in.page';
import { IdentityPage } from '../../mine/identity/identity.page';
import { NewaddressPage } from '../../mine/newaddress/newaddress.page';
import { ProductAgreementPage } from '../product-agreement/product-agreement.page';
import { Utils } from 'src/services/Utils';
import { AlertController } from '@ionic/angular';
import { Login } from 'src/services/Login';


@Component({
  selector: 'app-goods-size',
  templateUrl: './goods-size.page.html',
  styleUrls: ['./goods-size.page.scss'],
})
export class GoodsSizePage implements OnInit {
  public type: string = ""; //保存商品是从那个区域过来的
  public goods_num = 1;  //保存购买商品数量,默认为一件
  goodsdetail: any = {
    goods_id: '',
    goods_name: ' ',
    market_price: ' ',
    shop_price: ' ',
    spec: [],
    goods_content: '',
    address: { info: '', month: '', day: '' },
    store_id: 0,
    store: {},
    code_type: '',
    images: [],
    store_no: 0,
    order_type: 0
  };
  goodsData: any = {};
  public wholesale_price: any;
  public now_stock: any;

  public isChecked = false; // 是否同意寄售协议
  public checkType = '1';   // boss批发订单选择类型，1：提货寄售, 2: 易货寄售.
  btn_status: any = false;
  public buyCount = 5; //购买数量,限购5个
  // initNum:number = 1
  spec=[
    // {
    //     "name":"尺码",
    //     "spec":[
    //         {
    //             "item_id":42,
    //             "item":"110",
    //             "src":null
    //         },
    //         {
    //             "item_id":44,
    //             "item":"100",
    //             "src":null
    //         },
    //         {
    //             "item_id":45,
    //             "item":"120",
    //             "src":null
    //         },
    //         {
    //             "item_id":46,
    //             "item":"130",
    //             "src":null
    //         },
    //         {
    //             "item_id":47,
    //             "item":"140",
    //             "src":null
    //         },
    //         {
    //             "item_id":48,
    //             "item":"80",
    //             "src":null
    //         },
    //         {
    //             "item_id":49,
    //             "item":"90",
    //             "src":null
    //         }
    //     ],
    //     "sname":"goods_spec[尺码]",
    //     "checkitem":42
    // }
  ];

  public isSelected = []; // 规格选中了哪个
   // 请求对象
   public obj = {
    'goods_id': '',
    'order_type': 1,
    'goods_num': 1,
  };
  public firstCheckItemIds = ''; // 首次选中的item_ids,格式：402,407,413
  public lastCheckItemIds = '';  // 最后选中的item_ids,格式：8,10
  public lastCheckItemValues = '';  // 最后选中的item_value,格式：红色,xxl
  public goodimg = '';
  public hasspec = true;
  



  constructor(
    private router: Router,
    public modalCtrl: ModalController,
    private Api: Api,
    private ActivatedRoute: ActivatedRoute,
    private native: NativeService,
    public navParams: NavParams,
    public alertController: AlertController,
    public login: Login,
    public _GlobalData: GlobalData,

  ) {
    
    this.ActivatedRoute.queryParams.subscribe((params: Params) => {
      this.type = params.type
      this.goodsdetail = this.navParams.get('goodsdetail') ? this.navParams.get('goodsdetail') : 0;
      this.goodsData = this.goodsdetail.goods;
      this.wholesale_price = this.goodsdetail.now_price;
      this.now_stock = this.goodsdetail.now_stock;
      this.spec = this.goodsdetail.spec;

        // console.log(this.goodsdetail,this.goodsData);

         // 初始化规格颜色
         for (let i = 0; i < this.spec.length; i++) {
          this.isSelected[i] = [];
          for (let j = 0; j < this.spec[i].spec.length; j++) {
            if (this.spec[i].checkitem == this.spec[i].spec[j].item_id) {
                this.isSelected[i][j] = false;
            }else {
                this.isSelected[i][j] = true;
            }
          }
      }
      // 初始选中的规格值
      for (let i = 0; i < this.spec.length; i++) {
          // this.isSelected[i][0] = false;
          this.obj[this.spec[i].sname] = this.spec[i].checkitem;
          // 首次选中spec_item_id,格式：3,10
          this.firstCheckItemIds += this.spec[i].checkitem + ',';
          // 首次选中item_values,格式：红色，xxl
          let spec_item_array = this.spec[i].spec;
          spec_item_array.forEach((item) => {
              if (item.item_id == this.spec[i].checkitem) {
                  this.lastCheckItemValues += item.item + ',';
              }
          });
      }
      if (this.spec.length > 0) {
          this.hasspec = true;
      } else {
          this.hasspec = false;
      }
      this.changeSpec(this.goodsdetail.goods_id, this.firstCheckItemIds);

    })

  }

  ngOnInit() {
  }

  async submit() {
    if (!this.isChecked) {
      this.native.showToastTips('请先阅读寄售协议，并勾选同意此协议');
      return true;
    }
    this.btn_status = true;
    // let spec = [];
    // let data = {
    //   order_type: 1,
    //   goods_id: this.goodsdetail.goods_id,
    //   goods_spec: spec,
    //   goods_num: this.goods_num,
    //   wholesale_type: this.checkType,

    // };
    this.obj.goods_num = this.goods_num;
    this.obj.goods_id = this.goodsdetail.goods_id;
    this.obj['wholesale_type'] =  this.checkType;
    this.Api.postFormData('Cart/one_step_buy', this.obj).subscribe(async (res: any) => {
      if (res.status == 1) {
        this.modalCtrl.dismiss();
        this.router.navigate(['fill-order'], { queryParams: { product_type: "1" } });
      } else {
        if (res.status == -31) {
          const modal = await this.modalCtrl.create({
            component: SignInPage,
            componentProps: {
              dosignup: true,
              type: 'edit'
            }
          });
          await modal.present();
        } else if (res.status == 5001) { // 已登录，未身份认证
          this.native.showToastTips(res.msg);
          this.login.goIdentityOrRegister();
        } else if (res.status == -10) {
          this.native.showToastTips(res.msg);
          const modal = await this.modalCtrl.create({
            component: NewaddressPage,
          });
          await modal.present();
        } else {
          this.native.showToastTips(res.msg);
        }
      }
    }, (err) => {
      console.log(err);
    })
    setTimeout(() => {
      this.btn_status = false;
    }, 1000);
  }

  // 弹出协议
  goProductAgreement() {
    this.modalCtrl.create({
      component: ProductAgreementPage,
    }).then(
      view => {
        view.present();
      }
    );
  }

  // 修改商品数量
  changenum(step) {
    let num = Utils.accAdd(this.goods_num, step);
    if (num < 1) {
      this.native.showToastTips('不能小于1');
    } else {

      if (this.goodsdetail.now_price * num > 50000) {
        this.native.showToastTips('单笔交易金额超过限额！');
        // this.goods_num = 1;
      } else {
        this.goods_num = num;
      }
      // console.log(this.buyCount);
      // if(this.type == '1' && num > this.buyCount){
      //   this.goods_num = this.buyCount;
      //   this.native.showToastTips('boss批发区商品一次性最多购买'+this.buyCount+'个！');
      // }
    }
  }

  /** 单笔交易金额超过限额！ */
  async presentAlert01() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message: '单笔交易金额超过限额！',
      buttons: ['确定']
    });
    await alert.present();
  }
  /** 单笔交易金额超过限额！ */
  async presentAlert02() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message: '请输入购买数量！',
      buttons: ['确定']
    });
    // this.goods_num = 1;
    await alert.present();
  }


  keydown(evt) {
    let num = evt.target.value;
    // console.log(num);

    if (!num) {
      this.presentAlert02()
      setTimeout(() => {
        this.goods_num = 1;
      }, 500);
    }
    if (this.type == '1' && this.goodsdetail.now_price * num > 50000) {
      setTimeout(() => {
        // this.native.showToastTips('单笔交易金额超过限额！');
        this.presentAlert01()
        this.goods_num = 1;
      }, 200)
    } else {
      this.goods_num = num;
    }
    // this.goods_num = num;
    // if(this.type == '2' && num > this.buyCount){
    //   setTimeout(()=>{
    //     this.goods_num = this.buyCount;
    //     this.native.showToastTips('批发区商品一次性最多购买'+this.buyCount+'个！');
    //   },200);
    // }
    return (Utils.checknumber(evt));
  }

  /** 关闭弹框 */
  dismiss() {
    this.modalCtrl.dismiss();
  }

  /** 选择规格 */
  chooseDesc(firstIndex, secondIndex) {
    let tempSpecKey = '';
    for (let i = 0; i < this.isSelected[firstIndex].length; i++) {
      this.isSelected[firstIndex][i] = true;
    }
    this.obj[this.goodsdetail.spec[firstIndex].sname] = this.goodsdetail.spec[firstIndex].spec[secondIndex].item_id;
    this.goodsdetail.spec[firstIndex].checkitem = this.goodsdetail.spec[firstIndex].spec[secondIndex].item_id;
    this.isSelected[firstIndex][secondIndex] = false;
    console.log(this.obj);

    //  选择规格时  其它内容跟着改变
    let spec_key = '';
    let spec_value = '';
    for (let item of this.goodsdetail.spec) {
      spec_key += ',' + item.checkitem;
      // 选中的商品规格值名称
      let spec_item_array = item.spec;
      spec_item_array.forEach((item_value) => {
          if (item_value.item_id == item.checkitem) {
              spec_value += item_value.item + ',';
          }
      });
    }
    spec_key = spec_key.slice(1, spec_key.length);
    // 选中的商品规格值
    this.lastCheckItemIds = spec_key ? spec_key : this.firstCheckItemIds;
    // 选中的商品规格值名称
    this.lastCheckItemValues = spec_value ? spec_value : this.lastCheckItemValues;

    this.changeSpec(this.goodsdetail.goods_id, spec_key);

  }

  /** 选择规格时  其它内容跟着改变 */
  changeSpec(goods_id, spec_key) {
    this.Api.postFormData('Goods/get_spec_price', {'goods_id': goods_id, 'spec_key': spec_key}).subscribe((res: any) => {
        if (res.status == 200 && res.data) {
            // 修改价格/库存/商品图片
            this.goodsdetail.shop_price = res.data.user_price ? res.data.user_price : (res.data.price ? res.data.price : this.goodsdetail.shop_price);
            this.goodsdetail.store_count = res.data.store_count ? res.data.store_count : this.goodsdetail.store_count;
            this.goodimg = res.data.spec_img ? res.data.spec_img : this.goodsdetail.original_img;
        }
    }, (err) => {
        console.log(err);
    });
}

}
