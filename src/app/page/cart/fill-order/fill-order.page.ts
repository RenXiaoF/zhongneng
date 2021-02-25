import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { Api, NativeService } from 'src/services';
import { Router,ActivatedRoute } from '@angular/router';
import { MyaddressPage } from 'src/app/page/mine/myaddress/myaddress.page';
import * as constants from 'src/services/Constants';

@Component({
    selector: 'app-fill-order',
    templateUrl: './fill-order.page.html',
    styleUrls: ['./fill-order.page.scss'],
})
export class FillOrderPage implements OnInit {
    // 地址
    public address = {
        address_id: '',
        consignee: '',
        mobile: '',
        province_name: '',
        city_name: '',
        district_name: '',
        address: '',
    };
    public user_note = '';
    public storelist = [];
    public total_price = {
        postfee: 0, // 邮费
        goodsfee: 0, // 总商品总额
        payables: 0, // 总金额
        order_type: '0', // 商品类型，0：正常商品，1：boss批发区商品，2：零元区商品，3：福利区商品，4：易货区商品',
        a_coin: 0, // 福利券余额
        b_coin: 0, // 易货券余额
        total_amount: 0, // 应付总金额
        given_b_coin: 0, // 扣除的福利券
        given_a_coin: 0, // 扣除的福利券
        is_reserve: 0, // 是否
    };
    public user_acc = {
        is_reserve: 0, // 是否预定
        reserve_param: {
            reserve_money: 0,

        }, // 预定参数
    };
    public submitdata = {
        act: '',
        address_id: '',
        shipping_code: [],
        user_note: '',
    };
    // 更新配送方式时所有店铺的配送方式
    public shipping_code = {};
    public b_coin = '0'; // 易货券
    public a_coin = '0'; // 福利券

    public type:string = ""; //保存商品是从那个区域过来的

    retail_price = constants.RETAIL_PRICE
    trade_price = constants.TRADE_PRICE

    constructor(
        public navCtrl: NavController,
        // public navParams: NavParams,
        public alertCtrl: AlertController,
        public api: Api,
        public native: NativeService,
        // public events: Events,
        public modalCtrl: ModalController,
        // public viewCtrl: ViewController,
        public router: Router,
        public nav: NavController,
        public ActivatedRoute: ActivatedRoute,

    ) {
        this.ActivatedRoute.queryParams.subscribe((params: any) => {
            this.type = params.product_type;
        });


        // events.subscribe('changeaddress', (addressinfo) => {
        //     console.log(addressinfo);
        //     // 更改地址和更改地址后获取更新价格
        //     this.address = addressinfo;
        //     this.updateprice();
        // });
    }

    ngOnInit() { }

