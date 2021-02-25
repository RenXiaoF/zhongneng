import { Component, OnInit } from '@angular/core';
import { Api, NativeService } from 'src/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cashdetail',
  templateUrl: './cashdetail.page.html',
  styleUrls: ['./cashdetail.page.scss'],
})
export class CashdetailPage implements OnInit {
  public data = false; // 保存页面是否有数据状态，true为有数据，false为无数据
  public cashData; // 提现申请记录

  constructor(
    private native: NativeService,
    private api: Api,
    private router: Router,

  ) { }

  ngOnInit() {
  }
  // 初始化页面
  ionViewWillEnter() {
      this.getCashData();
  }
  // 请求提现记录
  getCashData() {
      this.api.get('consign/getWithdraw').subscribe((res: any) => {
          console.log(res);
          if (res.status == 200) {
              this.cashData = res.data;
              if (res.data.length === 0) {
                  this.data = false;
              } else {
                  this.data = true;
              }

          } else {
              this.native.showToastTips(res.msg);
          }
      }, (err) => {
          console.log(err);
      });
  }

  // 返回上一级页面
  goback() {
    // this.navCtrl.back();
    this.router.navigate(["withdraw"]);
    // history.go(-1);
  }
}
