import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fill-order',
  templateUrl: './fill-order.page.html',
  styleUrls: ['./fill-order.page.scss'],
})
export class FillOrderPage implements OnInit {
  public showData = [];  //页面显示数据
  goods_num = 1
  storelist = []; //所有商品数据
  constructor(
    private router: Router,

  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.getcartlist()
  }

  goback() {
    this.router.navigate(["/tabs/cart"]);
  }

  getcartlist() {
    let list = [
      {
        "store_id": 1,
        "store_name": "罗斯软件旗舰店",
        "select_all": 0,
        "cartList": [
          {
            "id": 1,
            "user_id": 239770,
            "session_id": "p1affa9l22r430ck04lfmv8156",
            "goods_id": 872,
            "goods_sn": "测试8956",
            "goods_name": "测试8956",
            "market_price": "1200.00",
            "goods_price": "1500.00",
            "member_goods_price": "1500.00",
            "goods_num": 1,
            "spec_key": "",
            "spec_key_name": "",
            "bar_code": "",
            "selected": 0,
            "add_time": 1599639049,
            "prom_type": 0,
            "prom_id": 0,
            "sku": "",
            "store_id": 1,
            "locateid": "",
            "is_gift": 0,
            "sgs_id": 0,
            "item_id": 0,
            "bill_type": 0,
            "is_discount": 0,
            "store_no": 0,
            "b_coin": 0,
            "order_type": 0,
            "give_coin": 0,
            "goods_fee": 1500,
            "store_count": 99,
            "is_flash": 0,
            "original_img": "assets/img/cart/1.jpg"
          }
        ]
      }
    ]

    this.storelist = list
    this.showData = list[0].cartList
    console.log(this.storelist, this.showData);
    
  }

}
