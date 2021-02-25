import { Component, OnInit } from '@angular/core';
import { Api, NativeService, GlobalData } from 'src/services';
import { NavController, PopoverController, AlertController, ModalController } from '@ionic/angular';
// import { PopoverMainPage } from 'src/pages/tab-cart/popover-main/popover-main.page';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DescriptionDocPage } from '../description-doc/description-doc.page';
// import { ModelBoxComponent } from 'src/pages/tab-my/model-box/model-box.component';

@Component({
    selector: 'app-my-consumeorder',
    templateUrl: './my-consumeorder.page.html',
    styleUrls: ['./my-consumeorder.page.scss'],
})
export class MyConsumeorderPage implements OnInit {
    public storelist = []; // 商店列表
    public page_num: number = 1; // 当前页数
    public isShowLoadMore: boolean = true; // 是否可以加载更多
    public search_key = ''; // 搜索的关键字 or key
    // 区域订单 分类
    public classTypes = [
        { type: '0', name: '普通', checked: true },
        // { type: '1', name: 'Boss',  checked: false},
        { type: '2', name: '零元', checked: false },
        { type: '3', name: '福利', checked: false },
        { type: '4', name: '易货', checked: false },
    ];
    public chooseClassType = ''; // 切换 订单类型
    // 订单类型
    public ordertypes = [
        {
            type: '',
            name: '全部',
            checked: true,
        }, {
            type: 'WAITPAY',
            name: '未付款',
            checked: false,
        }, {
            type: 'WAITSEND',
            name: '待发货',
            checked: false,
        }, {
            type: 'WAITRECEIVE',
            name: '待收货',
            checked: false,
        }, {
            type: 'WAITCCOMMENT',
            name: '已完成',
            checked: false,
        }
    ];
    public chooseordertype = ''; // 切换 订单类型
    public bill_type = 0;
    public goods_list = []; // 商品列表
    public index = 0;
    public index2 = 0;
    public my_title = '购物订单';

    // 预售参数
    public is_reserve = 0; // 是否预售
    public is_pay = 0; // 是否已支付支付订金  1：已付订金
    public start_time = 0;  // 开始时间
    public end_time = 0;  // 结束时间
    public now_time: any = Date.parse(String(new Date())) / 1000; // 当前时间
    public is_click = false;
    public set_time;
    public reserve_param: any = {}; // 预售 参数


    constructor(
        public navCtrl: NavController,
        public api: Api,
        public native: NativeService,
        public router: Router,
        public popoverCtrl: PopoverController,
        public alertCtrl: AlertController,
        public activated: ActivatedRoute,
        public modalCtrl: ModalController,
        public globalData: GlobalData,
        public modelCtrl: ModalController
    ) {
        this.activated.queryParams.subscribe((params: Params) => {
            this.bill_type = params.bill_type;
            this.index = params.index ? params.index : 0;
            this.index2 = params.index2 ? params.index2 : 0;
            this.chooseClassType = this.classTypes[this.index].type;
            this.chooseordertype = this.ordertypes[this.index2].type;
            this.my_title = this.bill_type ? '批发订单' : this.my_title;

        });

    }

    ngOnInit() {
        this.globalData.shareUrl = window.location.href;
    }
    /** 初始化页面 */
    ionViewWillEnter() {
        // 区域订单 分类
        this.changeClassType(this.classTypes[this.index].type);
        // 切换订单类型
        this.changeordertype(this.ordertypes[this.index2].type);
    }

