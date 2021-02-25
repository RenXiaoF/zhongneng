import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from 'src/services/api';
import { NativeService } from 'src/services/NativeService';
import { Utils } from 'src/services/Utils';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-my-fans',
  templateUrl: './my-fans.page.html',
  styleUrls: ['./my-fans.page.scss'],
})
export class MyFansPage implements OnInit {
  public data: boolean = false; //页面是否有数据，false默认没有数据
  public pageData = []; //保存页面数据
  public selfData = {
    first_leader_count:'',
    sub_order_total: '',
  }; //保存页面数据
  public beginDate: any; // 开始时间
  public endDate: any;   // 结束时间
  public sub_user_id = 0; // 下级会员的user_id
  public auto_date_count = 1;
  selfInfo = {
    head_pic:'',
    id:'',
    nickname:'',
    tel:''
  }; //用户信息
  sortType: any[] = ['first_leader_count', 'reg_time', 'sub_order_total']; //排序类型
  sortIndex = '1'; //排序索引
  listData: any[] = []
  dataLength = 0;
  dataIndex = 0

  constructor(
    private router: Router,
    private native: NativeService,
    private Api: Api,
    public ActivatedRoute: ActivatedRoute,

  ) {
    this.ActivatedRoute.queryParams.subscribe((params: any) => {
      this.selfInfo = params;
    });
  }
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  ngOnInit() {
  }
  /*  初始化页面 */
  ionViewWillEnter() {
    this.sub_user_id = 0;
    this.beginDate = Utils.dateFormat(new Date(), 'yyyy-MM-ddTHH:mm:ss+08:00');
    this.endDate = Utils.dateFormat(new Date(), 'yyyy-MM-ddTHH:mm:ss+08:00');

    this.getData();
  }
  /*   初始化数据请求 */
  getData() {
    // const start = new Date(this.beginDate).getTime();
    // const end = new Date(this.endDate).getTime();
    // if (start > end) {
    //     this.native.showToast('起始时间不能大于结束时间!');
    //     return;
    // }

    let data = {
      // 'add_time_begin': Utils.dateFormat(new Date(this.beginDate)),
      // 'add_time_end': Utils.dateFormat(new Date(this.endDate)),
      // 'order' : this.sub_user_id,
      'order': this.sortType[Number(this.sortIndex) - 1],
      'sort': 'desc'
    };

    this.pageData = [];
    this.data = false;
    console.log(data);

    this.Api.get('Consign/getMyFans', data).subscribe(
      (res: any) => {
        console.log(res);
        this.data = false;
        if (res.status == 200) {
          this.pageData = res.data.list;
          if (this.pageData.length) {
            this.pageData.forEach(item => {
              item.reg_time = this.format(item.reg_time)
            });
            this.dataLength = this.pageData.length;
            /* 切割数据 */
            if (this.dataLength > 5) {
              let FunData = (e) => {
                let proportion = 5; //按照比例切割
                let num = 0;
                let _data = [];
                for (let i = 0; i < e.length; i++) {
                  if (i % proportion == 0 && i != 0) {
                    _data.push(e.slice(num, i));
                    num = i;
                  }
                  if ((i + 1) == e.length) {
                    _data.push(e.slice(num, (i + 1)));
                  }
                }
                return _data;
              }
              this.pageData = FunData(this.pageData)
              this.listData = this.pageData[this.dataIndex]

            } else {
              this.listData = this.pageData;
            }
          }
          this.selfData = res.data.self;
          this.data = true;
        }
        this.native.hideLoading();
      },
      (err) => {
        console.log(err);
        this.native.hideLoading();
      }
    );
  }

  /* 时间改变 */
  timeChange() {
    if (this.auto_date_count > 2) {
      this.getData();
    }
    this.auto_date_count++;
  }

  /**跳转粉丝明细页面 */
  consumptionDetails() {
    this.router.navigate(["fans-detail"]);
  }

  /** 查看下级的信息 */
  getSubUser(sub_user_id) {
    this.sub_user_id = sub_user_id;
    this.getData();
  }


  /**切换排序 */
  selectSort(e) {
    console.log(e);
    this.sortIndex = e.detail.value;
    console.log(this.sortIndex);

    this.getData();

  }

  /*  返回上一级页面(tabs/mine) */
  goback() {
    this.router.navigate(["/tabs/mine"]);
  }

  /* 处理时间 */
  add0(m) { return m < 10 ? '0' + m : m }
  format(shijianchuo) {
    /* shijianchuo是整数，否则要parseInt转换 */
    var time = new Date(shijianchuo*1000);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + this.add0(m) + '-' + this.add0(d)
  }




  /* 触底加载 */
  loadData(event) {
    setTimeout(() => {
      // console.log('Done');
      event.target.complete();
      if (this.listData.length < this.dataLength) {
        let arr = [...this.pageData[this.dataIndex + 1]]
        this.listData.push(...arr)
      } else {
        this.native.showToast("没有更多数据了！");
        event.target.disabled = true;
      }
    }, 500);
  }

  // toggleInfiniteScroll() {
  //   this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  // }
}
