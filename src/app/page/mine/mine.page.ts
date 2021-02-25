import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalData, Api, NativeService, User, Utils} from 'src/services';
import { ModalController } from '@ionic/angular';
import { MyaddressPage } from 'src/app/page/mine/myaddress/myaddress.page';
import { SignUpPage } from 'src/app/page/mine/sign-up/sign-up.page';



@Component({
  selector: 'app-mine',
  templateUrl: './mine.page.html',
  styleUrls: ['./mine.page.scss'],
})
export class MinePage implements OnInit {

  public user: any = ''; // 登录的用户信息
  public has_user = false; // 用户是否登录
  // 订单数量
  public orderCount = {
    'WAITPAY': 0,
    'WAITSEND': 0,
    'WAITRECEIVE': 0,
    'WAITCCOMMENT': 0,
    'FINISH': 0
  };
  public isShowCommission = true;

  level = ''

  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public globalData: GlobalData,
    public modalCtrl: ModalController,
    public api: Api,
    public nativeservice: NativeService,
    public userts: User
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      // console.log(111111111111111)
        this.isShowCommission = (Utils.localStorageGetItem('entryType') == 'weixin') ? false : true;
        this.user = this.globalData.user;
        this.has_user = (Object.keys(this.user).length !== 0);
        this.get_user();
    });
  }


  ngOnInit() {
  }


  ngViewInit() {
    console.log(123);
  }

  /**  个人中心--个人数据 */
  get_user() {
    this.api.get('User/getMyContent').subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.user.mobile = this.user.mobile;
          // this.user.mobile = this.user.mobile.replace(/^(.{4})(?:\d+)(.{4})$/,"$1****$2");
          this.user.showMobile = this.user.mobile ? this.user.mobile.replace(/^(.{4})(?:\d+)(.{4})$/,"$1****$2") : '';
          // this.user.idcard = this.user.idcard.replace(/^(.{2})(?:\d+)(.{4})$/,"$1**********$2");
          this.user.showID =  this.user.idcard ? this.user.idcard.replace(/^(.{2})(?:\d+)(.{4})$/,"$1**********$2") : '';
          // this.user.realname =  this.user.realname.replace(/([\u4E00-\u9FA5]{1})([\u4E00-\u9FA5]+)$/,"$1**");
          
          this.userts._loggedIn(res.data);
          this.level = this.user.user_level.level_name;
        } else {
          this.nativeservice.showToast(res.msg, 1000);
        }
      },
      err => {
        console.error('ERROR', err);
      }
    );
  }
  order_count() {
    this.api.get('Order/order_list?page=2&per_page&type').subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.userts._loggedIn(res.data);
        } else {
          this.nativeservice.showToast(res.msg, 1000);
        }
      },
      err => {
        console.error('ERROR', err);
      }
    );
  }

  goLogin() {
    this.router.navigate(["/sign-in"]);
  }

  goInfo() {
    this.router.navigate(['share-profit']);

  }
  // 个人设置
  setPerson() {

  }

  // 通知
  gonotice() {
    this.router.navigate(["notice"]);
  }


  /**  跳转到订单列表页面(allorder) */
  goallorder(index) {
    this.router.navigate(['myconsumeorder'], { queryParams: { index: index } });
  }

  /**  跳转到个人资金变动记录 */
  getMoneyRecord(field) {
    this.router.navigate(['money-record'], { queryParams: { field: field } });
  }

  // 跳转到批发订单列表页面(consignOrder)
  goconsignorder() {
    this.router.navigate(["consignOrder"]);
  }
  // 跳转到寄售佣金(commission)页面
  getCommission() {
    this.router.navigate(["commission"]);
  }


  //  /** 跳转到批发订单列表页面(consignOrder) */
  //  goconsignorder() {
  //   // this.router.navigate(['consignOrder']);
  //   this.router.navigate(['myconsumeorder'], { queryParams: {index: 0, bill_type: 1} });
  // }

  /** 跳转到设置(set)页面 */
  goset() {
    this.router.navigate(['set']);
  }

  /** 跳转到我的地址(myaddress)页面 */
  async gomyaddress() {
    // this.router.navigate(['myaddress'], {
    //   queryParams: {
    //     chooseaddress: true,
    //   }
    // });
    const modal = await this.modalCtrl.create({
      component: MyaddressPage,
      componentProps: {
        chooseaddress: true,
      }
    });
    await modal.present();
  }

  // 跳转到我的粉丝(myfans)页面
  gomyfans() {
    if (this.isShowCommission) {
        this.router.navigate(["myfans"],{queryParams:{id:this.user.user_id,nickname:this.user.nickname,tel:this.user.mobile,head_pic: this.user.head_pic}});
    }
  }

  /** 退还/售后 */
  gotoSalesReturn() {
    this.router.navigate(['after-market']);
  }
  /** 我的分享码 */
  gosharecode() {
    this.router.navigate(['sharecode']);
  }

  /** 跳转到密码设置(pswsetting)页面 */
  gopswsetting() {
    this.router.navigate(['pswsetting']);
  }

  /**  跳转到银行卡管理(bankcard)界面 */
  gobankcard() {
    this.router.navigate(['bankcard']);
  }

  // 跳转到提现(withdraw)页面
  gowithdraw() {
    this.router.navigate(["withdraw"]);
  }

  /**  跳转到实名认证/完善信息页面(identity) */
  goidentity() {
    if (this.globalData.user.mobile) {
      this.router.navigate(['identity']);
    } else {
      this.modalCtrl.create({
        component: SignUpPage,
        componentProps: {
          dosignup: true,
          type: 'edit'
        }
      }).then(
        view => {
          view.present();
        }
      );
    }

  }

  // 跳转到下载app
  downloadApp() {
    this.router.navigate(["downloadapp"]);
  }

  // 跳转到代理佣金页面
  // goaccount() {
  //   this.router.navigate(["distribut"]);
  // }
  // 跳转到我的账户(account)页面
  goaccount(id) {
    if (id == 1) { // 余额
        this.router.navigate(["account"]);
    } else if (id == 2) { // 易货券
          this.router.navigate(["bcoin"]);
    } else if (id == 3) { // 代理佣金
          this.router.navigate(["distribut"]);
    } else if (id == 5) { // 福利券
          this.router.navigate(["acoin"]);
    } else { // 积分
          this.router.navigate(["points"]);
    }
  }

  goBusiness(){
    this.router.navigate(["business"]);

  }

  goAgent(){
    this.router.navigate(["application-agent"]);

  }

  copy(e){
    console.log(e);
    e.target.select()
    
  }

  // 跳转个人信息
  goPerson(){
    this.router.navigate(["person-info"]);

  }


}