    /** 获取 订单 列表 */
    getorderlist(orderType?: any) {
        this.native.showLoading();
        this.api.postFormData('Order/order_list', {
            'start_time': '',
            'end_time': '',
            'type': this.chooseordertype,
            'search_key': this.search_key,
            'bill_type': this.bill_type,
            'p': this.page_num,
            'order_type': orderType,
        }).subscribe((res: any) => {
            // 判断返回结果集
            if (res.result.length > 0) {
                this.isShowLoadMore = true;
            } else {
                this.isShowLoadMore = false;
            }
            if (res.status == 1) {
                // 判断当前页数
                if (this.page_num === 1) {
                    this.storelist = res.result.data;
                    console.log('655', this.storelist);
                    this.storelist.forEach(item => {
                        if (JSON.stringify(item.reserve_param) !== '{}' && item.reserve_param) {
                            // item.reserve_param.start_time = Date.parse(item.reserve_param.start_time)/1000;
                            item.reserve_param.end_time_back = item.reserve_param.end_time;
                            item.reserve_param.end_time = Date.parse(item.reserve_param.end_time)/1000;

                            // console.log(this.now_time,item.reserve_param.end_time );

                        }
                    });

                    // this.reserve_param = this.storelist[0].reserve_param;
                    // this.start_time = Date.parse(this.reserve_param.start_time)/1000;
                    // this.end_time = Date.parse(this.reserve_param.end_time)/1000;
                    // this.presell()

                } else {
                    for (let item of res.result.data) {
                        this.storelist.push(item);
                    }
                }
                console.log('获取 订单 列表', this.storelist);
            }
            // 处理结果
            if (this.storelist.length > 0) {
                for (let store of this.storelist) {
                    if (store.goods_list.length > 0) {
                        let num = 0;
                        for (let good of store.goods_list) {
                            num += Number(good.goods_num);
                        }
                        store.order_num = num;
                    }
                }
            }
            // else{
            //     this.native.showToast(res.msg, 1000);
            // }
             this.native.hideLoading();

        }, (err) => {
            console.log(err);
        });
    }
    /** 区域订单 分类 第一层 */
    changeClassType(type) {
        this.classTypes.forEach((val, index) => {
            val.checked = false;
            if (val.type == type) {
                this.index = index;
                val.checked = true;
                this.chooseClassType = type;
                console.log('dingdanleixing', this.chooseClassType);

            }
        });
        this.storelist = [];
        this.isShowLoadMore = true;
        this.page_num = 1;
        this.getorderlist(this.classTypes[this.index].type);
    }
    /** 切换订单类型 */
    changeordertype(type) {
        this.ordertypes.forEach((val, index) => {
            val.checked = false;
            if (val.type == type) {
                this.index2 = index;
                val.checked = true;
                this.chooseordertype = type;
                // console.log('dingdanleixing',this.chooseordertype);

            }
        });
        this.storelist = [];
        this.isShowLoadMore = true;
        this.page_num = 1;
        this.getorderlist(this.chooseClassType);
    }
    /**  搜索订单 */
    onInput() {
        this.storelist = [];
        this.isShowLoadMore = true;
        this.page_num = 1;
        this.getorderlist(this.chooseClassType);
    }
    /**  加载更多 */
    loadMore(event) {
        this.page_num++;
        setTimeout(() => {
            this.getorderlist();
            event.target.complete();
        }, 1000);
    }

    /** 售后 */
    afterSale(order_sn, evt) {
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        this.router.navigate(['after-market'], {
            queryParams: {
                order_sn: order_sn,
            }
        });
    }
    /** 联系客服，webSocket */
    contact_customer() {
        const user_id = this.globalData.user.user_id;
        if (user_id) {
            window.location.href = 'http://cloudpf.weunit.cn:9501/demo/index/chat?user_id=' + user_id + '&randmon=' + Math.random();
        } else {
            this.router.navigate(['login']);
        }
    }

    /** 立即付款 */
    gotofacbuy(total_amount, order_sn, order_id, evt) {
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        this.router.navigate(['fac-buy'], {
            queryParams: {
                total_amount: total_amount,
                order_sn: order_sn,
                order_id: order_id,
            }
        });
    }

    /**  更多导航 */
    // async more(myEvent) {
    //     const popover = await this.popoverCtrl.create({
    //         // component: PopoverMainPage,
    //         componentProps: {
    //             navActive: this.navCtrl
    //         },
    //         event: myEvent,
    //         translucent: true,
    //     });
    //     return await popover.present();
    // }
    /** 返回 */
    goback() {
        this.navCtrl.navigateBack('tabs/mine');
        // this.navCtrl.back();
    }
    // 跳转到订单详情页面
    goOrderDetail(storeIndex) {
        this.router.navigate(['order-detail'], {
            queryParams: {
                'order_id': this.storelist[storeIndex].order_id,
                'index': this.index,
                'index2': this.index2,
                // 'is_click': this.chooseClassType == '4' ? (this.now_time > this.storelist[storeIndex].reserve_param.end_time) : false
                'is_click': this.chooseClassType == '4' ? (this.storelist[storeIndex].reserve_param.is_pay == 1 && this.now_time < this.storelist[storeIndex].reserve_param.end_time) || (!this.storelist[storeIndex].reserve_param.is_pay && this.now_time  > this.storelist[storeIndex].reserve_param.end_time) : false,
                'end_time':  this.chooseClassType == '4' && this.storelist[storeIndex].reserve_param.is_pay && this.storelist[storeIndex].order_status == 0 ?  this.storelist[storeIndex].reserve_param.end_time_back : '',
            }
        });
    }

