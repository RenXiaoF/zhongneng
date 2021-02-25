import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Utils, NativeService, Api, WechatConfig } from 'src/services';
import { PopoverController, ModalController, NavController, ActionSheetController, IonContent } from '@ionic/angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AddToCartPage } from '../add-to-cart/add-to-cart.page';
import { ChooseSpecPage } from '../choose-spec/choose-spec.page';
// import { PopoverMainPage } from '../popover-main/popover-main.page';
import * as constants from 'src/services/Constants';
import { GlobalData } from 'src/services/GlobalData';
import { SignInPage } from '../../login/sign-in/sign-in.page';
import { IdentityPage } from '../../mine/identity/identity.page';
import { MyaddressPage } from '../../mine/myaddress/myaddress.page';
import { NewaddressPage } from '../../mine/newaddress/newaddress.page';
import { Login } from '../../../../services/Login';
@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.page.html',
  styleUrls: ['./goods-detail.page.scss'],
})
export class GoodsDetailPage implements OnInit {
  // 轮播图配置属性  1
  public slideOpts = {
    speed: 500,
    loop: true,
    zoom: false,
    setWrapperSize: true,
    direction: 'horizontal',
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
  };

  public isProduce = false; // 保存改变规格是否会影响商品价格，默认false为改变规格不影响价格
  public share_user_id = '';
  public get_user_id = '';
  public is_weixin = false;
  public detailtype = 'detailgoods';
  public browserHeight = 10;
  public domHeight = 10;
  public ShareObj = { title: '', desc: '', link: '', imgUrl: '' };

  public goods_id: any;
  public goodsdetail: any = {
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
    reserve_param: '',
  };
  role = {
    type: 1,
    name: '',
  };


  slideItems = []; // 商品数据
  price_left: ''; // 小数点左边价格
  price_right: ''; // 小数点右边价格
  iscollect = false; // 是否收藏
  evaluate = { // 评价相关
    count: 0,
    commentStatistics: {},
    commentRateStatistics: {
      rate1: 0, // 好评率
      rate2: 0, // 中评率
      rate3: 0 // 差评率
    },
    commentlist: []
  };
  type = 1; // 评价类型,默认1(1 全部， 2好评， 3 中评， 4差评， 5晒图)
  evaluatetype = [
    { 'cname': 'c0', 'name': '全部', 'type': 1, 'num': 0, 'checked': true },
    { 'cname': 'c1', 'name': '好评', 'type': 2, 'num': 0, 'checked': false },
    { 'cname': 'c2', 'name': '中评', 'type': 3, 'num': 0, 'checked': false },
    { 'cname': 'c3', 'name': '差评', 'type': 4, 'num': 0, 'checked': false },
    { 'cname': 'c4', 'name': '有图', 'type': 5, 'num': 0, 'checked': false },
  ];
  // 详情数据
  infotype = 'tab1';
  goods_content = '';
  goods_attr = '';
  goods_service = '';
  // 推荐数据
  store = {
    store_name: ' ',
  };
  goodslists: any = [];

  // 导航栏
  // header 透明度
  public _opacity = 0;
  // 滚动距离
  public _scrollTop = 0;
  headerheight: any; // header高度

  public can_update = false; // 是否可以更新商品

  public product_type = '0';  // 商品类别，0：全部商品，1：boss批发区商品，2：零元区商品，3：福利区商品，4：易货区商品

  tips = '';
  col_size = 3;
  timer: any = null;
  takeInfo = "您操作过于频繁，请稍后重试！";
  is_reserve = 0;

  public choose_spec_ids = '';    // 选中规格值id
  public choose_spec_num = '1';  // 选中规格值id
  public choose_spec_values = ''; // 选中规格值id

  @ViewChild('goodsdetailContent', { static: false }) goodsdetailContent: any;
  @ViewChild('goodsfooter', { static: false }) goodsfooter: any;
  // 回到顶部
  @ViewChild(IonContent, { static: false }) content: IonContent;





