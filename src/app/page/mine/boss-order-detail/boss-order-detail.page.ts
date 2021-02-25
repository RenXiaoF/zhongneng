import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api } from 'src/services/api';
import { NativeService, User } from 'src/services';
import { AlertController, ModalController } from '@ionic/angular';
import { DescriptionDocPage } from '../description-doc/description-doc.page';

@Component({
  selector: 'app-boss-order-detail',
  templateUrl: './boss-order-detail.page.html',
  styleUrls: ['./boss-order-detail.page.scss'],
})
export class BossOrderDetailPage implements OnInit {
  public data = true; // 保存页面是否有数据状态，true为有数据，false为无数据
  public consignOrderData = []; // BOSS订单的数据
  public orderId = '';
  public orderArr = [];
  public confirmText; // 操作去寄售和提货的提示文件
  public isShowLoading = false; // showLoading 默认false
  public typeId = 0; // 全部订单类型
  public currentPage = 1; // 当前页数
  public lastPage = 0; // 最后页码数




  constructor(
    private router: Router,
    private Api: Api,
    private ActivatedRoute: ActivatedRoute,
    public native: NativeService,
    private alertCtrl: AlertController,
    private user: User,
    private modelCtrl: ModalController
  ) {
    this.ActivatedRoute.queryParams.subscribe((params: Params) => {
      this.orderId = params.order_id;
      // console.log(this.orderId);
      this.typeId = params.type_id
      // console.log('this.type_id',this.typeId);
      this.fetchData();
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {

  }
  /** 获取boss区 订单详情 */
  fetchData() {
    this.Api.get('consign/detail', { order_id: this.orderId }).subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.consignOrderData = data.data;
          console.log('获取boss区 订单详情', this.consignOrderData);
          // this.consignOrderData.forEach(e => {
          //   this.orderArr.push(e.order.order_goods)
          // });
          // console.log(this.orderArr);


        } else {
          this.native.showToastTips(data.msg);

        }

      }, error => {
        console.log(error);
      });
  }

  // 批发订单的操作
  handleConsignOrder(item, typeId) {
    if (typeId === '1') { // 1: 再寄售，
      let data = {
        'type': typeId,
        'consign_type': item.consign_type,
        'order_id': item.order_id,
        'goods_consign_id': item.goods_consign_id
      };
      this.operate(data);
    } else if (typeId === '2') { // 2：提货，
      let data = {
        'type': typeId,
        'consign_type': item.consign_type,
        'order_id': item.order_id,
        'goods_consign_id': item.goods_consign_id
      };
      this.operate(data);
    } else if (typeId === '3') { // 3：退钱
      let data = {
        'type': typeId,
        'consign_type': item.consign_type,
        'order_id': item.order_id,
        'goods_consign_id': item.goods_consign_id
      };
      this.operate(data);
    } else if (typeId === '4') { // 跳支付页面
      this.router.navigate(['fac-buy'], {
        queryParams: {
          total_amount: item.total_amount,
          order_sn: item.order_sn,
          order_id: item.order_id,
          type: 1  //批发区商品
        }
      });
    } else if (typeId === '5') { // 跳物流信息页面
      let invoice_no = item.invoice_no ? item.invoice_no : 0;
      if (invoice_no) {
        window.location.href = 'http://m.kuaidi100.com/result.jsp?nu=' + invoice_no;
        // let kuaidi100_url = 'http://m.kuaidi100.com/result.jsp?nu=' + invoice_no;
        // this.gotourl(kuaidi100_url);
      } else {
        this.native.showToastTips('还未发货！');
      }
    }
    // else if (typeId === '2') { // 跳排队信息页面
    //     this.router.navigate(["queueinfo"],{queryParams:{order_id:order_id, type:this.typeId}});
    // } else if (typeId === '3') { // 确认去寄售或去提货
    //     // 确认和取消的操作
    //     this.confirmConsignOrderStatus(index, item.order_id,typeId);
    // } else if (typeId === '4') { // 跳分成信息页面
    //     console.log(item);
    //     this.router.navigate(["divideinformation"],{queryParams:{order_id:order_id, type:this.typeId}});
    // } else if (typeId === '5') { // 跳物流信息页面
    //     let invoice_no = item.delivery_doc ? item.delivery_doc.invoice_no : 0;
    //     console.log(item)
    //     if (invoice_no) {
    //         window.location.href = "http://m.kuaidi100.com/result.jsp?nu=" + invoice_no;
    //     }else{
    //         this.native.showToastTips('物流单号错误');
    //     }
    // } else if (typeId === '6') { // 删除取消的订单
    //     this.deleteOrder(item.order_id);
    // }
  }

  // 寄售中订单的操作，1: 再寄售，2：提货，3：退钱
  operate(req) {
    this.Api.postFormData('consign/operate', req).subscribe((data: any) => {
      if (data.status == 200) {
        // this.router.navigate(["/consignOrder"]);
        this.native.showToastTips(data.data);
        this.router.navigate(["consignOrder"], {
          queryParams: {
            'type': this.typeId
          }
        });
      } else {
        this.native.showToastTips(data.msg);
      }

    }, error => {
      console.log(error);
    });
  }

  async gotourl(url) {
    const modal = await this.modelCtrl.create({
      component: DescriptionDocPage,
      cssClass: 'modelBox',
      componentProps: {
        url: url,
        title: '物流信息'
      }
    });
    await modal.present();
  }

  // 返回上一级页面(订单页)
  goback() {
    // this.router.navigate(["/consignOrder"]);
    this.router.navigate(["consignOrder"], {
      queryParams: {
        'type': this.typeId
      }
    });
  }

}
