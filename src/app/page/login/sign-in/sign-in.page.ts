import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Api, NativeService, User } from 'src/services';
import { NewMsgCode } from 'src/services/NewMsgCode';
import {Utils} from '../../../../services';
import {APP_CONFIG} from '../../../../services/Constants';
declare var window; //  解决微信app授权登录

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  acountLock = false;
  phoneImg = 'assets/img/login/acount.png';
  phoneText = '账密登录';
  canClick = false;
  passwordType = 'password';
  canSeePass = false;
  showOrHide = '显示';
  public is_app = false;

  public account = {
      username: '',
      password: '',
      code: '',
      typeAction: 'password'
  };

  pwdImg = 'assets/hide-pwd.png'


  constructor(
    private router: Router,
    public api: Api,
    public nativeservice: NativeService,
    public userts: User,
    public modalCtrl: ModalController,
    public Msgcode: NewMsgCode,

  ) {
      let entryType = Utils.localStorageGetItem('entryType');
      this.is_app = (entryType && (entryType == 'app')) ? true : false;
  }

  ngOnInit() {

  }

  // 获取验证码
  getPhoneCode(mobile){
    if (this.account.username.length == 0) {
      this.nativeservice.showToastTips('请输入手机号码！');
      return;
    }
    this.api.postFormData('user/send_sms', { mobile: mobile, scene:1 }).subscribe((res: any) => {
      console.log(res);
      if (res.status == 1) {
        this.nativeservice.showToastTips("获取验证码成功！");
        this.Msgcode.settime();
      } else {
        this.nativeservice.showToastTips(res.msg);
      }
    }, (err) => {
        console.log(err)
      });
  }

  // 登录账号
  doLogin() {
    this.canClick = true
    this.api.postFormData('User/do_login', this.account).subscribe(
        async (res: any) => {
            // console.log('登陆成功：', res);
            if (res.status == 200) {
                this.userts._loggedIn(res.data);
                this.modalCtrl.dismiss({dismissed: true});
                await this.nativeservice.showToast('登录成功', 1000);
                this.router.navigate(['/tabs/home']);
                this.canClick = false
            }else{
                await this.nativeservice.showToast(res.msg, 1000);
                this.canClick = false
            }
        },
        (err) => {
            console.error('ERROR', err);
        }
    );
  }

  // 切换登录方式
  changeType(type){
    // console.log(type);
    
    // this.acountLock = !this.acountLock;
    // this.account.typeAction = this.acountLock ? 'password' : 'mobile';
    // if(!this.acountLock){
      //   this.phoneImg = 'assets/img/login/acount.png';
      //   this.phoneText = '账密登录';
      // }else{
        //   this.phoneImg = 'assets/img/login/phone.png';
        //   this.phoneText = '手机验证';
        // }
        
    this.account.typeAction = type;

  }


  //显示、隐藏密码
  seePass() {
    if (this.canSeePass) {
      this.canSeePass = false;
      this.passwordType = 'password';
      this.pwdImg = 'assets/hide-pwd.png'
      this.showOrHide = '显示'
    } else {
      this.canSeePass = true;
      this.passwordType = 'text';
      this.showOrHide = '隐藏'
      this.pwdImg = 'assets/show-pwd.png'

    }
  }

  goMine(){
    this.router.navigate(['/tabs/mine']);

  }

  goSignUp() {
      this.modalCtrl.dismiss();
      this.router.navigate(['/sign-up']);
  }

  goIgnorePwd(){
    this.modalCtrl.dismiss();
    this.router.navigate(['/changepsw'],{
      queryParams:{type:0}
    });

  }

    // 第三方微信授权登录
    getAuth() {
        let scope = 'snsapi_userinfo';
        let state = '_' + (+new Date());
        window.Wechat.auth(scope, state, (response) => {
            // you may use response.code to get the access token.
            // alert(JSON.stringify(response));
            this.getWechatUserByOauth(response.code);
        }, (reason) => {
            alert('Failed: ' + reason);
        });
    }

    // 根据微信code，获取用户登录信息
    getWechatUserByOauth(code) {
        this.api.postFormDatabyurl('http://erha.rossai.cn/mp/wechat_oauth/wechatAppLogin?store_id=1&code=' + code).subscribe((res: any) => {
            if (res.status == 200) {
                this.getUserInfo(res.user_id, res.token);
            } else {
                this.nativeservice.showToast(res.msg, 1000);
            }
        }, (err) => {
            console.error('ERROR', err);
        });
    }

    // 请求服务器，获取用户信息
    getUserInfo(user_id, token) {
        let data = {
            store_id: 1,
            token: token,
            user_id: user_id
        };
        this.api.postFormData('User/getWechatUser', data).subscribe((res: any) => {
            if (res.status == 200) {
                Utils.localStorageSetItem(APP_CONFIG.USER_KEY, res.data);
                this.modalCtrl.dismiss();
                this.router.navigate(['/']);
            } else {
                this.nativeservice.showToast(res.msg, 1000);
            }
        }, (err) => {
            console.error('ERROR', err);
        });
    }

}
