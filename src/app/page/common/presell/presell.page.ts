import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api, NativeService } from 'src/services';

@Component({
  selector: 'app-presell',
  templateUrl: './presell.page.html',
  styleUrls: ['./presell.page.scss'],
})
export class PresellPage implements OnInit {

  constructor(
    private router: Router,
    private api: Api,
    private native: NativeService
  ) { }
  public product_type = '4';
  public page = 1;           // 分页
  public lastPage = 1000;    // 最后一页
  public products = [];      // 商品列表
  public data = true;        // 保存页面是否有数据状态，true为有数据，false为无数据
  public time = 1605106800
  public is_reserve = 1

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getGoodList()
  }

  // 跳转到商品详情页(detail)
  godetail(goods_id) {
    this.router.navigate(["goods-detail"], { queryParams: { goods_id: goods_id, product_type: this.product_type, is_reserve: this.is_reserve } });
  }

  /** 获取预售区商品列表 */
  getGoodList() {
    let data = {
      'is_reserve': 1,
      'order': 'sort',
      'sort': 'asc',
      'page': this.page,
      'product_type': this.product_type
    };
    this.api.get('goods/getGoodsList', data).subscribe(
      (res: any) => {
        let dataArr = res.data.data
        let len = dataArr.length
        if (len > 0) {
          dataArr.forEach(item => {
            item.shop_price = (item.shop_price * 10/100).toFixed(2)
          });
          this.products = [...this.products, ...dataArr];
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
  goback() {
    this.router.navigate(['/tabs/home']);
  }

}
