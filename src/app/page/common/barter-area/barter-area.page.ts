import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Api, NativeService} from '../../../../services';

@Component({
  selector: 'app-barter-area',
  templateUrl: './barter-area.page.html',
  styleUrls: ['./barter-area.page.scss'],
})
export class BarterAreaPage implements OnInit {

  public product_type = '4'; // 商品的类型，0：全部商品，1：boss批发区商品，2：零元区商品，3：福利区商品，4：易货区商品
  public page = 1;           // 分页
  public lastPage = 1000;    // 最后一页
  public products = [];      // 商品列表
  public data = true;        // 保存页面是否有数据状态，true为有数据，false为无数据

  constructor(
    private router: Router,
    private api: Api,
    private native: NativeService

  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
      this.getGoodList();
  }
  
  // 跳转到商品详情页(detail)
  godetail(goods_id,is_reserve) {
    this.router.navigate(["goods-detail"], {queryParams: {goods_id: goods_id, product_type: this.product_type,is_reserve: is_reserve}});
  }

  /** 获取零元区商品列表 */
  getGoodList() {
      let data = {
          'order': 'sort',
          'sort': 'asc',
          'page': this.page,
          'is_reserve': 0,
          'product_type': this.product_type
      };
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
  goback(){
    this.router.navigate(['/tabs/home']);
  }


}
