import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Api } from 'src/services/api';
import { NativeService } from 'src/services/NativeService';

@Component({
  selector: 'app-money-record',
  templateUrl: './money-record.page.html',
  styleUrls: ['./money-record.page.scss'],
})
export class MoneyRecordPage implements OnInit {
  public data:boolean = false; //页面是否有数据，false默认没有数据
  public pageData = []; //保存页面数据
  public field = '';
  public page = 1;          // 当前页数
  public lastPage = 1000;   // 页数

  constructor(
    private router:Router,
    private native:NativeService,
    private Api:Api,
    public activated: ActivatedRoute,
  ) {
    this.activated.queryParams.subscribe((params: Params) => {
        this.field = params.field ? params.field : '';
    });
  }

  ngOnInit() {
  }
  // 初始化页面
  ionViewWillEnter() {
    this.getData();
  }
  // 初始化数据请求
  getData() {
    // this.native.showLoading();
    this.Api.get('user/account_log',{
        'page': this.page,
        'field': this.field
    }).subscribe(
      (res: any) => {
        this.data = false;
        if(res.status == 1){
          if (res.result.data.length > 0) {
              this.pageData = [...this.pageData, ...res.result.data];
          } else {
              this.lastPage = 0;
              this.native.showToast('没有更多数据了！', 1000);
          }
          this.data = true;
        }
      }, 
      (err) => {
        console.log(err);
        this.native.hideLoading();
      }
    );
  }
  // 返回上一级页面(tabs/mine)
  goback(){
    this.router.navigate(["/tabs/mine"]);
  }

  /** 下拉刷新 */
  doRefresh(event) {
      setTimeout(() => {
          this.pageData = [];
          this.page = 1;
          this.lastPage = 1000;
          this.data = true;
          this.getData();
          event.target.complete();
      }, 1000);
  }
  /** 触底 加载 */
  loadData(event) {
      setTimeout(() => {
          if (Number(this.page) < Number(this.lastPage)) {
              this.page = Number(this.page) + 1;
              this.getData();
          } else {
              this.native.showToast('没有更多数据了！', 1000);
          }
          event.target.complete();
      }, 1000);
  }
}

  
