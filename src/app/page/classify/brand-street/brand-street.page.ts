import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api, NativeService } from '../../../../services';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-brand-street',
  templateUrl: './brand-street.page.html',
  styleUrls: ['./brand-street.page.scss'],
})
export class BrandStreetPage implements OnInit {

  public segments = [];    // 分类
  public listType = '';
  public products = [];     // 商品列表信息
  public searchname = '';   // 搜索的商品名称
  public category_id = '0'; // 商品第三级分类
  public order = '';  // 排序字段
  public sort = '';      // 排序顺序
  public page = 1;          // 当前页数
  public lastPage = 1000;   // 页数
  public goods_ids = '';    // 商品goods_id，如：856,890,962
  public product_type = '0'; // 商品的类型，0：全部商品，1：boss批发区商品，2：零元区商品，3：福利区商品，4：易货区商品
  public data = true;        // 保存页面是否有数据状态，true为有数据，false为无数据
  public store_id: any;       // 店铺的store_id

  public lookType = 'two';   // 商品显示外观
  btnFill: string = 'outline'; 
  btnText: string = '未关注';
  fansNum: string = '0';
  storeInfo: any = {};
  footerNav = [
    {name:'店铺首页',icon:'home-outline'},
    {name:'全部商品',icon:'bag-handle-outline'},
    {name:'活动',icon:'pricetag-outline'},
    {name:'商品分类',icon:'grid-outline'},
    {name:'客服',icon:'person-circle-outline'}
  ];
  isChecked = 0

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private native: NativeService,
    public nav: NavController,

  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.product_type = params.type ? params.type : '0';
      this.category_id = params.category_id ? params.category_id : '0';
      this.store_id = params.storeId ? params.storeId : 0;
      this.store_id = params.store_id ? params.store_id : this.store_id;
    });

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.sort = ''
    this.initNavData();
    this.changeSegment(0);
    this.lastPage = 1000;
    this.data = true;
    this.getStoreInfo();
  }

  /** 商品列表搜索项 */
  initNavData() {
    let nav = [
      { name: "综合", isChecked: true },
      { name: "销量", isChecked: false },
      { name: "价格", isChecked: false },
    ];
    this.segments = nav;
  }

  // 分类选项卡切换
  changeSegment(myIndex) {
    for (let item of this.segments) {
      item.isChecked = false;
    }
    this.segments[myIndex].isChecked = true;
    switch (Number(myIndex)) {
      // 综合排序
      case 0:
        this.order = 'sort';
        this.sort = (this.sort == 'asc') ? 'desc' : 'asc';
        this.products = [];
        this.page = 1;
        this.getGoodList();
        break;
      // 销量优先
      case 1:
        this.order = 'sales_sum';
        this.sort = (this.sort == 'asc') ? 'desc' : 'asc';
        this.products = [];
        this.page = 1;
        this.getGoodList();
        break;
      // 价格排序
      case 2:
        this.order = 'shop_price';
        this.sort = (this.sort == 'asc') ? 'desc' : 'asc';
        this.products = [];
        this.page = 1;
        this.getGoodList();
        break;
      default:
        break;
    }
  }

  /** 改变观看模式 */
  changeLookType() {
    if (this.lookType == 'two') {
      this.lookType = 'one';
    } else {
      this.lookType = 'two';
    }
  }

  // 跳转到商品详情页(detail)
  godetail(goods_id, product_type) {
    this.product_type = product_type ? product_type : '0';
    this.router.navigate(["goods-detail"], { queryParams: { goods_id: goods_id, product_type: this.product_type } });
  }

  /** 搜索商品列表 */
  searchGoods() {
    this.category_id = '0';
    this.products = [];
    this.page = 1;
    this.getGoodList();
  }

  /**
   * 店铺头部信息
   */

  getStoreInfo() {
    this.api.get('BrandStreet/storeInfo?store_id=' + this.store_id).subscribe(
      (res: any) => {
        console.log('res', res);
        this.storeInfo = res.data
      },
      (err) => {
        console.error('ERROR' + err);
      }

    );

  }





/** 获取商品列表 */
getGoodList() {
  let data = {
    'keyword': this.searchname,
    'category_id': this.category_id,
    'order': this.order,
    'sort': this.sort,
    'goods_ids': this.goods_ids,
    'page': this.page,
    'product_type': this.product_type
  };
  if (this.store_id) {
    data['store_ids'] = this.store_id;
  }

  console.log('获取商品列表', data);
  this.api.get('goods/getGoodsList', data).subscribe(
    (res: any) => {
      if (res.data.data.length > 0) {
        this.products = [...this.products, ...res.data.data];
      } else {
        this.lastPage = 0;
        this.native.showToast('没有更多数据了！', 1000);
      }
      if (this.products.length > 0) {
        this.data = true;
      } else {
        this.data = false;
      }
    },
    (err) => {
      console.error('ERROR' + err);
    }
  );
}

/** 下拉刷新 */
doRefresh(event) {
  setTimeout(() => {
    this.products = [];
    this.page = 1;
    this.lastPage = 1000;
    this.data = true;
    this.getGoodList();
    event.target.complete();
  }, 1000);
}
/** 触底 加载 */
loadData(event) {
  setTimeout(() => {
    if (Number(this.page) < Number(this.lastPage)) {
      this.page = Number(this.page) + 1;
      this.getGoodList();
    } else {
      this.native.showToast('没有更多数据了！', 1000);
    }
    event.target.complete();
  }, 1000);
}

// 返回上一级页面(主页面)
goback() {
  // this.router.navigate(['brand-classify']);
  this.router.navigate(['tabs/home']);
}

//关注
onAttention(){
  this.btnFill = 'solid'
  this.btnText = '已关注'
}

checkNav(i){
  this.isChecked = i
}

}