    /**  取消订单 */
    async cancelorder(id, evt) {
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        let alert3 = await this.alertCtrl.create({
            message: '确认取消该订单?',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: '确定',
                    handler: () => {
                        this.native.showLoading();
                        this.api.get('Order/cancel_order', {
                            order_id: id
                        }).subscribe(
                            (res: any) => {
                                // 跟新用户数据
                                this.native.hideLoading();
                                this.storelist = [];
                                this.getorderlist();
                                this.native.showToast(res.msg);
                                console.log(res);
                            },
                            (err) => {
                                this.native.hideLoading();
                                console.log(err);
                            }
                        );
                    }
                }
            ]
        });
        await alert3.present();
    }

    /** 查看物流信息 */
    goLogistics(order_info, evt) {

        // console.log(order_info.order_id);
        // this.api.postFormData('Order/getOrderDeliveryInfo', {
        //     'order_id': order_info.order_id,
        // }).subscribe((res: any) => {
        //     this.modalCtrl.create({
        //         component: ModelBoxComponent,
        //         cssClass: 'conditions',
        //         componentProps: {
        //             info: res.result,
        //             status: res.status
        //         }
        //     }).then(
        //         view => {
        //             view.present();
        //         }
        //     );
        // }, (err) => {
        //     console.log(err);
        // });

        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        let invoice_no = order_info.invoice_no ? order_info.invoice_no : 0;
        if (invoice_no) {
            window.location.href = 'http://m.kuaidi100.com/result.jsp?nu=' + invoice_no;
            // let kuaidi100_url = 'http://m.kuaidi100.com/result.jsp?nu=' + invoice_no;
            // this.gotourl(kuaidi100_url);
        } else {
            this.native.showToastTips('还未发货');
        }
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

    /** 确认收货 */
    async receivingorder(id, evt) {
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        let alert2 = await this.alertCtrl.create({
            header: '确认收货了吗?',
            message: '为了保证您的售后权益,请收到商品检查无误后再确认收货',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: '确定',
                    handler: () => {
                        this.native.showLoading();
                        console.log(id)
                        this.native.showLoading();
                        this.api.postFormData('Order/receiving_order', {
                            order_id: id
                        }).subscribe(
                            (res: any) => {
                                console.log(res)
                                this.native.hideLoading();
                                if (res.status == 1) {
                                    this.isShowLoadMore = true;
                                    this.page_num = 1;
                                    this.storelist = [];
                                    this.getorderlist();
                                    this.native.showToast(res.msg);
                                }
                            },
                            (err) => {
                                console.log(err);
                                this.native.hideLoading();
                            }
                        );
                    }
                }
            ]
        });
        await alert2.present();

    }

    /**  删除订单 */
    async delete_order(order_sn, order_id, evt) {
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        let alert = await this.alertCtrl.create({
            message: '你是否要删除订单：' + order_sn,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: '确定',
                    handler: () => {
                        console.log(order_id)
                        this.native.showLoading();
                        this.api.postFormData('order/delete_order', { 'order_id': order_id }).subscribe(
                            (res: any) => {
                                this.native.hideLoading();
                                if (res.status == 1) {
                                    this.storelist = [];
                                    this.isShowLoadMore = true;
                                    this.page_num = 1;
                                    this.getorderlist();
                                    this.native.showToast(res.msg, 100);
                                } else {
                                    this.native.showToastTips(res.msg, 100);
                                }
                            },
                            (err) => {
                                console.log(err);
                                this.native.hideLoading();
                            }
                        );
                    }
                }
            ]
        });
        await alert.present();
    }

    // 预售订单
    presell() {
        clearInterval(this.set_time);
        this.set_time = setInterval((v) => {
            if (this.now_time < this.end_time) {
                this.is_click = false;

            }
            this.now_time++;
            if (this.now_time > this.end_time) {
                this.is_click = true;
            }
            console.log(this.now_time);

        }, 1000);
    }


}
