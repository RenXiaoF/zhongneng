import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api, NativeService, Utils } from 'src/services';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-class-rom',
  templateUrl: './class-rom.page.html',
  styleUrls: ['./class-rom.page.scss'],
})
export class ClassRomPage implements OnInit {

  public nav = [
    // { name: '宣传视频', value: 1 },
    // { name: '新手课堂', value: 2 },
    // { name: '进阶课堂', value: 3 },
    // { name: '高手课堂', value: 4 }
  ]

  is_checked_category = 0
  commercial_cat_id = ''
  parent_id: any = 5;
  video = ''
  url = ''
  listData = []
  public currentPage = 1; // 当前页数
  public lastPage = 0; // 最后页码数
  public isShowLoading : boolean = true;//监听是否显示加载区域，默认显示
  public data: boolean = true; // 保存页面是否有数据状态，true为有数据，false为无数据
  canClick = true

  businessDetailData = {
    type:'',
    fileUrl:'',
    content:'',
    title:'',
  }


  constructor(
    private router: Router,
    public api: Api,
    public activatedRoute: ActivatedRoute,
    public native: NativeService,
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.commercial_cat_id = params.commercial_cat_id ? params.commercial_cat_id : 2
    })
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.data = true
    this.listData = []
    this.getNav()
    this.getlist()
  }

  /** 分类选项卡 切换 */
  changeSegment(myIndex, parentId) {
    this.is_checked_category = myIndex;
    this.parent_id = parentId
    this.listData = []
    this.getlist()
  }

  /** 获取头部导航 */
  getNav() {
     this.api.get('commercial/commercialCatList', {
      'parent_id': this.commercial_cat_id,

    }).subscribe((res: any) => {
      if (res.status == 1) {
        let data = res.result;
        this.nav = data;
        this.parent_id = data[0].commercial_cat_id
      }
    }, (err) => {
      console.log(err);
    });
  }


  // 获取列表
  getlist() {
    console.log('23123',this.parent_id);
    
    this.api.get('commercial/commercialList', {
      'commercial_cat_id': this.parent_id,
      'page': 1,
    }).subscribe((res: any) => {
      if (res.status == 1) {
        let data = res.result.data;
        if(data.length){
          this.data = true
          this.listData.push(...data);
        }else{
          this.data = false
          this.native.showToast("没有更多数据了！");

        }

      }
    }, (err) => {
      console.log(err);
    });
  }

  // goDetail(id) {
  //   this.router.navigate(['course-detail'], {
  //     queryParams: {
  //       'id': id
  //     }
  //   });
  // }

  goDetail(id) {
    if(!this.canClick){
      return
    }
    this.canClick = false
    this.native.showLoading();
    this.api.get('commercial/commercialDetail', { 'id': id, }).subscribe(
      (res: any) => {
        if (res.status == 1) {
          let data = res.result;
          if (JSON.stringify(data) == "{}") {
            return
          } else {
            this.businessDetailData.type = data.type
            this.businessDetailData.fileUrl = data.file
            this.businessDetailData.content = data.content
            this.businessDetailData.title = data.title
            Utils.localStorageSetItem("businessDetailData", this.businessDetailData); 
            this.router.navigate(['course-detail'], {
              queryParams: {
                'routerName':'class-rom'

              }
            });
          }
        }
        this.native.hideLoading();
        this.canClick = true
      })
    }

  goback() {
    this.router.navigate(['business']);
  }

  // 加载更多
  loadData(event) {
    setTimeout(() => {
        if (Number(this.currentPage) < Number(this.lastPage)) {
            this.currentPage = Number(this.currentPage) + 1;
            this.getlist()
        }else{
            this.native.showToast("没有更多数据了！");
            this.isShowLoading = false;
        }
        event.target.complete();
    }, 1000);
  }

}
