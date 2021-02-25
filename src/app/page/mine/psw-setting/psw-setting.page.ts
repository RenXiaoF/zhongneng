import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-psw-setting',
  templateUrl: './psw-setting.page.html',
  styleUrls: ['./psw-setting.page.scss'],
})
export class PswSettingPage implements OnInit {
  public type: number = 0; // 点击选项类型,0为修改登录密码，1为修改支付密码,默认值为0

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  // 跳转到密码设置页面
  gochangePsw(index) {
    this.type = index;
    this.router.navigate(['/changepsw'], { queryParams: { type: this.type } });
  }
  // 返回上一级页面(/tabs/mine)
  goback() {
    this.router.navigate(['/tabs/mine']);
  }
}
