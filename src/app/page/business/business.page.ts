import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Utils, NativeService } from 'src/services';

@Component({
  selector: 'app-business',
  templateUrl: './business.page.html',
  styleUrls: ['./business.page.scss'],
})
export class BusinessPage implements OnInit {
  // 获取头部导航
  public selectList = [
    { name: '众能圈', value: 1 },
    { name: '众能课堂', value: 2 },
    { name: '地堆物料', value: 3 },
  ];
  public id = '1';
  public showValue = '1';
  public listData = [];
  public imgUrl = '';

  // public type = '';
  // public fileUrl = '';
  // public content = '';
  // public title: any;
  canClick = true

  businessDetailData = {
    type: '',
    fileUrl: '',
    content: '',
    title: '',
  }

  initValue: any;
  isCheck = ''


  constructor(
    private router: Router,
    public api: Api,
    public native: NativeService,


  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getNav();  // 获取头部导航
    this.getBanner(); // 获取banner图
    this.getlist(this.id); // 获取列表
    this.segmentChanged(1, 0)

  }
  /** 切换头部导肮 */
  segmentChanged(e, myIndex) {
    // console.log('123',e,myIndex);
    this.showValue = String(e);
    this.getlist(this.showValue);
    this.isCheck = myIndex
  }

  /** 获取头部导航 */
  getNav() {
    this.api.get('commercial/commercialCatList', { 'parent_id': 0, }).subscribe(
      (res: any) => {
        if (res.status == 1) {
          let data = res.result;
          this.selectList = data;
        }
      }, (err) => {
        console.log(err);
      });
  }

  /** 获取banner图 */
  getBanner() {
    this.api.get('commercial/commercialBannerList').subscribe((res: any) => {
      if (res.status == 1) {
        let data = res.result;
        if (data.length) {
          this.imgUrl = data[0].picture;
        }
        console.log(data);
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**  获取列表 */
  getlist(id) {
    console.log(id);

    this.api.get('commercial/commercialList', {
      'commercial_cat_id': id,
      'page': 1

    }).subscribe((res: any) => {
      if (res.status == 1) {
        let data = res.result.data;
        // console.log('123312',data);

        this.listData = data;
      }
    }, (err) => {
      console.log(err);
    });
  }
  /** 去到 众能课堂 */
  goClass() {
    this.router.navigate(['class-rom']);
  }
  /** 去到  推荐课程 */
  goRecommended() {
    this.router.navigate(['recommended-course'], {
      queryParams: {
        commercial_cat_id: this.showValue
      }
    });
  }
  /** 去到 商学院 的 详情 */
  goDetail(id) {
    this.native.showLoading();
    if (!this.canClick) {
      return
    }
    this.canClick = false
    this.api.get('commercial/commercialDetail', { 'id': id, }).subscribe(
      (res: any) => {
        if (res.status == 1) {
          let data = res.result;
          if (JSON.stringify(data) == "{}") {
            return
          } else {
            this.businessDetailData.type = data.type
            this.businessDetailData.fileUrl = data.file
            console.log('58787',data.fileUrl);
            
            this.businessDetailData.content = data.content
            this.businessDetailData.title = data.title
            Utils.localStorageSetItem("businessDetailData", this.businessDetailData);
            this.router.navigate(['course-detail'],
              {
                queryParams: {
                  'routerName': 'business'

                }
              }
            );
          }
        }
        this.native.hideLoading();
        this.canClick = true;


      })
  }

  //返回上级页面tabs/home
  goback() {
    this.router.navigate(['/tabs/mine']);
  }
}
