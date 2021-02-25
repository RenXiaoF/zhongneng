import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Api, NativeService, GlobalData, User } from 'src/services';
import { NavController } from '@ionic/angular';
import { log } from 'util';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {
  public pwshow:boolean = false;  // 保存密码框文本显示状态，默认false为隐藏密码
  public totalAmount = 0; // 用户总余额。
  public money:any = 0; // 提现金额
  public cash_password; // 提现密码
  public id; // 提现账号id
  public banks; // 提现账号信息
  public cashOutData = {'can_cash_out': false, 'cash_out_date': 10, 'cash_out_percent': 30, 'cash_out_rate': 5}; // 检测是否可以提现

  constructor(
    private router: Router,
    private api: Api,
    private native: NativeService,
    private globalData: GlobalData,
    public nav: NavController,
    public user: User,
  ) {
  }

  ngOnInit() {
  }
  // 初始化页面
  ionViewWillEnter() {
      this.totalAmount = this.globalData.user.user_money;
      this.getBank();
      this.checkCanWithdraw();
    //   this.checkBanks()
  }
  // 获取提现账号信息
  getBank() {
      this.api.get('consign/getBanks').subscribe((res: any) => {
          if (res.status == 200) {
              this.banks = res.data;
              console.log(this.banks);
              if(!this.banks.length){
                this.native.showToastTips('请添加提现账户！');
                this.router.navigate(["bankcard"]);
              }
              
          } else {
              this.native.showToastTips(res.msg);
          }
      }, (err) => {
          console.log(err);
      });
  }
  // 检测是否可以提现
  checkCanWithdraw() {
      this.api.get('consign/returnWithdraw').subscribe((res: any) => {
              if (res.status == 200) {
                  this.cashOutData = res.data;
              }
              if (!this.cashOutData.can_cash_out) {
                //   this.native.showToastTips('每月' + this.cashOutData.cash_out_date + '号才能提现，只能提现余额的' + this.cashOutData.cash_out_percent + '%');
                  this.native.showToastTips('不在提款时间范围内!');
                  this.router.navigate(['/tabs/tab-my']);
              }
          }, (err) => {
              console.log(err);
          });
  }
  // 用户申请提现
  getCash() {
      this.native.showLoading("", 999999999);
      this.api.postFormData('consign/applicationWithdraw', {"money": this.money, 'cash_password': this.cash_password, 'id': this.id}).subscribe((res: any) => {
          this.native.hideLoading();
          if (res.status == 200) {
              this.native.showToastTips('提现申请已经提交！');
              // 更新用户数据
              this.user.updateUser();
              this.money = 0; // 提现金额
              this.cash_password = ''; // 提现密码
              this.id = ''; // 提现账号id
              this.banks = '';
              // 跳转到提现列表页
              this.router.navigate(["cashdetail"]);
          } else {
              this.native.showToastTips(res.msg);
          }
      }, (err) => {
          console.log(err);
      });
  }
  // 显示/隐藏密码
  changePwd() {
    this.pwshow = !this.pwshow;
  }
  // 跳转到提现明细页面(cashdetail)
  gocashdetail(){
    this.router.navigate(["cashdetail"]);
  }
  // 跳转到账户余额页面(account)
  goback() {
    this.router.navigate(["tabs/mine"]);
  }

  checkInput(event) {
    let input_value = event.target.value;
    // let reg = /^\d+\.?(\d{0})?$/; //匹配正则
    // while (input_value !='' && !reg.test(input_value)) {
    //   input_value = this.checkStr(input_value)
    // }
    let reg = /^[1-9]\d*$/; //匹配正则
    while (input_value !='' && !reg.test(input_value.toString())) {
      input_value = this.checkStr(input_value)
    }
    this.money = input_value;
    event.target.value = input_value;
  }

  private checkStr(str) {
    if (str.split('.').length > 0) {
      str = str.substring(0,str.lastIndexOf('.'));
    }else{
      str = str.substring(0, str.length - 1);
    }
    this.native.showToastTips('请输入正整数');
    
    return str;
  }

//   checkBanks(){
//       let len = this.banks.length
//       console.log(len);
      
//       if(len){
//         this.router.navigate(["bankcard"]);
//       }
//   }
} 
