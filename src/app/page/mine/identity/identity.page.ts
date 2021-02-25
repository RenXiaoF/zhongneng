import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Api, NativeService, User, GlobalData } from 'src/services';
import { NewMsgCode } from 'src/services/NewMsgCode';
import { Banks } from 'src/services/bank';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.page.html',
  styleUrls: ['./identity.page.scss'],
})
export class IdentityPage implements OnInit {
  public mobile_validated;  //保存用户手机状态 
  public leader;  //保存上级手机号
  public mobile;  //保存用户手机号
  public realname;  //保存用户名称
  public user = {
    'real_name': "",
    'identity_card': "",
    'mobile': "",
    'code': '',
    'bank_name': "",
    'bank_card': "",
    'cash_password': "",
    'first_leader': "",
    'showMobile':'',
    'showID': '',
  };
  public bankList = Banks;
  dosignup: any = false;

  constructor(
    private router: Router,
    private native: NativeService,
    private api: Api,
    private users: User,
    private globalData: GlobalData,
    public Msgcode: NewMsgCode,
    private modalCtrl: ModalController,
    public navController: NavController,
    public actroute: ActivatedRoute,


  ) {
    this.actroute.queryParams.subscribe((params: any) => {
      this.dosignup = params['dosignup'];
    });
      this.user = {
          'real_name': this.globalData.user.realname,
          'identity_card': this.globalData.user.idcard,
          'mobile': this.globalData.user.mobile,
          'code': '',
          'bank_name': this.globalData.user.bank_name,
          'bank_card': this.globalData.user.bank_card,
          'cash_password': this.globalData.user.paypwd,
          'first_leader': this.globalData.user.first_leader,
          'showMobile': this.globalData.user.showMobile,
          'showID': this.globalData.user.showID,
          
      };
      this.mobile_validated = this.globalData.user.mobile_validated;
      this.realname = this.globalData.user.realname;
      this.leader = this.globalData.user.first_leader,
      this.mobile = this.globalData.user.mobile;      
  }

  ngOnInit() {
  }
  // 获取验证码
  getPhoneCode(mobile){
    if (this.user.mobile.length == 0) {
      this.native.showToastTips('请输入手机号码！');
      return;
    }
    this.api.postFormData('user/send_sms', { mobile: mobile, scene:1 }).subscribe((res: any) => {
      console.log(res);
      if (res.status == 1) {
        this.native.showToastTips("获取验证码成功！");
        this.Msgcode.settime();
      } else {
        this.native.showToastTips(res.msg);
      }
    }, (err) => {
        console.log(err)
      });
  }
  // 认证用户的信息
  updateUser() {
    if(this.realname){
      this.user.real_name = this.realname;
    }
    if(!this.leader){
      this.native.showToastTips('请完善上级手机号！');
      return
    }
      this.api.postFormData('consign/setPerson', this.user).subscribe((res: any) => {
          if (res.status == 200) {
              this.native.showToastTips('认证用户成功！');
              this.users._loggedIn(res.data); // 更新用户的信息

              if (this.dosignup) {
                  this.modalCtrl.dismiss();
              } else {
                  this.router.navigate(['/tabs/mine']);
              }
          } else {
              this.native.showToastTips(res.msg);
          }
      }, (err) => {
          console.log(err);
      });
  }

  // 返回上一级页面(主页面)
  goback(){
    // this.router.navigate(["/tabs/mine"]);
    if (this.dosignup) {
      this.modalCtrl.dismiss();
    } else {
      this.navController.back();

    }
    

  }
}
