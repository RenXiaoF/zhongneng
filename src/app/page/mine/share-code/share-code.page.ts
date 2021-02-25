import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from 'src/services/api'
import { NativeService } from 'src/services/NativeService';
import { GlobalData } from 'src/services/GlobalData';

@Component({
  selector: 'app-share-code',
  templateUrl: './share-code.page.html',
  styleUrls: ['./share-code.page.scss'],
})
export class ShareCodePage implements OnInit {
  // 二维码图片
  public supplier_qr_img = {
    store_logo: '', // 背景图
    logo: '' // 二维码
  };
  public user_id: string = ''; // 用户id
  public user_name: string = ''; // 用户名称
  public user_nickName: string = ''; // 用户昵称
  public mobile: string = '';   // 用户手机号


    constructor(
    private router: Router,
    private Api: Api,
    private native: NativeService,
    private _GlobalData: GlobalData,
  ) {
    this.user_id = this._GlobalData.user.user_id;
    this.user_name = this._GlobalData.user.realname;
    this.user_nickName = this._GlobalData.user.nickname;
    this.mobile = this._GlobalData.user.mobile;
    console.log(this._GlobalData.user);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.get_supplier_qr();
  }
  /** 获取图片 */
  get_supplier_qr() {
    this.native.showLoading();
    this.Api.get('consign/userQrcode').subscribe((res: any) => {
      console.log(res);
      this.native.hideLoading();
      if (res.status == 200) {
        this.supplier_qr_img = res.data;
      } else {
        this.native.showToast(res.msg);
      }
    }, (err) => {
      this.native.hideLoading();
      console.log(err);
    });
  }
  // 返回上一级页面(tabs/mine)
  goback() {
    this.router.navigate(['/tabs/mine']);
  }
}
