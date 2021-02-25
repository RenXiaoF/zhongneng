import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api, NativeService, Utils } from 'src/services';

@Component({
  selector: 'app-recommended-course',
  templateUrl: './recommended-course.page.html',
  styleUrls: ['./recommended-course.page.scss'],
})
export class RecommendedCoursePage implements OnInit {

  public commercial_cat_id = ''
  public listData = []; // 列表数据
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

  ionViewWillEnter(){
    this.data = true;
    this.currentPage = 1;
    this.lastPage = 0
    this.listData = []
    this.getlist()
  }


  // 获取列表
  getlist() {
    this.api.get('commercial/commercialList', {
      'commercial_cat_id':this.commercial_cat_id,
      'page':this.currentPage,
      'is_recommend':1 
    }).subscribe((res: any) => {
      if(res.status == 1){
        let data = res.result.data;
        if(data.length){
          this.listData.push(...data);
          this.data = true
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
                'routerName': 'recommended-course'

              }
            });
          }
        }
        this.native.hideLoading();
        this.canClick = true
      })
    }
  


  //返回上级页面
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
