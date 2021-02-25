import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { User, Utils, WechatConfig, Login } from 'src/services';
import { NewMsgCode } from 'src/services/NewMsgCode';
// import { MsgCode } from 'src/services/MsgCode';
import { NativeService } from 'src/services/NativeService';
import { GlobalData } from 'src/services/GlobalData';
import { Api } from 'src/services/api';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {RegistrationAgreementPage} from 'src/app/page/mine/registration-agreement/registration-agreement.page';
import { APP_CONFIG} from 'src/services/Constants';
import { GetPlatformService } from 'src/services/getPlatform';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public type = ""; //保存页面类型,edit为完善信息,new为新注册用户
  public referrer = ""; //保存推荐人手机
  public keyboard = false;  //解决软键盘遮挡bug
  // public downloadUrl = "http://www.gdsplx.com/apps/app1014.apk";  //下载链接
  // public downloadUrl = "http://qiniu.zhonglianxf.com/zn1105.apk";  //下载链接
  // public downloadUrl = Utils.localStorageGetItem('appUrl');  //下载链接
  // 用户注册对象
  // account: { nickname: string, mobile: string, code: string, password: string, confirm_password: string, referrer: string, is_agree: string, payPwd: string } = {
  //   nickname: '',
  //   mobile: '',
  //   code: '',
  //   password: '',
  //   confirm_password: '',
  //   referrer: '',
  //   is_agree: '1',
  //   payPwd: '',
  // };
  account: { mobile: string, code: string, password: string, confirm_password: string, referrer: string, is_agree: string } = {
    mobile: '',
    code: '',
    password: '',
    confirm_password: '',
    referrer: '',
    is_agree: '1',
  };
  // 用户登录对象
  public loginAccount: { username: string, password: string, code: string, token: string, typeAction: string } = {
    username: '',
    password: '',
    code: '',
    token: '',
    typeAction: 'password',
  };
  isRegister = false;
  is_button = 1;
  public checkbox:boolean = true;  //是否同意协议,默认同意

  pwdImg = 'assets/hide-pwd.png'

  /*
  * 通过modalCtrl传递的参数
  *  */

  @Input('params') modalParams: any;

  dosignup: any = false;

  public pwshow = false;//保存（登录）密码框状态，默认false为隐藏
  public pwType = "password";//保存（登录）密码类型
  public confirmPwd = false;//保存（确认登录）密码框状态，默认false为隐藏
  public confirmPwdType = "password";//保存（确认登录）密码框类型
  public payPwd = false;//保存支付密码框状态，默认false为隐藏
  public payPwdType =  "password";//保存密码框类型
  public picCode = "";//保存图形验证码
  public checkCode = "";//用户输入的验证码

  constructor(
    public user: User,
    public nav: NavController,
    // public navParams: NavParams,
    public native: NativeService,
    private _GlobalData: GlobalData,
    public router: Router,
    public actroute: ActivatedRoute,
    public Msgcode: NewMsgCode,
    // public Msgcode: MsgCode,
    private modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public Api: Api,
    public nativeservice: NativeService,
    public userts: User,
    public wechatconfig: WechatConfig,
    public login: Login,
    public _GetPlatform: GetPlatformService
  ) {
    this.actroute.queryParams.subscribe((params: Params) => {
      let reg=/^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/
      
      this.dosignup = params['dosignup'];
      this.type =  params['type'];
      this.referrer = reg.test(params.parent_phone) ? params.parent_phone : '';
    });
    if (this._GlobalData.user.mobile != '' && this._GlobalData.user.mobile_validated == 1) {
      this.isRegister = true;
    }
    
  }

  ngOnInit() {
    // if (this.navParams.get('dosignup') !== undefined){
    //   this.dosignup = this.navParams.get('dosignup');
    // }
      // 微信授权登录操作
      if (this.wechatconfig.isWeiXin()) {
          let url = window.location.href;
          let token = this.login.getUrlParam(url, 'token');
          let mobile = this.login.getUrlParam(url, 'parent_phone');

          if (!token) {
              // 清理dom对象的渲染，防止首页刷新两次。
              let objd = document.querySelectorAll('body')[0];
              objd.parentNode.removeChild(objd);

              // http://erha.rossai.cn/mp/Wechat/oauth?store_id=1&target_url=http://mall.rossai.cn/www?storeId=1
              let redirect_url = 'http://mall.rossai.cn/www/sign-up?parent_phone=' + mobile + '&storeId=1';
              let base64_url = window.btoa(redirect_url);
              let oauth_url = 'http://erha.rossai.cn/mp/Wechat/oauth?store_id=1&target_url=' + base64_url;
              window.location.href = oauth_url;
          }
      }

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['dosignup']) {
        this.dosignup = params['dosignup'];
      }
    })
    this.createCode();
  }
  // 处理苹果手机下键盘遮挡bug
  docmentScollResize(event) {
    this.keyboard = true;
    setTimeout(function(){
      // event.target.scrollIntoView({block: "center", inline: "nearest"});
      // event.target.scrollIntoView(true);
      // event.target.scrollTo(0,0);
      event.target.scrollBy(0,0);
    },100);
  }
  hideKeyboard(){
    this.keyboard = false;
  }

  // 登录函数
  doLogin() {
    this.loginAccount.token = this.Msgcode.token;
    this.loginAccount.username = this.account.mobile;
    this.loginAccount.password = this.account.password;
    this.Api.postFormData('User/do_login', this.loginAccount).subscribe(
        (res: any) => {
            // console.log('登陆成功：', res);
            if (res.status == 200) {
                this.userts._loggedIn(res.data);
                this.modalCtrl.dismiss({dismissed: true});
                this.nativeservice.showToast('登录成功', 1000);
                // this.router.navigate(['/tabs/home']);
                if(this._GetPlatform.getEntryType() == 'app'){
                  this.router.navigate(['/tabs/mine']);
                }else{
                  // this.router.navigate(['guide'],{queryParams:{is_download:1}});
                  this.goPage()
                }
            }else{
                this.nativeservice.showToast(res.msg, 1000);
            }
        },
        (err) => {
            console.error('ERROR', err);
        }
    );
  }

  // 提交注册信息
  doSignup() {
    this.account.confirm_password = this.account.password 
    if(!this.validate()){
      this.checkCode = "";
      return;
    }
    if(!this.checkbox){
      this.native.showToast("请勾选同意协议");
      return;
    }
    this.account.is_agree = "1";
    if(this.type != "edit"){
      for(let key in this.account){
        if(!this.account[key]){
          if(key == 'referrer'){
            continue;
          }
          this.native.showToast("请填写完所有的信息后再提交");
          return;
        }
      }
    }
    if(this.account.password != this.account.confirm_password){
      this.native.showToast("登录密码需要和确认登录密码保持一致");
      return;
    }
    if(this.referrer){
      this.account.referrer = this.referrer;
    }
    let api_url = 'user/do_register';
    if (this.type=='edit' || this.wechatconfig.isWeiXin()){
        api_url = 'consign/update_register';
    }

    this.native.showLoading();
    this.is_button = 0;
    this.Api.postFormData(api_url, this.account).subscribe((res: any) => {
      this.is_button = 1;
      this.native.hideLoading();
      if (res.status == 200) {
        // 注册请求
        if(this.type != "edit"){
          if (res.status > 0) {
            this.native.showToastTips('注册成功');
            this.doLogin();
          } else {
            this.native.showToastTips(res.msg);
          }
        }else{
          //完善信息请求 
          this.native.showToastTips('信息完善成功！');
          this.user._loggedIn(res.data);
          this.modalCtrl.dismiss();
          // this.router.navigate(['/tabs/mine']);
        }
        // this.router.navigate(['guide'],{queryParams:{is_download:1}});
      } else {
        this.native.showToastTips(res.msg);
      }
    }, (err) => {
    });
  }
  // 获取验证码
  getPhoneCode(mobile){
    if(!this.validate()){
      this.checkCode = "";
      return;
    }
    if (this.account.mobile.length == 0) {
      this.native.showToastTips('请输入手机号码！');
      return;
    }
    this.Api.postFormData('user/send_sms', { mobile: mobile, scene:1 }).subscribe((res: any) => {
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

  // 生成验证码的函数 
	createCode(){
    this.picCode = ""
		let codeLength=4;
    let str = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    for(let i=0;i<codeLength;i++){
			let charIndex=Math.floor(Math.random()*str.length);
			this.picCode += str[charIndex];
    }
	}
  //检验输入的验证码的正确性
	validate() {
      let codeToUp = this.picCode.toUpperCase();
      let checkCodeToUp = this.checkCode.toUpperCase();
      
			if(this.checkCode.length <= 0){
        this.native.showToast("请输入验证码！")
				return false;
			}else if(checkCodeToUp != codeToUp){
        this.native.showToast("验证码输入错误！")
				this.createCode();
				return false;
      }
      return true;
	}
  // 改变（登录）密码框状态
  changePwshow(){
    this.pwshow = !this.pwshow;
    if(this.pwshow){
      this.pwType = "text";
    }else{
      this.pwType = "password";
    }
  }
  // 改变（确认登录）密码框状态
  changeConfirmPwshow(){
    this.confirmPwd = !this.confirmPwd;
    if(this.confirmPwd){
      this.confirmPwdType = "text";
      this.pwdImg = 'assets/show-pwd.png'
      
    }else{
      this.confirmPwdType = "password";
      this.pwdImg = 'assets/hide-pwd.png'

    }
  }
  // 改变支付密码框状态
  changePaypwd(){
    this.payPwd = !this.payPwd;
    if(this.payPwd){
      this.payPwdType = "text";
    }else{
      this.payPwdType = "password";
    }
  }
  // 跳转到注册协议页面
  goAgreement(){
    this.modalCtrl.create({
      component: RegistrationAgreementPage,
    }).then(
        view => {
          view.present();
        }
    );
  }

  pagePop() {
    if (this.dosignup) {
      this.nav.navigateRoot(['/']);
    } else {
      this.nav.pop();
    }
  }

  redoSignup() {
    this.isRegister = false;
  }

  gotoMain() {
    this.nav.navigateRoot(['/']);
  }

  goLogin() {
    this.router.navigate(['login']);
  }


  change() {
    console.log('change');
    this.isRegister = false;
  }

  index() {
    if (this.dosignup) {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot(['/']);
    } else {
      this.nav.navigateRoot(['/']);
    }
  }

  goback() {
    if (this.dosignup) {
      this.modalCtrl.dismiss();
    } else {
      this.nav.back();
    }
  }

  /* 跳转下载页 */
  goDownload(){
    this.router.navigate(['guide'],{queryParams:{is_download:0}});

  }

  /* 判断设备跳转页面 */
  goPage(){
    if(this.nativeservice.isIosDevice()){
      this.router.navigate(['/tabs/home']);
    }else{
      this.router.navigate(['guide'],{queryParams:{is_download:0}});
    }
  }

  // detect(){
  //   let equipmentType = "";
  //   let agent = navigator.userAgent.toLowerCase();
  //   let android = agent.indexOf("android");
  //   let iphone = agent.indexOf("iphone");
  //   let ipad = agent.indexOf("ipad");
  //   if(android != -1){
  //       equipmentType = "android";
  //   }
  //   if(iphone != -1 || ipad != -1){
  //       equipmentType = "ios";
  //   }
  //   console.log(equipmentType);
    
  //   return equipmentType;
  // }

}