    ionViewWillEnter() {
        console.log('ionViewWillEnter FillorderPage');
        this.getcart2();
    }
    /** 填写订单 */
    getcart2() {
        console.log('getcart2');
        this.api.postFormData('Cart/cart2').subscribe((res: any) => {
            console.log(res);
            if (res.status == 1) {
                this.address = res.result.address;
                this.storelist = res.result.storeList;

                this.total_price.goodsfee = res.result.total_price.goods_fee;
                this.total_price.payables = res.result.total_price.total_fee;
                this.total_price.postfee = res.result.total_price.post_fee;
                this.total_price.order_type = res.result.total_price.order_type;
                this.total_price.a_coin = res.user_acc.a_coin;
                this.total_price.b_coin = res.user_acc.b_coin;
                this.user_acc.is_reserve = res.user_acc.is_reserve;
                this.user_acc.reserve_param = res.user_acc.reserve_param;

                if (this.total_price.order_type == '3') {
                    this.total_price.total_amount = res.result.total_price.total_fee - res.user_acc.given_a_coin;
                } else if (this.total_price.order_type == '4' || this.total_price.order_type == '0') {
                    this.total_price.total_amount = res.result.total_price.total_fee - res.user_acc.given_b_coin;
                } else {
                    this.total_price.total_amount = res.result.total_price.total_fee;
                }

                this.total_price.given_a_coin = res.user_acc.given_a_coin;
                this.total_price.given_b_coin = res.user_acc.given_b_coin;

                this.storelist.forEach(val => {
                    // 配送方式
                    this.api.postFormData('Cart/getStoreShipping', { 'store_id': val.store_id }).subscribe((res: any) => {
                        if (res.status == 1) {
                            val.postarr = res.result;
                            val.choosepostname = '';
                        }
                    }, (err) => {
                        console.log(err);
                    });
                    this.shipping_code[val.store_id] = '';
                });
            } else if (res.status == -99) {
                this.native.showToastTips(res.msg);
                // this.navCtrl.push('LoginPage');
                this.router.navigate(['login']);
            } else if (res.status == -10) {
                this.native.showToastTips(res.msg);
                // this.navCtrl.push('MyaddressPage',{'chooseaddress':true});
                // this.router.navigate(['myaddress'], {
                //   queryParams: {
                //     chooseaddress: true,
                //   }
                // })
                this.gotoaddress();
            } else if (res.status == -101) {
                this.native.showToastTips(res.msg);
            } else {
                this.native.showToastTips(res.msg);
            }
        }, (err) => {
            console.log(err);
        });
    }
    /** 修改地址 */
    async gotoaddress() {
        // this.navCtrl.push('MyaddressPage',{'chooseaddress':true});
        // this.router.navigate(['myaddress'], {
        //   queryParams: {
        //     chooseaddress: true,
        //   }
        // })
        const modal = await this.modalCtrl.create({
            component: MyaddressPage,
            componentProps: {
                chooseaddress: true,
            }
        });
        await modal.present();

        // 刷新地址信息
        const { data } = await modal.onDidDismiss();
        if (data && data.flag) {
            this.getcart2();
        }
    }
    /** 更新价格 */
    updateprice() {
        let address_id = this.address.address_id;
        let shipping_code = JSON.stringify(this.shipping_code);
        this.api.postFormData('Cart/cart3', { 'address_id': address_id, 'shipping_code': shipping_code }).subscribe((res: any) => {
            console.log(res);
            if (res.status == 1) {
                this.total_price.postfee = res.result.postFee;
                this.total_price.goodsfee = res.result.goodsFee;
                this.total_price.payables = res.result.payables;
            } else {
                this.native.showToastTips(res.msg);
            }
        }, (err) => {
            console.log(err);
        });
    }
    /** 选择配送方式  */
    async selectpost(store) {
        console.log(store);
        console.log(this.shipping_code);
        let posttype = [];
        store.postarr.forEach(val => {
            let obj = {
                type: 'radio',
                label: val.name,
                value: val.shipping_code,
            };
            posttype.push(obj);
        });
        let alert = await this.alertCtrl.create({
            header: '选择配送方式',
            inputs: posttype,
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        console.log('cancel');
                    }
                }, {
                    text: '确定',
                    handler: (data) => {
                        console.log('ok');
                        this.shipping_code[store.store_id] = data; // 选择的配送方式的代号
                        let choosepostname = '';
                        store.postarr.forEach(val => {
                            if (val.shipping_code == data) {
                                choosepostname = val.name;
                            }
                        });
                        this.storelist.forEach(val => {
                            if (store.store_id == val.store_id) {
                                val.choosepostname = choosepostname;
                            }
                        });
                        this.updateprice();
                    }
                }
            ]
        });
        await alert.present();
    }
    /** 提交订单 */
    submit() {
        console.log('submit');
        let act = 'submit_order';
        let address_id = this.address.address_id;
        for(let item of this.storelist){
            this.shipping_code[item.store_id] = item.postarr[0].shipping_code;
        }
        let shipping_code = JSON.stringify(this.shipping_code);
        for (let i in this.shipping_code) {
            if (this.shipping_code[i] == '') {
                this.native.showToastTips('请选择配送方式');
                return;
            }
        }
        let user_note = this.user_note;
        console.log(user_note);
        this.api.postFormData('Cart/cart3',
            {
                act: act,
                address_id: address_id,
                shipping_code: shipping_code,
                user_note: user_note,
                order_type: this.total_price.order_type,
                b_coin: this.b_coin,
                a_coin: this.a_coin
            }).subscribe((res: any) => {
                console.log(res);
                if (res.status == 1) {
                    // 预定支付定金跳转
                    if (res.is_reserve_pay == 1) {
                        console.log(res.is_reserve_pay);
                        this.router.navigate(['myconsumeorder']);
                        return;
                    }
                    this.native.showToastTips(res.msg);
                    // this.navCtrl.push('PlaceorderPage',{'order_id':res.order_id,'master_order_sn':res.result});
                    this.router.navigate(['place-order'], {
                        queryParams: {
                            order_id: res.order_id,
                            master_order_sn: res.result,
                            type: this.type
                        }
                    });

                } else if (res.status == -99) {
                    this.native.showToastTips(res.msg);
                    this.router.navigate(['login']);
                } else {
                    this.native.showToastTips(res.msg);
                }
            }, (err) => {
                console.log(err);
            });
    }
    goback() {
        this.nav.back();
    }

}
