import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Api } from 'src/services/api';
import { NativeService } from 'src/services/NativeService';
import { Utils } from 'src/services/Utils';
// import { AddToCartPage } from 'src/pages/tab-cart/add-to-cart/add-to-cart.page';
import { GlobalData } from 'src/services/GlobalData';
import { ProductAgreementPage } from '../product-agreement/product-agreement.page';
import { SignInPage } from '../../login/sign-in/sign-in.page';
import { SignUpPage } from '../../mine/sign-up/sign-up.page';
import { IdentityPage } from '../../mine/identity/identity.page';
import { MyaddressPage } from '../../mine/myaddress/myaddress.page';
import { NewaddressPage } from '../../mine/newaddress/newaddress.page';
import {ChooseSpecPage} from '../../classify/choose-spec/choose-spec.page';
// import { FILE_SERVE_URL } from 'src/services/Constants';
// import { ProductAgreementPage } from 'src/pages/tab-cart/product-agreement/product-agreement.page';
import * as constants from 'src/services/Constants';
import { GoodsSizePage } from '../goods-size/goods-size.page';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public pid:string = ""; //保存商品id
  public type:string = ""; //保存商品是从那个区域过来的
  public slides = []; //保存商品轮播图信息
  public img_detail = []; //保存商品详情图片
  public b_coin = "0"; //保存用户批发券数量
  public goods_num = 1;  //保存购买商品数量,默认为一件
  public buyCount = 5; //购买数量,限购5个

  public start_time = 0; //保存起始时间
  public end_time = 0; //保存结束时间
  public cur_time = 0; //保存当前时间
  public text = "距开始";  //保存活动区/批发区文本
  public showTime = ["00","00","00"];  //保存活动区/批发区时间（时/分/秒）
  public time = null; //修复时间多次加载速度变快问题
  //保存普通商品信息
  public ordinary = {
    "shop_price":"",
    "market_price":"",
    "goods_remark":"",
    "store_count":"",
    "is_free_shipping":"0",

  };
  //保存活动商品信息
  public activity = {
    "shop_price":"",
    "goods_remark":"",
    "b_coin":"",
    "store_count":"",
    "is_free_shipping":"0"
  };
  //保存批发商品信息
  public wholesale = {
    "shop_price":"",
    "goods_remark":"",
    "con_list":[],
    "store_count":"",
    "is_free_shipping":"0"
  };
  public con_list_style = [];   //保存套餐样式
  public con_type = 0;  //保存选择套餐的下标
  public data: any;     // boss区商品的信息

  // 轮播图配置属性
  public slideOpts={
    speed:400,
    autoplay: {
      delay: 2000,
    },
    loop:true
  }

  goodsdetail: any = {
    goods_id: '',
    goods_name: ' ',
    market_price: ' ',
    shop_price: ' ',
    spec: [],
    goods_content: '',
    address: { info: '', month: '', day: '' },
    store_id: 0,
    store: {},
    code_type: '',
    images:[],
    store_no:0,
    order_type:0
  };

  radio_value = 0;
  public isChecked = false; // 是否同意寄售协议
  public checkType = '3';   // boss批发订单选择类型，1：提货寄售, 2: 易货寄售.
  public btn_status: any = false;
  retail_price = constants.RETAIL_PRICE
  trade_price = constants.TRADE_PRICE
  

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private Api: Api,
    private native: NativeService,
    public modalCtrl: ModalController,
    private _GlobalData: GlobalData,
  ) {
    this.buyCount = this._GlobalData.user.batch_num_limit ? this._GlobalData.user.batch_num_limit : 5;
    this.goods_num = 1;
    this.ActivatedRoute.queryParams.subscribe((params: Params) => {
      // alert(params.pid);
      this.pid = params.pid;
      this.type = params.type;
      this.start_time = params.start_time;
      this.end_time = params.end_time;
      this.cur_time = params.cur_time;
      this.b_coin = this._GlobalData.user.b_coin;
      this.native.showLoading();
      this.Api.postFormData('Goods/wholesaleSingleGoods', {goods_id:this.pid}).subscribe(
        (res: any)=>{
          console.log(res);
          if (res.status == 200) {
              this.ordinary = res.result;
              this.activity = res.data;
              this.wholesale = res.result;
              this.data = res.data;
              this.goodsdetail = res.data.goods;
  
              // 商品详情图
              // this.goodsdetail.goods_content = Utils.imgUrlConversion(this.goodsdetail.goods_content);
              // 解决商品详情图片路径异常问题
              this.slides = res.data.images;
              this.native.hideLoading();
              this.initTime();
          } else {
              this.native.showToastTips(res.msg);
          }
        },
        (err) => {
          console.log(err);
          this.native.hideLoading();
        }
      );
    });
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
  }

  // 弹出协议
  goProductAgreement(){
    this.modalCtrl.create({
      component: ProductAgreementPage,
    }).then(
        view => {
          view.present();
        }
    );
  }

  // 修改商品数量
  changenum(step) {
    let num = Utils.accAdd(this.goods_num, step);
    if (num < 1) {
      this.native.showToastTips('不能小于1');
    } else {
      this.goods_num = num;
      console.log(this.buyCount);
      if(this.type == '1' && num > this.buyCount){
        this.goods_num = this.buyCount;
        this.native.showToastTips('boss批发区商品一次性最多购买'+this.buyCount+'个！');
      }
    }
  }

  keydown(evt) {
    let num = evt.target.value;
    this.goods_num = num;
    if(this.type == '2' && num > this.buyCount){
      setTimeout(()=>{
        this.goods_num = this.buyCount;
        this.native.showToastTips('批发区商品一次性最多购买'+this.buyCount+'个！');
      },200);
    }
    return (Utils.checknumber(evt));
  }
  // 联系客服
  contactKF(){
    // window.location.href="tel:020-32051231";
    console.log("联系客服");
  }
  // 跳转到购物车
  // gotocart(){
  //   this.router.navigate(['/tabs/tab-cart']);
  // }
  // // 立即购买
  // async buynow() {
  //   if (!this.isChecked) {
  //       this.native.showToastTips('请先阅读寄售协议，并勾选同意此协议');
  //       return true;
  //   }
  //   this.btn_status = true
  //   let spec = [];
  //   let data = {
  //       order_type: 1,
  //       goods_id: this.goodsdetail.goods_id,
  //       goods_spec: spec,
  //       goods_num: this.goods_num,
  //       wholesale_type: this.checkType,
  //   };
  //   this.Api.postFormData('Cart/one_step_buy', data).subscribe(async (res: any) => {
  //       if (res.status == 1) {
  //           this.router.navigate(['fill-order'],{ queryParams: { product_type: "1" } });
  //       } else {
  //           if (res.status == -31) {
  //               this.modalCtrl.create({
  //                   component: SignInPage,
  //                   componentProps: {
  //                       dosignup: true,
  //                       type: 'edit'
  //                   }
  //               }).then(
  //                   view => {
  //                       view.present();
  //                   }
  //               );
  //               return;
  //           }else if(res.status == 5001){
  //             this.native.showToastTips(res.msg);
  //             this.modalCtrl.create({
  //               component: IdentityPage,
  //               componentProps: {
  //                 dosignup: true,
  //               }
  //             }).then(
  //               view => {
  //                 view.present();
  //               }
  //             );
  //           }else if(res.status == -10){
  //             this.native.showToastTips(res.msg);
  //             const modal = await this.modalCtrl.create({
  //               component: NewaddressPage,
  //             });
  //             await modal.present();
  //             await modal.onDidDismiss().then(() => {
  //               this.btn_status = false
  //             });
  //           }else{
  //             this.native.showToastTips(res.msg);
  //           }
  //       }
  //   }, (err) => {
  //     console.log(err);
  //   })
  // }
  // 加入购物车
  async addtocart() {
    // this.goodsdetail.num = this.goods_num;
    // this.goodsdetail.order_type = this.type;
    // this.goodsdetail.store_no = 0;
    // if(this.type == '2'){
    //   this.goodsdetail.store_no = this.wholesale.con_list[this.con_type].store_no;
    // }
    // console.log(this.goodsdetail)
    // const modal = await this.modalCtrl.create({
    //   component: AddToCartPage,
    //   componentProps: {
    //     goodsdetail: this.goodsdetail,
    //     buynow: 0,
    //     cssClass: 'loadAddtocart',
    //   }
    // })
    // await modal.present();
  }
  // 切换套餐
  selectedItem(myIndex){
    for(let i=0;i<this.con_list_style.length; i++){
      this.con_list_style[i] = false;
    }
    this.con_list_style[myIndex] = true;
    this.con_type = myIndex;
  }
  // 初始化时间
  initTime(){
    if(this.type == '0'){
      return;
    }
    clearInterval(this.time);
    this.time = setInterval(()=>{
      this.cur_time++;
      if(this.cur_time >= this.end_time){
        this.text = "已结束!";
        this.btn_status = true;
        for(let i=0; i<this.showTime.length; i++){
          this.showTime[i] = "00";
        }
        clearInterval(this.time);
        return;
      }
      if(this.start_time - this.cur_time > 0){
        this.text = "距开始"; 
        let beginTime = this.start_time - this.cur_time;
        let timeArr = this.transform(beginTime).split(":");
        for(let i=0; i<timeArr.length; i++){
          this.showTime[i] = timeArr[i];
        }
      }else{
        this.text = "距结束"; 
        let endTime = this.end_time - this.cur_time;
        let timeArr = this.transform(endTime).split(":");
        for(let i=0; i<timeArr.length; i++){
          this.showTime[i] = timeArr[i];
        }
      }
    },1000);
  }
  /**
  * 功能：把秒转成xx:xx:xx格式
  * @param second 传过来的秒数(不是毫秒数)
  * @param type 控制返回格式类型,默认值为1，返回时间小于24小时，其他值返回时间大于24小时
  */
  transform(second) {
    let temp = second;
    let hour;
    hour = Math.floor(temp / 3600);
    let min = Math.floor((temp / 60) % 60);
    let sec = Math.floor(temp % 60 );
    let h = "";
    let m = "";
    let s = "";
		if (hour < 10) {
      h = "0"+hour;
    }else{
      h = hour.toString();
    }
		if (min < 10) {
      m = "0"+min;
		}else{
      m = min.toString();
    }
		if (sec < 10) {
      s = "0"+sec;
    }else{
      s = sec.toString();
    }
    return h+":"+m+":"+s;
  }
  // 跳转到订单页面(order)
  // goorder(){
  //   this.router.navigate(["order"]);
  // }
  // 返回上一级页面(boss-area)
  goback(){
    this.router.navigate(["/boss-area"]);
  }

  async buynow() {
      const modal = await this.modalCtrl.create({
        component: GoodsSizePage,
        cssClass: 'my-custom-class',
        componentProps: {
          goodsdetail: this.data,
        }
      });
      await modal.present();
  }
}