  constructor(
    public navCtrl: NavController,
    // public navParams: NavParams,
    public modalCtrl: ModalController,
    public api: Api,
    public element: ElementRef,
    private renderer: Renderer2,
    public popoverCtrl: PopoverController,
    public native: NativeService,
    public activated: ActivatedRoute,
    public router: Router,
    public wconf: WechatConfig,
    public GlobalData: GlobalData,
    // public toast: Toast,
    public actionSheetController: ActionSheetController,
    public login: Login
  ) {
    this.activated.queryParams.subscribe((params: Params) => {
      this.isProduce = params['isProduce'];
      if (params['goods_id']) {
        this.goods_id = params['goods_id'];
      }
      if (params['role']) {
        this.role = params['role'];
      }
      if (params['user_id']) {
        this.get_user_id = params['user_id'];
      }

      if (params['product_type']) {
        this.product_type = params['product_type'];
        this.tips = this.product_type == '1' ? 'boss批发区商品' : (this.product_type == '2' ? '零元区商品' : (this.product_type == '3' ? '福利区商品' : (this.product_type == '4' ? '易货区商品' : '')));
        this.col_size = this.product_type == '0' ? 3 : 6;
      }

      if (params['is_reserve']) {
        this.is_reserve = params['is_reserve'];
        this.tips = ((this.is_reserve == 1) && (this.product_type == '4')) ? '预售区商品' : this.tips;
      }
    });
    console.log(this.role);
    this.share_user_id = this.GlobalData.user.user_id;

    this.can_update = this.GlobalData.user.can_update;
  }

  ngOnInit() {
  }

