import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Api, NativeService, User } from 'src/services';



@Component({
  selector: 'app-classify',
  templateUrl: './classify.page.html',
  styleUrls: ['./classify.page.scss'],
})
export class ClassifyPage implements OnInit {
  public categoryList = [];       // 商品分类的列表
  public categoryListItem = [];   // 商品分类的
  public is_checked_category = 0; // 选中的一级分类
  public categoryId = 0;          // 商品分类的category_id
  public isRecommend  = true; // 是否是精选


  constructor(
    private router: Router,
    public api: Api,
    private native: NativeService,
    private activatedRoute: ActivatedRoute,
    public nav: NavController,
  ) {
    // 获取页面数据
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.categoryId = params.category_id;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.fetchList();
    this.selectRecommend(-1);
  }

  /** 请求列表数据 */
  fetchList() {
    this.api.postFormData('Index/getSecondCategory').subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.categoryList = res.data;
          // this.categoryListItem = res.data[0].wechat_child_category;
          this.is_checked_category = -1;

        } else {
          this.native.showToast(res.msg);
        }
      },
      (err) => {
        console.error('ERROR', err);
      }
    );
  }

  // 众能推荐
  selectRecommend(index){
    this.isRecommend = true
    this.is_checked_category = index;
    this.categoryListItem = []
  }

  // 切换一级商品分类
  selectCategory(index) {
    this.is_checked_category = index;
    this.categoryListItem = this.categoryList[index].wechat_child_category;
    this.isRecommend = false
  }

  // 跳转到商品列表页面
  goList() {
    this.router.navigate(['goods-list'], { queryParams: { type: "public" } });
  }
  // 跳转信息页
  goInfo() {
    this.router.navigate(['share-profit']);
  }

  /**  跳转到商品列表    没有参数 */
  goproduct() {
    this.router.navigate(['goods-list']);
  }


}
