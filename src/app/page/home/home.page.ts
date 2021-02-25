import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Api, NativeService, Utils, WechatConfig } from 'src/services';
import { FILE_OFFLINE_SERVE_URL, IS_DEBUG, FILE_ONLINE_SERVE_URL } from 'src/services/Constants';
import { DescriptionDocPage } from '../mine/description-doc/description-doc.page';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  public url = FILE_OFFLINE_SERVE_URL;

  // ion-slides 的参数  swiper
  slideOpts = {
    speed: 500,
    loop: true,
    zoom: false,
    setWrapperSize: true,
    direction: 'horizontal',
    autoplay: {
      delay: 2000,
      disableOnInteraction: false, // 禁用交互 设成 false
    },
  };

  public homePage = 1; // 精选请求的页数
  public otherLastPage = 100; // 总页数
  public otherPage = 1; // 其它当前页数
  public lastPage = 100; // 总页数
  public show_loading = true; // 精选 是否显示触底加载
  public hasMore = false; // 其它 是否显示触底加载
  public progress = 0; // 页面数据同步出现
  public items = [];   // 保存页面数据
  public news = [];    // 新品专区/三小图1.0
  public cat = [];                // 分类商品数据

  public isJingXuan = true; // 是否是精选
  public categoryList = [];       // 商品分类的列表
  public categoryListItem = [];   // 商品分类的
  public is_checked_category = -1; // 选中的一级分类
  public app_version: any; // 线上最新的版本
  public showModal = false; // 是否显示更新的弹框
  // 保存下载地址
  public download = {
    // url: 'http://mall.rossai.cn/app_download/app-debug.apk',
    url: 'http://qiniu.zhonglianxf.com/zn1105.apk',
    // url: Utils.localStorageGetItem('appUrl'),
  };

  public category_id = '0'; // 商品第三级分类
  public goods_ids = '';    // 商品goods_id，如：856,890,962
  public product_type = '0'; // 商品的类型，0：全部商品，1：boss批发区商品，2：零元区商品，3：福利区商品，4：易货区商品

  public products: any[] = []; // 其他选项显示商品

  constructor(
    private router: Router,
    private api: Api,
    private nativeService: NativeService,
    public utils: Utils,
    private activatedRoute: ActivatedRoute,
    public modelCtrl: ModalController,
    public wconf: WechatConfig,  //二维码扫面

  ) {
    if (IS_DEBUG) {
      this.url = FILE_OFFLINE_SERVE_URL;
    } else {
      this.url = FILE_ONLINE_SERVE_URL;
    }
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.homePage = 1;
    this.otherPage = 1;
    this.lastPage = 100;
    this.items = [];
    this.getIndexConfig();
    this.fetchList();
    this.clickJingXuan(-1);
    // });
  }

  ngOnInit() {
    this.getVersion();
  }

  ionViewWillEnter() {
    // this.getVersion();
  }

  /** 精选 获取页面数据  魔法首页 */
  getIndexConfig() {
    let tempItems = []; // 临时的存储数组
    this.show_loading = true;
    this.api.get('index/ajaxGetMagicMore?page=' + this.homePage).subscribe(
      (res: any) => {
        if (res.data.data.length > 0) {
          this.progress += 50;
          tempItems = res.data.data;
          this.items.push(...tempItems);
        } else {
          this.lastPage = 0;
          this.show_loading = false;
          // this.nativeService.showToast('没有更多数据了！', 2000);
        }
      },
      (err) => {
        this.progress += 50;
        console.log('获取页面数据的错误信息', err);
        if (this.progress == 100 || this.progress > 50) {
          this.nativeService.hideLoading();
        }
      }
    );
  }

  /** 请求 顶部的 分类 列表数据 */
  fetchList() {
    this.api.postFormData('Index/getChildCategory?level=2').subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.categoryList = res.data;
          // console.log('请求 顶部的 分类 列表数据', this.categoryList);
          this.categoryListItem = res.data[0].wechat_child_category;
          this.is_checked_category = -1;
        } else {
          this.nativeService.showToast(res.msg);
        }
      },
      (err) => {
        console.error('ERROR', err);
      }
    );
  }

  /** 切换到 分类 精选 */
  clickJingXuan(myIndex) {
    this.isJingXuan = true;
    this.show_loading = true;
    this.hasMore = false;
    this.is_checked_category = myIndex;
  }
  /** 分类选项卡 切换 */
  changeSegment(myIndex) {
    this.isJingXuan = false;
    this.hasMore = true;
    this.show_loading = false;
    this.otherPage = 1;
    this.products = [];
    this.is_checked_category = myIndex;
    let parent_id = this.categoryList[myIndex].id;
    this.api.postFormData('Index/getChildCategory', { level: 3, parent_id: parent_id }).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.categoryListItem = res.data;
          // 取三级分类中 第二级的所有id， 拼接成string
          let spec_key = '';
          for (let item of this.categoryListItem) {
            spec_key += ',' + item.id;
            // console.log('选择规格时  其它内容跟着改变001', spec_key);
          }
          this.category_id = spec_key.slice(1, spec_key.length);
          // console.log('选择规格时  其它内容跟着改变002', this.category_id);
        }
      },
      (err) => {
        console.error('ERROR', err);
      }
    );
    setTimeout(() => {
      console.log('分类选项卡 切换', this.isJingXuan);
      this.getGoodsList();
    }, 500);
  }

  /** 获取其他分类的商品   */
  getGoodsList() {
    let data = {
      'category_id': this.category_id,
      'order': '',
      'sort': '',
      'goods_ids': this.goods_ids,
      'page': this.otherPage,
      'product_type': this.product_type
    };
    console.log('获取其他分类的商品请求参数', data);
    this.api.get('Goods/getGoodsList', data).subscribe(
      (res: any) => {
        if (res.data.data.length > 0) {
          console.log('获取其他分类的商品返回数据', res);
          this.products = [...this.products, ...res.data.data];
          console.log(this.products);
        } else {
          this.otherLastPage = 0;
          this.hasMore = false;
          // this.nativeService.showToast('没有更多数据了！', 2000);
        }
      },
      (err) => {
        console.error('ERROR', err);
      }
    );
  }

  /**  跳转信息页 信息中心 */
  goInfo() {
    this.router.navigate(['share-profit']);
  }

  /** 跳转boss专区 */
  goBossArea() {
    this.router.navigate(['boss-area']);
  }

  /** 跳转到第三方页面，用iframe框包裹 */
  goIframe(evt, url) {
    // 阻止事件冒泡
    if (evt.preventDefault) {
      evt.stopPropagation();
    }

    if (Utils.isUrl(url)) {
      this.gotourl(url);
    }
  }
  /** 跳转到 app外的 iframe */
  async gotourl(url) {
    const modal = await this.modelCtrl.create({
      component: DescriptionDocPage,
      cssClass: 'modelBox',
      componentProps: {
        url: url,
        title: '合作伙伴'
      }
    });
    await modal.present();
  }

  /** 跳转到商品列表 */
  gocat($event, areaType) {
    this.router.navigate(['goods-list'], { queryParams: { type: areaType } });
  }
  /**  跳转到商品列表    没有参数 */
  goproduct() {
    this.router.navigate(['goods-list']);
  }
  // 跳转到商品列表页面
  goList() {
    this.router.navigate(['goods-list'], { queryParams: { type: "public" } });
  }
  /** 跳到商品详情 */
  godetail(evt, goodsId, productType) {
    // 阻止事件冒泡
    if (evt.preventDefault) {
      evt.stopPropagation();
    }
    this.router.navigate(['goods-detail'], { queryParams: { goods_id: goodsId, product_type: productType } });
  }
  /** 模块跳转 */
  gomodel(evt, model) {
    // 阻止事件冒泡
    if (evt.preventDefault) {
      evt.stopPropagation();
    }
    // 零元区zero-area, 易获区barter-area, 福利区fuli-area, boss区boss-area, 商品列表goods-list?store_id=15
    let modelArray = model.split('?');
    let data = {
      is_true: true,
    };
    if (modelArray.length > 1) {
      let param = modelArray[1].split('=');
      data[param[0]] = param[1];
    }
    this.router.navigate([modelArray[0]], { queryParams: data });
  }

  /**  精选 触底 加载 */
  loadData(event) {

    // 精选
    if (this.isJingXuan == true) {
      this.homePage++;
      setTimeout(() => {
        // 获取页面数据
        this.getIndexConfig();
        // 告诉ion-infinite-scroll数据已经更新完成
        event.target.complete();
      }, 1000);
      setTimeout(() => {
        if (Number(this.homePage) < Number(this.lastPage)) {
          this.homePage = Number(this.homePage) + 1;
          this.getIndexConfig();
        }
        event.target.complete();
      }, 1000);
    }

  }
  /** 其它 触底 加载 */
  loadDataOther(event) {
    // 其它 类别
    if (this.isJingXuan == false) {
      console.log('其它触底加载个更多');
      this.otherPage++;
      setTimeout(() => {
        this.getGoodsList();
        event.target.complete();
      }, 1000);
      setTimeout(() => {
        if (Number(this.otherPage) < Number(this.otherLastPage)) {
          this.otherPage = Number(this.otherPage) + 1;
          this.getGoodsList();
        }
        event.target.complete();
      }, 1000);
    }

  }


  /** 回到顶部 */
  gotoTop() {
    this.content.scrollToTop(0);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  /** 检测是否有新的版本可更新 */
  // getVersion() {
  //   this.api.get('index/getAppVersion').subscribe(
  //     (res: any) => {
  //       if (res.status == 200) {
  //         this.app_version = res.data;
  //         document.addEventListener('deviceready', () => {
  //           let localAppVersion = window.AppVersion.build;
  //           if (this.app_version != localAppVersion) {
  //             this.showModal = true;
  //           }
  //         });
  //       }
  //     },
  //     (err) => {
  //       console.log(JSON.stringify(err));
  //     }
  //   );
  // }

  /** 获取线上最新的版本号 */
  getVersion() {
    this.api.get('User/getAppVersion').subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.app_version = res.data.appversion['0'];
          Utils.localStorageSetItem('appUrl',res.data.url['0'])
          this.download.url = Utils.localStorageGetItem('appUrl')
          // alert('线上最新的版本号111:'+res.data); // 1105
          // this.showModal = true;
          document.addEventListener('deviceready', () => {
            // console.log('插件1', window.AppVersion.build);
            // 插件1
            let versionCode = window.AppVersion.version;
            // alert('本地版本222：'+versionCode); // 0.11.5
            this.showModal = (this.app_version == versionCode) ? false : true;
          });
        }
      },
      err => {
        console.error('ERROR', err);
      }
    );
  }

  /** 取消更新App */
  cancel() {
    this.showModal = false;
  }

  /** 更新App */
  update() {
    this.showModal = false;
    Utils.testAppVersion();
  }

  /** 扫描二维码  条形码 */
  scanner() {
    // this.Api.get('WechatOauth/getwc_config').subscribe((res:any) => { },(err)=>{});
    if (this.wconf.isWeiXin()) {
      this.wconf.scan().then((res) => {
        console.log(res);
      }, (err) => { alert(err); });
    }
  }

  /* 跳转消息页 */
  goNotice(){
    this.router.navigate(['notice']);

  }
}
