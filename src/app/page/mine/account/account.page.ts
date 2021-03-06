import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Api, NativeService, GlobalData } from 'src/services';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  public data:boolean = false;  //保存订单明细是否有数据，默认false为没有数据
  public totalAmount = 0; // 总余额
  public frozenMoney = 0; // 冻结余额
  public cashWithdrawal = 0; // 提现金额
  public accountLogData = []; // 提现记录
  public beginDate:any; // 查询起始时间
  public endDate:any; // 查询结束时间，默认当前
  public canRequest = true;//防止首次加载多次请求

  constructor(
    private router: Router,
    private globalData: GlobalData,
    private api: Api,
    private native: NativeService,
  ) {
      // this.totalAmount = globalData.user.user_money;
  }

  ngOnInit() {
  }
  // 初始化页面
  ionViewWillEnter() {
    this.totalAmount = this.globalData.user.user_money;
    this.frozenMoney = this.globalData.user.frozen_money;
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
    // this.page = 1;
    // this.isShowLoading = true;
    this.accountLogData = [];
    this.data = false;
  }

  // 时间改变
  timeChange(){
    if(this.canRequest){
      this.canRequest = false;
      this.accountLogData = [];
      this.data = false;
      this.getPersonFinance();
    }
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
  getPersonFinance() {
    let start = new Date(this.beginDate).getTime();
    let end = new Date(this.endDate).getTime();
    if(start > end){
      this.native.showToast("起始时间不能大于结束时间!");
      return;
    }
    // 请求参数对象
    let obj = {
      "type": 1,
      "start_time": this.formatTime(this.beginDate),
      "end_time": this.formatTime(this.endDate),
      // "page": this.page
    };
    this.native.showLoading();
    this.api.get('consign/getPersonFinance', obj).subscribe((res: any) => {
      this.native.hideLoading();
      this.canRequest = true;
      console.log(res)
      if(res.status == 200){
        this.cashWithdrawal = res.data.cash_withdrawal_amount;
        if(res.data.result.length > 0){
          this.data = true;
          // 按log_id降序排序
          res.data.result.sort((a, b)=>{
            return Number(b.log_id) - Number(a.log_id)
          });
          // 处理数据
          for(let item of res.data.result){
            item.user_money = Number(item.user_money);
          }
          this.accountLogData = res.data.result;
        }else{
          this.data = false;
        }
      }else {
        this.native.showToastTips(res.msg);
      }
      }, (err) => {
          this.native.hideLoading();
          this.canRequest = true;
          console.log(err);
      });
  }
  // 跳转到订单列表页面(allorder)
  goallorder(){
    this.router.navigate(["allorder"]);
  }
  // 跳转到提现页面(withdraw)
  gowithdraw(){
    this.router.navigate(["withdraw"]);
  }
  // 跳转到提现明细页面(cashdetail)
  gocashdetail(){
    this.router.navigate(["cashdetail"]);
  }
  // 返回上一级页面(/tabs/tab-my)我的页面
  goback() {
        this.router.navigate(['/tabs/mine']);
    }
}
