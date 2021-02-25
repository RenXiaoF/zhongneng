import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Api, NativeService } from 'src/services';

@Component({
  selector: 'app-tmall',
  templateUrl: './tmall.page.html',
  styleUrls: ['./tmall.page.scss'],
})
export class TmallPage implements OnInit {
  public segments = [];    // 分类
  public products = [];   //商品列表
  public searchname = '';   // 搜索的商品名称
  public page = 1;          // 当前页数
  public page_size = 10;   //每页条数
  public lastPage = 1000;   // 页数
  public order = '';  // 排序字段
  public sort = '';      // 排序顺序
  data: boolean;
  sort_type = 'des'




  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private native: NativeService

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
   this.initNavData()
   this.getGoodList()
  }

  /** 商品列表搜索项 */
  initNavData() {
    let nav = [
      { name: "综合", isChecked: true },
      { name: "销量", isChecked: false },
      // { name: "佣金", isChecked: false },
      { name: "价格", isChecked: false },
    ];
    this.segments = nav;

    // this.products = [{
    //   product_type_str:'普通',
    //   original_img:'/upload/goods/2020/09-27/ea92a551ea82fe77f90cbb0d246ecabd.jpg',
    //   goods_name:'当季新品   2020秋冬印花慵懒风时尚百搭修身显瘦长袖套头圆领卫衣女款',
    //   shop_price:'123',
    //   sales_sum:'123'

    // }]
  }

  //搜索
  searchGoods(){
    this.products = [];
    this.page = 1;
    this.getGoodList();
  }

/** 获取商品列表 */
getGoodList() {
  let data = {
    'search': this.searchname,
    'sort': this.sort,
    'page_no': this.page,
    'page_size': this.page_size,
  };
  // if (this.store_id) {
  //   data['store_ids'] = this.store_id;
  // }

  console.log('获取商品列表', data);
  this.api.get('promotion/taobaoList', data).subscribe(
    (res: any) => {
      console.log(res);
      
      if (res.result_list.map_data.length > 0) {
        this.products = [...this.products, ...res.result_list.map_data];
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



   // 分类选项卡切换
  changeSegment(myIndex) {
    for (let item of this.segments) {
      item.isChecked = false;
    }
    this.segments[myIndex].isChecked = true;
    switch (Number(myIndex)) {
      // 综合排序
      case 0:
        // this.order = 'sort';
        // this.sort_type = (this.sort_type == 'asc') ? 'des' : 'asc'
        // this.sort = (this.sort_type == 'asc') ? 'des' : 'asc';
        this.sort = ''
        this.products = [];
        this.page = 1;
        this.getGoodList();
        break;
      // 销量优先
      case 1:
        this.order = 'total_sales';
        this.sort_type = (this.sort_type == 'asc') ? 'des' : 'asc'
        this.sort = (this.sort_type == 'asc') ?  this.order + '_des' : this.order + '_asc';
        this.products = [];
        this.page = 1;
        this.getGoodList();
        break;
      // 价格排序
      // case 2:
      //   this.order = 'tk_rate';
      //   this.sort = (this.sort_type == 'asc') ? this.order + '_des' : this.order + '_asc';
      //   this.products = [];
      //   this.page = 1;
      //   this.getGoodList();
      //   break;
      case 2:
        this.order = 'price';
        this.sort_type = (this.sort_type == 'asc') ? 'des' : 'asc'
        this.sort = (this.sort_type == 'asc') ? this.order + '_des' : this.order + '_asc';
        this.products = [];
        this.page = 1;
        this.getGoodList();
        break;
      default:
        break;
    }
  }

  goback(){
    this.router.navigate(['/tabs/home'])
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

}
