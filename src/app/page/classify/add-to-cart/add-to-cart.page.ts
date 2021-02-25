import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { Api, NativeService, Utils, GlobalData } from 'src/services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SignInPage } from 'src/app/page/login/sign-in/sign-in.page';
import {Login} from '../../../../services/Login';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.page.html',
  styleUrls: ['./add-to-cart.page.scss'],
})
export class AddToCartPage implements OnInit {
  // 测试keycode
  public keycode = '';

  // 请求对象
  public obj = {
    'goods_id': '',
    'order_type': '',
    'goods_num': 1,
    'store_no': ''
  };
  public isSelected = []; // 规格选中了哪个
  public buyCount = 5; // 购买数量,限购5个

  // 立即购买为1 加入购物车为0;
  public buynow = 0;

  public goodsdetail;

  public sizeid: any = '';
  public colorid: any = '';
  public num = 1;

  public goodimg = '';

  public hasspec = true;

  public specAndPrice; // 选择规格时  其它内容跟着改变

  public firstCheckItemIds = ''; // 首次选中的item_ids,格式：402,407,413
  public lastCheckItemIds = '';  // 最后选中的item_ids,格式：8,10
  public lastCheckItemValues = '';  // 最后选中的item_value,格式：红色,xxl


    public product_type = '0';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // public viewCtrl: ViewController,
    public api: Api,
    public native: NativeService,
    public element: ElementRef,
    public renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public router: Router,
    public _GlobalData: GlobalData,
    public login: Login
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.goodsdetail = this.navParams.get('goodsdetail');
        console.log('12321', this.goodsdetail);
        // this.product_type = this.goodsdetail.product_type ? this.goodsdetail.product_type :'0'
        this.num = this.goodsdetail.num ? this.goodsdetail.num : 1;
        this.buynow = this.navParams.get('buynow') ? this.navParams.get('buynow') : 0;
        // 初始化规格颜色
        for (let i = 0; i < this.goodsdetail.spec.length; i++) {
            this.isSelected[i] = [];
            for (let j = 0; j < this.goodsdetail.spec[i].spec.length; j++) {
              if (this.goodsdetail.spec[i].checkitem == this.goodsdetail.spec[i].spec[j].item_id) {
                  this.isSelected[i][j] = false;
              }else {
                  this.isSelected[i][j] = true;
              }
            }
        }
        // 初始选中的规格值
        for (let i = 0; i < this.goodsdetail.spec.length; i++) {
            // this.isSelected[i][0] = false;
            this.obj[this.goodsdetail.spec[i].sname] = this.goodsdetail.spec[i].checkitem;
            // 首次选中spec_item_id,格式：3,10
            this.firstCheckItemIds += this.goodsdetail.spec[i].checkitem + ',';
            // 首次选中item_values,格式：红色，xxl
            let spec_item_array = this.goodsdetail.spec[i].spec;
            spec_item_array.forEach((item) => {
                if (item.item_id == this.goodsdetail.spec[i].checkitem) {
                    this.lastCheckItemValues += item.item + ',';
                }
            });
        }
        if (this.goodsdetail.spec.length > 0) {
            this.hasspec = true;
        } else {
            this.hasspec = false;
        }
        this.goodimg = this.goodsdetail.images[0];
        this.buyCount = this._GlobalData.user.batch_num_limit;
        console.log(this._GlobalData.user.batch_num_limit);
        this.changeSpec(this.goodsdetail.goods_id, this.firstCheckItemIds);
    });
    this.lastCheckItemIds = this.firstCheckItemIds;
  }

  ngOnInit() {
  }
  /** 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发 */
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddtocartPage');
    console.log(this.element);
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
  /** 确定 */
  submit() {
    this.obj.goods_id = this.goodsdetail.goods_id;
    this.obj.order_type = this.goodsdetail.product_type;
    let goods_num = this.num;

    if (this.goodsdetail.order_type == '2') {
      this.obj.store_no = this.goodsdetail.store_no;
    } else {
      this.obj.store_no = '0';
    }
    this.obj.goods_num = goods_num;
    if (!/^[1-9]+\d*$/.test(goods_num.toString())) {
      this.native.showToastTips('请正确填写数量！');
      return;
    }
    if (this.hasspec) {
      if (goods_num <= 0) {
        this.native.showToastTips('请正确填写!');
        return;
      }
    } else {
      if (goods_num <= 0) {
        this.native.showToastTips('请正确填写!');
        return;
      }
    }
    console.log(this.obj)
    if (this.hasspec) {
      this.api.postFormData('Cart/generalAddCart', this.obj).subscribe((res: any) => {
        if (res.status == 1) {
          if (this.buynow == 1 || this.obj.order_type == '2') {
            this.router.navigate(['/tabs/cart'], { queryParams: { type: this.obj.order_type } });
            this.modalCtrl.dismiss();
          } else {
            this.native.showToastTips(res.msg);
            this.modalCtrl.dismiss();
          }
        } else if (res.status == -31) {
          this.modalCtrl.create({
            component: SignInPage,
            componentProps: {
              dosignup: true,
              type: 'edit'
            }
          }).then(
            view => {
              view.present();
            }
          );
        } else {
          this.native.showToast(res.msg);
        }
      }, (err) => {
        console.log(err);
      })
    } else {
      console.log('!this.hasspec1111');
      this.api.postFormData('Cart/generalAddCart', this.obj).subscribe((res: any) => {
        if (res.status == 1) {
          if (this.buynow == 1 || this.obj.order_type == '2') {
            this.router.navigate(['/tabs/cart'], { queryParams: { type: this.obj.order_type } });
            this.modalCtrl.dismiss();
          } else {
            this.native.showToastTips(res.msg);
            // this.viewCtrl.dismiss();
            this.modalCtrl.dismiss();
          }
        } else {
          if (res.status == -31) {
            this.modalCtrl.create({
              component: SignInPage,
              componentProps: {
                dosignup: true,
                type: 'edit'
              }
            }).then(
              view => {
                view.present();
              }
            );
            return;
          }else if(res.status == 5001){
            this.native.showToastTips(res.msg);
            this.login.goIdentityOrRegister();
          }
          this.native.showToastTips(res.msg);
          this.chooseSize();

        }
      }, (err) => {
        console.log(err);
      })
    }

  }
  /** 修改数量 */
  changenum(step) {
    let num = Utils.accAdd(this.num, step);
    if (num < 1) {
      this.native.showToastTips('不能小于1');
    } else {
      this.num = num;
      if (this.goodsdetail.order_type == 2 && this.num > this.buyCount) {
        this.num = this.buyCount;
        this.native.showToastTips('批发区商品一次性最多购买' + this.buyCount + '个！');
      }
    }
  }
  /** 键盘按下 */
  keydown(evt) {
    this.num = evt.target.value;
    if (this.goodsdetail.order_type == 2 && this.num > this.buyCount) {
      setTimeout(() => {
        this.num = this.buyCount;
        this.native.showToastTips('批发区商品一次性最多购买' + this.buyCount + '个！');
      }, 200);
    }
    return (Utils.checknumber(evt));
  }

  /** 选择规格时  其它内容跟着改变 */
  changeSpec(goods_id, spec_key) {
      this.api.postFormData('Goods/get_spec_price', {'goods_id': goods_id, 'spec_key': spec_key}).subscribe((res: any) => {
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

  scrollToTop(evt) {
    // console.log(evt);
  }


  chooseSize(){
    console.log(this.lastCheckItemIds);
    console.log(this.lastCheckItemValues);

    this.modalCtrl.dismiss({
      'goods_id' : this.goodsdetail.goods_id,
      'goods_num' : this.num,
      'spec_values' : this.lastCheckItemValues, // 选中规格的中文信息
      'spec_ids': this.lastCheckItemIds,        // 选中规格的item_ids,格式：8,10
    });
  }
}
