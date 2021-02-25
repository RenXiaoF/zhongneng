import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Api, NativeService } from 'src/services';

@Component({
  selector: 'app-divide-information',
  templateUrl: './divide-information.page.html',
  styleUrls: ['./divide-information.page.scss'],
})
export class DivideInformationPage implements OnInit {
  public data:boolean = false;  //保存订单明细是否有数据，默认false为没有数据
  public order_id = ""; //保存上个页面传过来的订单号
  public type = ""; //保存上个页面传过来的类型，回跳时使用
  public pageData = ""; //保存页面数据

  constructor(
    private router: Router,
    private api: Api,
    private native: NativeService,
    private ActivatedRoute: ActivatedRoute,
  ) {
    this.ActivatedRoute.queryParams.subscribe((params:Params)=>{
      this.type = params.type;
      this.order_id = params.order_id;
    });
  }

  ngOnInit() {
  }
  // 初始化页面
  ionViewWillEnter() {
    this.getData();
  }


  // 获取分成信息
  getData() {
    // 请求参数对象
    let obj = {
      "order_id": this.order_id,
    };
    this.native.showLoading();
    this.api.postFormData('consign/separateConsign', obj).subscribe((res: any) => {
      this.native.hideLoading();
      console.log(res)
      if(res.status == 200){
        if(res.data.length > 0){
          this.data = true;
          // 按log_id降序排序
          res.data.sort((a, b)=>{
            return Number(b.log_id) - Number(a.log_id)
          });
          this.pageData = res.data;
        }else{
          this.data = false;
        }
      }else {
        this.native.showToastTips(res.msg);
      }
      }, (err) => {
        this.native.hideLoading();
        console.log(err);
      });
  }
  // 返回上一级页面(/tabs/tab-my)我的页面
  goback() {
    this.router.navigate(["consignOrder"],{queryParams:{type:this.type}});
  }
}
