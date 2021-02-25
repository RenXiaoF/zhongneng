import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api, NativeService, User } from 'src/services';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-all-order',
    templateUrl: './consign.page.html',
    styleUrls: ['./consign.page.scss'],
})
export class ConsignPage implements OnInit {
    public data: boolean = true; // 保存页面是否有数据状态，true为有数据，false为无数据
    public isShowLoading: boolean = true;//监听是否显示加载区域，默认显示
    public confirmText; // 操作去寄售和提货的提示文件
    // 保存批发订单选项卡信息，0：所有订单，1：未付款，2：已寄售，3：未寄售，4：已出售，5：已提货
    public segments = [
        { "text": "全部订单", "isChecked": true, "typeId": 0 },
        { "text": "待付款", "isChecked": false, "typeId": 1 },
        { "text": "寄售中", "isChecked": false, "typeId": 2 },
        { "text": "已完结", "isChecked": false, "typeId": 4 },
        { "text": "全部提货", "isChecked": false, "typeId": 5 },
    ];

    public consignOrderData = []; // 批发订单的数据
    public typeId = 0; // 全部订单类型
    public currentPage = 1; // 当前页数
    public lastPage = 0; // 最后页码数

    constructor(
        private router: Router,
        public native: NativeService,
        private api: Api,
        private alertCtrl: AlertController,
        private user: User,
        private ActivatedRoute: ActivatedRoute,
    ) {
        this.ActivatedRoute.queryParams.subscribe((params: Params) => {
            // console.log('params',params);
            if (params.type) {
                this.typeId = params.type;
            } else {
                this.typeId = 0;
            }
        });
    }

    ngOnInit() {
    }

    // 初始化页面
    ionViewWillEnter() {
        this.consignOrderData = [];
        this.data = true;
        this.isShowLoading = true;
        this.currentPage = 1; // 当前页数
        this.lastPage = 0; // 最后页码数
        this.consignOrder(this.typeId);
        // this.changeSegment(0)
    }
    /** 请求批发订单数据 */
    consignOrder(typeId) {
        this.isShowLoading = true;
        this.native.showLoading();
        this.api.postFormData('consign/index', { "type": typeId, 'page': this.currentPage }).subscribe(
            (res: any) => {
                console.log('请求批发订单数据-res:', res);
                this.native.hideLoading();
                if (res.status == 200) {
                    this.lastPage = res.data.last_page;
                    this.currentPage = res.data.current_page;
                    if (res.data.data.length > 0) {
                        for (let item of res.data.data) {
                            this.consignOrderData.push(item);
                        }
                        console.log('请求批发订单数据--data:', this.consignOrderData);

                    } else {
                        this.native.showToast('没有更多数据了！');
                        this.isShowLoading = false;
                    }
                    if (this.consignOrderData.length > 0) {
                        this.data = true;
                    } else {
                        this.data = false;
                    }
                    console.log('请求批发订单数据>0', this.consignOrderData);
                } else {
                    this.native.showToastTips(res.msg);
                }
            }, (err) => {
                this.native.hideLoading();
                console.log(err);
            });
    }
    // 分类选项卡切换
    changeSegment(myIndex) {
        this.isShowLoading = true;
        for (let item of this.segments) {
            item.isChecked = false;
        }
        this.segments[myIndex].isChecked = true;
        this.typeId = this.segments[myIndex].typeId;
        // 清空数据
        this.consignOrderData = [];
        this.currentPage = 1;
        this.lastPage = 0;
        this.consignOrder(this.typeId);
    }
    // 返回上一级页面(tab-my)我的页面
    goback() {
        this.router.navigate(["/tabs/mine"]);
    }
    // 批发订单的操作
    handleConsignOrder(item, typeId, index = 0) {
        // console.log(item);
        let total_amount = item.order_goods[0].goods_price * item.order_goods[0].goods_num;
        let order_sn = item.order_sn;
        let order_id = item.order_id;
        if (typeId === '1') { // 跳支付页面
            this.router.navigate(['fac-buy'], {
                queryParams: {
                    total_amount: total_amount,
                    order_sn: order_sn,
                    order_id: order_id,
                    type: 1  //批发区商品
                }
            });
        } else if (typeId === '4') { // boss订单明细
            this.router.navigate(['boss-detail'], {
                queryParams: {
                    order_id: order_id,
                    type_id: this.typeId
                }
            });
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
    // 处理去寄售或去提货
    async confirmConsignOrderStatus(index, orderId, typeId) {
        this.confirmText = (index == 1) ? '确认寄售' : '确认提货';
        const confirm = await this.alertCtrl.create({
            header: this.confirmText,
            subHeader: '',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        return true;
                    }
                },
                {
                    text: '是的',
                    handler: () => {
                        this.user.updateUser()
                        this.handleConsignOrderStatus(index, orderId, typeId);
                    }
                }
            ]
        });
        await confirm.present();
    }
    // 处理去寄售或去提货
    handleConsignOrderStatus(index, orderId, typeId) {
        this.native.showLoading();
        this.api.postFormData('consign/handleConsign', { 'type': index, 'order_id': orderId })
            .subscribe((res: any) => {
                this.native.hideLoading();
                if (res.status == 200) {
                    this.user.updateUser();
                    this.consignOrderData = [];
                    this.currentPage = 1;
                    this.lastPage = 0;
                    this.consignOrder(this.typeId);
                } else {
                    this.native.showToastTips(res.msg);
                }
            }, (err) => {
                this.native.hideLoading();
                console.log(err);
            });
    }
    // 取消订单
    cancelorder(id) {
        this.native.showLoading();
        this.api.get("Order/cancel_order", { order_id: id }).subscribe(
            (res: any) => {
                this.native.hideLoading();
                this.user.updateUser();
                this.consignOrderData = [];
                this.currentPage = 1;
                this.lastPage = 0;
                this.consignOrder(this.typeId);
                // this.native.showToast(res.msg);
            },
            (err) => {
                this.native.hideLoading();
                console.log(err);
            }
        );
    }
    // 删除取消的订单
    deleteOrder(id) {
        this.api.get("Order/delete_order", { order_id: id }).subscribe(
            (res: any) => {
                this.native.hideLoading();
                // this.native.showToast(res.msg);
                this.consignOrder(this.typeId);
            },
            (err) => {
                this.native.hideLoading();
                console.log(err);
            }
        );
    }
    // 刷新数据
    doRefresh(event) {
        setTimeout(() => {
            this.consignOrderData = [];
            this.currentPage = 1;
            this.lastPage = 0;
            this.consignOrder(this.typeId);
            event.target.complete();
        }, 1000);
    }
    // 加载更多
    loadData(event) {
        setTimeout(() => {
            if (Number(this.currentPage) < Number(this.lastPage)) {
                this.currentPage = Number(this.currentPage) + 1;
                this.consignOrder(this.typeId);
            } else {
                this.native.showToast("没有更多数据了！");
                this.isShowLoading = false;
            }
            event.target.complete();
        }, 1000);
    }
}