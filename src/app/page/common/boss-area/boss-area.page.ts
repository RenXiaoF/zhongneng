import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api, NativeService } from '../../../../services';
import * as constants from 'src/services/Constants';
import { from } from 'rxjs';

@Component({
  selector: 'app-boss-area',
  templateUrl: './boss-area.page.html',
  styleUrls: ['./boss-area.page.scss'],
})
export class BossAreaPage implements OnInit {
  public startTime = '';
  public segments = [];    // 时间段
  public period_id = ""; //保存期数
  public page = 1;           // 分页
  public lastPage = 1000;    // 最后一页
  public products = [];      // 商品列表
  public period:any = [];      // 期数数据
  public data = true;        // 保存页面是否有数据状态，true为有数据，false为无数据
  public showTime = [];  //保存活动区/批发区时间（时/分/秒）
  public time = null; //修复时间多次加载速度变快问题
  public start_time = 0; //保存起始时间
  public end_time = 0; //保存结束时间
  public cur_time = (new Date()).getTime() /1000; //保存当前时间
  public text = "距开始";  //保存活动区/批发区文本
  public btn_text = "即将开始";  //保存活动区/批发区文本
  retail_price = constants.RETAIL_PRICE
  trade_price = constants.TRADE_PRICE

  constructor(
    private router: Router,
    private api: Api,
    private native: NativeService

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
      this.products = [];
      this.page = 1;
      this.lastPage = 1000;
    this.getGoodList();
  }

  goback() {
    this.router.navigate(['/tabs/home']);
  }

  // initNavData() {
  //   let nav = [
  //     { name: "12:00" },
  //     { name: "14:00" },
  //     { name: "16:00" },

  //   ]
  //   this.segments = nav
  // }



  // 分类选项卡切换
  changeSegment(myIndex) {
    for (let item of this.segments) {
      item.isChecked = false;
    }
    this.segments[myIndex].isChecked = true;
  }


  // leaveStart() {
  //   let EndTime = new Date('2020/9/10 16:00:00'); //截止时间 
  //   let NowTime = new Date();
  //   let t = EndTime.getTime() - NowTime.getTime();
  //   let d = Math.floor(t / 1000 / 60 / 60 / 24) > 10;
  //   let h = Math.floor(t / 1000 / 60 / 60 % 24);
  //   let m = Math.floor(t / 1000 / 60 % 60);
  //   let s = Math.floor(t / 1000 % 60);
  //   this.startTime = this.addZero(h) + '：' + this.addZero(m) + '：' + this.addZero(s)
  //   console.log('1535454', this.startTime);

  // }

  addZero(num) {
    if (Number(num) < 10) {
      // console.log(123);

      return '0' + num
    } else {
      console.log(321);
      return num

    }
  }

  goBorder() {
    this.router.navigate(["boss-order"]);
  }

  // 跳转到商品详情页(detail)
  godetail(goods_id, product_type) {
    this.router.navigate(["goods-detail"], { queryParams: { goods_id: goods_id, product_type: product_type } });
  }

  /** 获取BOSS区商品列表 */
  getGoodList() {
    clearInterval(this.time);
    let data = {
      'order': 'sort',
      'sort': 'asc',
      'page': this.page
    };
    this.api.get('goods/wholesaleGoods', data).subscribe(
      (res: any) => {
        console.log('project:' + res.data.period);
        if (res.data.period_goods.length > 0) {
          this.products = [...this.products, ...res.data.period_goods];
          this.period = res.data.period;
          this.period_id = this.period['period_id'];
          this.start_time = this.period.start_time;
          this.end_time = this.period.end_time;
          this.cur_time = this.period.cur_time;
          // console.log(123);
          this.initTime();
        } else {
          this.lastPage = 0;
          this.native.showToast('没有更多数据了！', 1000);
        }
        if (this.products.length > 0) {
          this.data = true;
        } else {
          this.data = false;
        }

      },
      (err) => {
        console.error('ERROR' + err);
      }

    );
  }

  /** 下拉刷新 */
  doRefresh(event) {
    setTimeout(() => {
      this.products = [];
      this.page = 1;
      this.lastPage = 1000;
      this.data = true;
      this.getGoodList();
      event.target.complete();
    }, 1000);
  }

  transform(second) {
    let temp = second;
    let hour;
    hour = Math.floor(temp / 3600);
    let min = Math.floor((temp / 60) % 60);
    let sec = Math.floor(temp % 60);
    let h = "";
    let m = "";
    let s = "";
    if (hour < 10) {
      h = "0" + hour;
    } else {
      h = hour.toString();
    }
    if (min < 10) {
      m = "0" + min;
    } else {
      m = min.toString();
    }
    if (sec < 10) {
      s = "0" + sec;
    } else {
      s = sec.toString();
    }
    return h + ":" + m + ":" + s;
  }

  // 初始化时间
  initTime() {
    clearInterval(this.time);
    this.time = setInterval(() => {
      this.cur_time++;
      if (this.start_time - this.cur_time > 0) {
        this.text = "距开始";
        this.btn_text = "即将开始";
        let beginTime = this.start_time - this.cur_time;
        let timeArr = this.transform(beginTime).split(":");
        for (let i = 0; i < timeArr.length; i++) {
          this.showTime[i] = timeArr[i];
        }
      }else if(this.start_time == this.cur_time || this.end_time == this.cur_time ){
        clearInterval(this.time);
        location.reload();
        this.getGoodList();
      }else {
        this.text = "距结束";
        this.btn_text = "抢购";
        let endTime = this.end_time - this.cur_time;
        // console.log('123',endTime ,this.end_time,this.cur_time);
        
        let timeArr = this.transform(endTime).split(":");
        for (let i = 0; i < timeArr.length; i++) {
          this.showTime[i] = timeArr[i];
        }
        // console.log(timeArr);
        // if(this.showTime[0] == '00' &&  this.showTime[1] == '00' && this.showTime[2] == '00'){
          
        // }
      }
    }, 1000);
  }

  goDetail(pid){
    let start_time = this.start_time;
    let end_time = this.end_time;
    let cur_time = this.cur_time;
    let type = 1;
    clearInterval(this.time);
    this.router.navigate(["detail"], {
      queryParams:{
        type,
        pid,
        start_time,
        end_time,
        cur_time
      }
    });
  }

}