  /** 页面即将进入时加载 */
  ionViewWillEnter() {
    // 获取评价
    this.getevaluate(this.goods_id, this.type);
    // 获取详情
    this.getGoodsContent(this.goods_id);
    // 获取推荐
    this.getRecommendGoods();
    // 获取商品
    this.getdetails(this.goods_id);
    this.slideItems = [];
  }
  /** 获取商品  */
  getdetails(goods_id) {
    this.api.postFormData('Goods/goodsInfo', { 'goods_id': goods_id }).subscribe((res: any) => {
      console.log('getdetails');
      console.log(res);
      if (res.status == 1) {
        this.goodsdetail = res.result;

        // this.goodsdetail.goods_content = Utils.imgUrlConversion(this.goodsdetail.goods_content);

        this.price_left = this.goodsdetail.shop_price.split('.')[0];
        this.price_right = this.goodsdetail.shop_price.split('.')[1];
        console.log(this.price_left, this.price_right);

        this.iscollect = this.goodsdetail.goods_is_collect ? true : false;
        this.slideItems = res.result.images; // 轮播图
        // 配置分享链接
        this.ShareObj.title = this.goodsdetail.goods_name;
        this.ShareObj.desc = this.goodsdetail.goods_remark;
        this.ShareObj.link = window.location.href + '&user_id=' + this.share_user_id;
        this.ShareObj.imgUrl = constants.FILE_ONLINE_SERVE_URL + this.goodsdetail.original_img;
        // 设置默认选中规格值
        if (this.goodsdetail.spec.length > 0) {
          this.getGoodsSpec();
        }
        if (this.wconf.isWeiXin()) {
          this.wconf.ShareObj = this.ShareObj;
          let askurl = encodeURIComponent(window.location.href.split('#')[0]);
          console.log("当前askURL:" + askurl);
          this.wconf.init_wx_conf(askurl);
          this.is_weixin = true;
        }
        // 配置分享链接
      } else {

      }
    }, (err) => {
      console.log(err);
    });
  }
  /** 获取推荐 */
  getRecommendGoods() {
    let goods_id = this.goods_id;
    let num = '';
    let store_id = '';
    this.api.get('Goods/getRecommendGoods', {
      'goods_id': goods_id,
      'num': num, 'store_id': store_id
    }).subscribe((res: any) => {
      console.log('getRecommendGoods');
      console.log(res);
      if (res.status == 1) {
        this.goodslists = res.result.recommend_goods_list;
        this.store = res.result.store;
      } else {

      }
    }, (err) => {
      console.log(err);
    });
  }
  /** 获取评价 */
  getevaluate(goods_id, type) {
    let commentType = type ? type : 1;
    this.api.postFormData('Goods/ajaxComment', { 'goods_id': goods_id, 'commentType': commentType }).subscribe((res: any) => {
      console.log('getevaluate');
      console.log(res);

      if (res.status == 1) {
        this.evaluate = res.result;
        let commentStatistics = this.evaluate.commentStatistics;
        this.evaluate.commentlist = this.evaluate.commentlist.slice(0, 3);
        // 评价数量
        for (let key in commentStatistics) {
          this.evaluatetype.forEach((cval) => {
            if (cval.cname == key) {
              cval.num = commentStatistics[key];
            }
          })
        }
        // 每个评价的星数
        this.evaluate.commentlist.forEach((val) => {
          val.goodstar = new Array(parseInt(val.goods_rank));
          val.badstar = new Array(5 - val.goods_rank);
        });

      } else {
        this.evaluate = res.result;
        console.log(res.msg);
      }
    }, (err) => {
      console.log(err);
    });
  }
  /** 获取详情 */
  getGoodsContent(goods_id) {
    this.api.postFormData('Goods/getGoodsContent', { 'goods_id': goods_id }).subscribe((res: any) => {
      console.log('getGoodsContent');
      console.log(res);
      if (res.status == 1) {
        // this.goods_content = Utils.imgUrlConversion(res.result.goods_content);
        this.goods_content = res.result.goods_content;
        this.goods_attr = res.result.goods_attr;
        this.goods_service = res.result.goods_service;
      } else {
        console.log(res.msg);
      }
    }, (err) => {
      console.log(err);
    });
  }
  /** 加入购物车 */
  async addtocart() {
    const modal = await this.modalCtrl.create({
      component: AddToCartPage,
      componentProps: {
        goodsdetail: this.goodsdetail,
        isProduce: this.isProduce,
        get_user_id: this.get_user_id,
        buynow: 0,
        cssClass: 'loadAddtocart',
      }
    });
    await modal.present();
  }
  /** 去到 购物车 */
  gotocart() {
    this.router.navigate(['/tabs/cart']);
  }
  /** 联系客服 */
  contactKF() {
    // window.location.href = "tel:020-32051231";
  }
  /** 联系客服，webSocket */
  contact_customer() {
    // const user_id = this.GlobalData.user.user_id;
    // if (user_id) {
    //   window.location.href = 'http://cloudpf.weunit.cn:9501/demo/index/chat?user_id=' + user_id + '&randmon=' + Math.random();
    // } else {
    //   this.router.navigate(['login']);
    // }
  }
  /** 跳转到当前店铺 */
  goStore() {
    // this.router.navigate(['store'], {
    // this.router.navigate(['product'], {
    //   queryParams: {
    //     storeId: this.goodsdetail.store_id,
    //   }
    // });
  }
  /** 立刻购买 */
  async buynow() {
    if (this.product_type == '0') {
      const modal = await this.modalCtrl.create({
        component: AddToCartPage,
        componentProps: {
          goodsdetail: this.goodsdetail,
          isProduce: this.isProduce,
          get_user_id: this.get_user_id,
          buynow: 1,
          cssClass: 'loadAddtocart',
        }
      });
      await modal.present();
    } else {
      this.router.navigate(['fill-order'], { queryParams: { product_type: this.product_type } });
    }
  }
  /** 零元区，福利区，易货区，boss区直接跳支付页   预售区 */
  immediatelyBuy() {
    let data = {
      order_type: this.product_type,
      goods_id: this.goodsdetail.goods_id,
      goods_num: this.choose_spec_num,
      goods_spec: this.choose_spec_ids,
    };
    this.api.postFormData('Cart/one_step_buy', data).subscribe(async (res: any) => {
      if (res.status == 1) {
        this.router.navigate(['fill-order']);
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
        } else if (res.status == 5001) {
          this.native.showToastTips(res.msg);
          this.login.goIdentityOrRegister();
        } else if (res.status == -10) {
          this.native.showToastTips(res.msg);
          // const modal = await this.modalCtrl.create({
          //   component: MyaddressPage,
          //   componentProps: {
          //     chooseaddress: true,
          //   }
          // });
          // await modal.present();
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
  }

  /** 生产单选择颜色尺寸 */
  async openspec() {
    const modal = await this.modalCtrl.create({
      component: ChooseSpecPage,
      componentProps: {
        goodsdetail: this.goodsdetail,
      }
    });
    await modal.present();
  }

  /** 团订跳转页面 */
  async opentuanding() {
    this.router.navigate(['grouporder']);
  }

  /** 收藏 */
  collect(goods_id) {
    this.api.postFormData('User/collect_goods', { goods_id: goods_id }).subscribe((res: any) => {
      if (res.status == 200) {
        if (res.data.type == 1) {
          this.iscollect = true;
        } else {
          this.iscollect = false;
        }
      }
    }, (err) => {
      console.log(err);
    });
  }

  /** 所有评价 */
  gotodetailevaluate() {
    this.detailtype = 'detailevaluate';
  }

  /** 商品详情 */
  gotodetail(goods) {
    this.router.navigate(['goods-detail'], {
      queryParams: {
        goods_id: goods.goods_id,
        role: this.role,
      }
    });
  }

  /** 评价类型 */
  chooseevaluatetype(type) {
    this.evaluatetype.forEach((val) => {
      val.checked = false;
      if (val.type == type) {
        val.checked = true;
      }
    });
    this.getevaluate(this.goods_id, type);
  }
  /** 分类 的 段 发生变化 */
  segmentChanged(evt) {
    // margin高度
    if (evt.detail.value == "detailgoods") {
      this.renderer.setStyle(this.goodsdetailContent.nativeElement, 'margin-top', '0');
    } else {
      this.renderer.setStyle(this.goodsdetailContent.nativeElement, 'margin-top', `${this.headerheight}px`);
    }
    // this.updatestyle(evt);
  }

  /** 监听滚动 */
  scrollToTop(evt) {
    if (this.detailtype == "detailgoods") {
      this.updatestyle(evt);
    }
  }

  /**  更新导航栏样式 */
  updatestyle(event) {
    this._scrollTop = event.detail.scrollTop;
    this._opacity = event.detail.scrollTop / 235;
    const detailNavBar = document.getElementsByClassName("detailNavBar")[0].firstElementChild;
    // if (this._opacity > 0.1){ this._opacity = 1 }
    // if (this._opacity < 0.1){ this._opacity = 0.1 }
    if ( event.detail.scrollTop > 5 ) {
      this.renderer.setStyle(detailNavBar, 'background', '#fff');
    }else{
      this.renderer.setStyle(detailNavBar, 'background', 'rgba(0, 0, 0, 0)');
    }
    this.renderer.setStyle(detailNavBar, 'background', 'rgba(0, 0, 0, ' + this._opacity +')');
  }

  /** 更多功能 */
  // async more(myEvent) {
  //   let popover = await this.popoverCtrl.creargba((136,136,136, 0)ent: PopoverMainPage,
  //     componentProps: {
  //       navActive: this.nrgba((136,136,136, 0)vent: myEvent,
  //       goods_id: this.goods_id,
  //       more_type: 'goods-detail'
  //     }
  //   });
  //   await popover.present();
  // }

  /** actionSheet 弹框 */
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '和大家一起分享你发现的好物吧',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: '分享',
          icon: 'share',
          handler: () => {
            this.openMask();
          }
        },
        {
          text: '生成分享海报',
          icon: 'aperture',
          handler: () => {
            this.router.navigate(['share'], { queryParams: { 'goods_id': this.goods_id } });
          }
        },
        {
          text: '关闭',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }

  /** 返回 */
  goback() {
    this.navCtrl.back();
    // this.router.navigate(['goods-list']);
  }

  // 定时弹幕

  public isShowCoupon = true;
  public isShowMask = false;

  /** 打开分享 */
  openMask() {
    this.isShowMask = true;
  }
  /** 关闭分享 */
  closeMask() {
    this.isShowMask = false;
  }
  /**  关闭优惠 */
  closeCoupon() {
    this.isShowCoupon = false;
  }

  /** 回到顶部 */
  gotoTop() {
    this.content.scrollToTop(0);
  }

  /** 更新商品 */
  updateGoods() {
    this.router.navigate(['update-goods'], { queryParams: { goods_id: this.goods_id } });
  }


  /** 专区选择规格 */
  async chooseSize() {
    const modal = await this.modalCtrl.create({
      component: AddToCartPage,
      componentProps: {
        goodsdetail: this.goodsdetail,
        isProduce: this.isProduce,
        get_user_id: this.get_user_id,
        buynow: 0,
        product_type: this.product_type,
        cssClass: 'loadAddtocart',
      }
    });
    await modal.present();
    await modal.onDidDismiss().then((e) => {
      let goods_size = e['data'];
      console.log(goods_size);
      if (goods_size) {
        this.choose_spec_values = goods_size.spec_values;
        this.choose_spec_num = goods_size.goods_num ? goods_size.goods_num : '1';
        this.choose_spec_ids = goods_size.spec_ids;
      }
    });
  }

  /** 设置默认选中商品规格值 */
  getGoodsSpec() {
    this.choose_spec_ids = '';
    let spec_all = this.goodsdetail.spec;
    let spec_value = [];
    let data = {
      order_type: this.product_type,
      goods_id: this.goodsdetail.goods_id,
      goods_num: 1,
    };
    let specDefaultValue = '';
    spec_all.forEach((item) => {
      data[item.sname] = item.checkitem;
      this.choose_spec_ids += item.checkitem + ',';

      // 选中的商品规格值名称
      let spec_item_array = item.spec;
      spec_item_array.forEach((item_value) => {
        if (item_value.item_id == item.checkitem) {
          specDefaultValue += item_value.item + ',';
        }
      });
    }); console.log(specDefaultValue);
    this.choose_spec_values = specDefaultValue;
  }

  /** 设置默认选中商品规格值 */
  async throttle(fn) {
    // console.log(this.timer);
    if (!this.timer) {
      await fn.apply(this)
      this.timer = setTimeout(() => {
        this.timer = null;
      }, 2000)
    } else {
      this.native.showToastTips(this.takeInfo);
    }
  }
}
