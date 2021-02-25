import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Api, NativeService, GlobalData } from 'src/services';

@Component({
  selector: 'app-distribut-account',
  templateUrl: './distributAccount.page.html',
  styleUrls: ['./distributAccount.page.scss'],
})
export class DistributAccountPage implements OnInit {
  public data:boolean = false;  //保存订单明细是否有数据，默认false为没有数据
  public totalAmount = 0; // 总余额
  public affiliateLogData; // 提现记录
  public beginDate:any; // 查询起始时间
  public endDate:any; // 查询结束时间，默认当前
  public canRequest = true;//防止首次加载多次请求
  public page = 1;          // 当前页数
  public lastPage = 1000;   // 页数
  // 月结金额
  public monthData = {
    "weighted_dividend":"",
    "agency_commission":"",
  }; 

  public total_num:number | string = 0;

  constructor(
    private router: Router,
    private api: Api,
    private globalData: GlobalData,
    private native: NativeService,
  ) {
      // this.totalAmount = globalData.user.distribut_money;

  }

  ngOnInit() {

  }
  // 初始化页面
  ionViewWillEnter() {
    this.totalAmount = this.globalData.user.distribut_money;
    // 初始化查询结束时间
    let now = new Date();
    let beginDateYear = now.getFullYear();
    let beginDateMonth = now.getMonth()+1;
    let beginDateDay = now.getDate()-7;
    if(beginDateDay <= 0){
      beginDateDay = 1;
    }
    this.beginDate = beginDateYear+"/"+beginDateMonth+"/"+beginDateDay;

    this.endDate = new Date();
    this.affiliateLogData = [];
    this.data = false;
    this.timeChange();
  }
  // 时间改变
  timeChange(){
    this.page = 1;
    this.lastPage = 1000;
    if(this.canRequest){
      this.canRequest = false;
      this.affiliateLogData = [];
      this.data = false;
      this.getAffiliateLog();
    }
  console.log('123',this.canRequest);
  console.log(this.page);
  }
  /**
   * 功能：将一个时间对象转换为特定的格式
   * @param time 时间格式对象
   */
  formatTime(time){
    let Year = new Date(time).getFullYear();
    let Month = new Date(time).getMonth()+1;
    let Day = new Date(time).getDate();
    return Year+"/"+Month+"/"+Day;
  }    
  // 获取金额记录和提现信息
  getAffiliateLog() {
    let start = new Date(this.beginDate).getTime();
    let end = new Date(this.endDate).getTime();
    if(start > end){
      this.native.showToast("起始时间不能大于结束时间!");
      this.canRequest = true;
      return;
    }
    // 请求参数对象
    let obj = {
      "start_time": this.formatTime(this.beginDate),
      "end_time": this.formatTime(this.endDate),
      "page": this.page
    };
    this.native.showLoading();
    this.api.get('consign/getAffiliateLog', obj).subscribe((res: any) => {
      this.native.hideLoading();
      this.canRequest = true;
      console.log('1111',res);
      if(res.status == 1){
        if(res.result.data.length > 0){
          // 处理数据
          this.monthData.weighted_dividend = res.weighted_dividend;
          this.monthData.agency_commission = res.agency_commission;
          this.total_num = Number(this.monthData.weighted_dividend + this.monthData.agency_commission).toFixed(2);
          this.affiliateLogData = [...this.affiliateLogData, ...res.result.data];
        }else{
          this.lastPage = 0;
          this.native.showToast('没有更多数据了！', 1000);
        }
        console.log(this.lastPage);
        this.data = true;
      }else {
        this.native.showToastTips(res.msg);
      }
    }, (err) => {
      this.native.hideLoading();
    });
  }
  // 跳转到提现明细页面(cashdetail)
  gocashdetail(){
    this.router.navigate(["cashdetail"]);
  }
  // 返回上一级页面(tabs/mine)我的页面
  goback(){
    this.router.navigate(["tabs/mine"]);
  }

  /** 下拉刷新 */
  doRefresh(event) {
      setTimeout(() => {
          this.affiliateLogData = [];
          this.page = 1;
          this.lastPage = 1000;
          this.data = true;
          this.getAffiliateLog();
          event.target.complete();
      }, 1000);
  }
  /** 触底 加载 */
  loadData(event) {
      console.log('加载', this.page);
      console.log('加载', this.lastPage);
      setTimeout(() => {
          if (Number(this.page) < Number(this.lastPage)) {
              this.page = Number(this.page) + 1;
              this.getAffiliateLog();
          } else {
              this.native.showToast('没有更多数据了！', 1000);
          }
          event.target.complete();
      }, 1000);
  }
}
