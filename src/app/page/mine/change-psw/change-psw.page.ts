import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api } from 'src/services/api';
import { NativeService } from 'src/services/NativeService';
import { User } from 'src/services/index';
import { NewMsgCode } from 'src/services/NewMsgCode';
import { GlobalData } from 'src/services/GlobalData';

@Component({
  selector: 'app-change-psw',
  templateUrl: './change-psw.page.html',
  styleUrls: ['./change-psw.page.scss'],
})
export class ChangePswPage implements OnInit {
  public type = 0;  //保存页面状态，0为修改登录密码，1为修改支付密码
  public oldPwd_status: boolean = true;  //保存旧密码是否显示,true为隐藏状态
  public newPwd_status: boolean = true;  //保存新密码是否显示
  public newConfirmPwd_status: boolean = true;  //保存新确认密码是否显示
  public btn_disable: boolean = true;  //保存按钮是否可用,true为默认不可用
  public url: string = "consign/setPassword";  //默认请求地址,默认为登录请求地址
  public phoneNum: string = "";  //保存用户手机号
  // 保存输入框文本
  // public inputText = {
  //   "oldPwd": "",
  //   "newPwd": "",
  //   "newConfirmPwd": "",
  //   "code": "",
  // }
  public params = {
    "oldPwd": "",
    "newPwd": "",
    "newConfirmPwd": "",
    "code": "",
  };


  firstPasswordType = 'password';
  firstPwdImg = 'assets/hide-pwd2.png'
  firstCanSeePass = false;
  secondCanSeePass = false;
  secondPasswordType = 'password';
  secondPwdImg = 'assets/hide-pwd2.png'



  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private Api: Api,
    private native: NativeService,
    public user: User,
    public Msgcode: NewMsgCode,
    public _GlobalData: GlobalData,
  ) {
    this.phoneNum = this._GlobalData.user.mobile;
    this.ActivatedRoute.queryParams.subscribe((params: Params) => {
      this.type = params.type;
      this.params.oldPwd = '';
      this.params.newPwd = '';
      this.params.newConfirmPwd = '';
      this.params.code = '';
    });
  }

  ngOnInit() {
  }

  // 初始化页面
  ionViewWillEnter() {
  }

  // 获取验证码
  getPhoneCode() {
    console.log(this.phoneNum)
    this.Api.postFormData('user/send_sms', { mobile: this.phoneNum, scene: 1 }).subscribe((res: any) => {
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
  // 修改密码后退出登录
  // logout() {
  //   this.user.logout();
  //   this.native.showToast('密码修改成功', 1000);
  //   this.router.navigate(['login']);
  // }
  // 提交修改密码
  submit() {
    if (this.params.newPwd != this.params.newConfirmPwd) {
      this.native.showToast("新密码需要和确认新密码保持一致");
      return;
    }
    let obj = {
      "code": null,
      "old_password": null,
      "new_password": null,
      "confirm_password": null,
      "old_paypwd": null,
      "new_paypwd": null,
      "confirm_paypwd": null
    }
    // obj.old_password = this.params.oldPwd;
    // console.log(obj)
    if (this.type == 0) {
      // 修改登录密码
      // this.url = "Consign/setPassword";
      this.url = "Consign/setPasswordNew";
      obj.old_password = this.params.oldPwd
      obj.new_password = this.params.newPwd;
      obj.code = this.params.code;
      obj.confirm_password = this.params.newConfirmPwd;
    } else {
      // 修改支付密码
      // this.url = "Consign/setPaypwd";
      this.url = "Consign/setPaypwdNew";
      obj.old_password = this.params.oldPwd;
      obj.new_paypwd = this.params.newPwd;
      obj.code = this.params.code;
      obj.confirm_paypwd = this.params.newConfirmPwd;
    }
    this.native.showLoading();
    this.Api.postFormData(this.url, obj).subscribe(
      (res: any) => {
        console.log(res)
        this.native.hideLoading();
        if (res.status == 200) {
          this.native.showToast("修改成功");
          setTimeout(() => {
            this.router.navigate(["/tabs/mine"]);
          }, 800);
        } else {
          this.native.showToast(res.msg);
        }
      },
      (err) => {
        console.log(err)
        this.native.hideLoading();
      },
    );
  }
  // 监听输入框值变化
  checkVal() {
    // console.log(1);
    // console.log(this.params);
    
    // 当前页面为修改登录密码
    if (this.type == 0) {
      if (this.params.code && this.params.newPwd && this.params.newConfirmPwd) {
        this.btn_disable = false;
      } else {
        this.btn_disable = true;
      }
    } else {
      if (this.params.oldPwd && this.params.newPwd && this.params.newConfirmPwd) {
        this.btn_disable = false;
      } else {
        this.btn_disable = true;
      }
    }

  }
  // 改变旧密码显示/隐藏状态
  changeOldPwdStatus() {
    this.oldPwd_status = !this.oldPwd_status;
  }
  // 改变新密码显示/隐藏状态
  changeNewPwdStatus() {
    this.newPwd_status = !this.newPwd_status;
  }
  // 改变新密码显示/隐藏状态
  changeNewConfirmPwdStatus() {
    this.newConfirmPwd_status = !this.newConfirmPwd_status;
  }
  // 返回上一级页面(pswsetting)密码设置页面
  goback() {
    this.router.navigate(["pswsetting"]);
  }


  /* 显示、隐藏密码 */
  firstSeePass() {
    if (this.firstCanSeePass) {
      this.firstCanSeePass = false;
      this.firstPasswordType = 'password';
      this.firstPwdImg = 'assets/hide-pwd2.png'
    } else {
      this.firstCanSeePass = true;
      this.firstPasswordType = 'text';
      this.firstPwdImg = 'assets/show-pwd.png'
    }
  }
  secondSeePass() {
    if (this.secondCanSeePass) {
      this.secondCanSeePass = false;
      this.secondPasswordType = 'password';
      this.secondPwdImg = 'assets/hide-pwd2.png'
    } else {
      this.secondCanSeePass = true;
      this.secondPasswordType = 'text';
      this.secondPwdImg = 'assets/show-pwd.png'
    }
  }
}
