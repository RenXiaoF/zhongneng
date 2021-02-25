import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ModalController } from '@ionic/angular';
import { Api, NativeService, Utils } from 'src/services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NewaddressPage } from '../mine/newaddress/newaddress.page';
// import { PopoverOnePage } from '../popover-one/popover-one.page';
import { error } from 'selenium-webdriver';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
    public totalprice = '0'; // 总价
    public num = 0; // 商品总数
    public ifmanage = false; // 管理或结算
    public ifall = false;
    public storelist = [];
    public order_type = '0'; // 购物车订单的类型，0：普通商品，1：boss批发区商品，2：零元区商品，3：福利区商品，4：易货区商品
    // 保存购物车选项卡信息
    public segments = [
        { "text": "普通商品", "isChecked": true },
        { "text": "boss批发", "isChecked": false },
    ];

    btn_status = false

    /** 构造器 */
    constructor(
        public navCtrl: NavController,
        // public navParams: NavParams,
        public api: Api,
        public native: NativeService,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.order_type = params.type ? params.type : '0';
        });
    }

    /** 初始化 */
    ngOnInit() { }

    /** 每次进入页面时  加载 */
    ionViewWillEnter() {
        this.getcartlist();
    }

    // 分类选项卡切换
    changeSegment(myIndex) {
        // this.index = myIndex;
        for (let item of this.segments) {
            item.isChecked = false;
        }
        this.segments[myIndex].isChecked = true;
        this.order_type = (myIndex==1) ? '1' : '0';
        this.getcartlist();
    }

    /** 计算总价和总数量 */
    calcuprice() {
        let total: any = 0; // 总价
        let num: any = 0; // 总数量
        this.storelist.forEach(val => {
            val.cartList.forEach(cval => {
                if (cval.selected) {
                    total = Utils.accAdd(total, Utils.accMul(cval.goods_price, cval.goods_num));
                    num = Utils.accAdd(num, cval.goods_num);
                }
            });
        });
        if (total.toString().indexOf('.') < 0) {
            total += '.00';
        } else {
            total += '00';
        }
        // console.log(total);
        total = total.toString().substring(0, total.toString().indexOf('.') + 3);
        // console.log(total);
        this.totalprice = total;
        this.num = num;
    }

    /** 测试 用不上 */
    // changeTotlePrice(e){
    //     let totlePrice = e.detail.value;
    //     console.log('输入的总价：', typeof(totlePrice));
    //     if(totlePrice == 3572.50){

    //         this.storelist.forEach(val => {
    //             val.cartList.forEach(cval => {
    //                     // cval.goods_num = Utils.accAdd((cval.goods_num + 1), 0);
    //                     cval.goods_num = 1;
    //             });
    //         });
    //     }
    //     if(totlePrice == 7144){

    //         this.storelist.forEach(val => {
    //             val.cartList.forEach(cval => {
    //                     // cval.goods_num = Utils.accAdd((cval.goods_num + 1), 0);
    //                     cval.goods_num = 2;
    //             });
    //         });
    //     }
    // }

    /** 切换 管理/结算 */
    managecart() {
        this.ifmanage = !this.ifmanage;
    }

    /** 删除单个商品 */
    deletecart() {
        // console.log('deletecart');
        let ids = [];
        this.storelist.forEach(val => {
            val.cartList.forEach(cval => {
                if (cval.selected) {
                    ids.push(cval.id);
                }
            });
        });
        this.api.postFormData('Cart/ajaxDelCart', { 'ids': ids }).subscribe((res: any) => {
            // console.log(res);
            if (res.status == 1) {
                this.getcartlist();
            } else {
                this.native.showToastTips(res.msg);
            }
        }, (err) => {
            this.native.showToastTips('网络错误');
        })

        this.calcuprice();
    }

    /** 获取购物车列表 */
    getcartlist() {
        this.api.postFormData('Cart/ajaxCartList', {order_type: this.order_type}).subscribe((res: any) => {
            // this.api.postFormData('Address/ajaxCartList').subscribe((res: any) => {
            if (res.status == 1) {
                this.storelist = res.result.storeList;
                let selectnum = 0;
                this.storelist.forEach(val => {
                    if (val.select_all == 1) {
                        selectnum += 1;
                    }
                })
                if (selectnum == this.storelist.length) {
                    this.ifall = true;
                }
                this.calcuprice();
            } else if (res.status == -99) {
                this.native.showToastTips(res.msg);
                this.router.navigate(['login']);
            } else {
                this.storelist = [];
            }
        }, (err) => {
            console.log(err);
        })
    }

    /** 切换店铺的 已选/未选 */
    cgstorecheck(index: number, event: any) {
        console.log(event);
        // store.cartList.forEach(val=>{
        //   val.selected = evt.value;
        // })
        // this.calcuprice();
        /**
         * 购物车商品列表 _copy
         */
        let storeList_copy = Object.assign([], this.storelist);
        console.log('选中状态为%o', storeList_copy[index].select_all);
        /**
         * 将对应index的店铺商品选中状态改为 店铺全选按钮的选中状态
         */
        if ((storeList_copy[index] as any).hasOwnProperty('cartList')) {
            storeList_copy[index].cartList = (storeList_copy[index]['cartList'] as Array<any>).map(value => {
                value.selected = event.target.checked;
                return value
            });
            // 引用传递，重新赋值。强制渲染dom
            this.storelist = storeList_copy;

            console.log(storeList_copy[index])
        } else {
            throw new Error('can not find "cartList" from store data of cartList[' + index + ']')
        }


    }
    /** 切换店铺的 已选/未选 */
    clickcgstorecheck(select_all, store) {
        store.cartList.forEach(val => {
            val.selected = !select_all;
        });
        this.calcuprice();
    }

    /** 切换单个商品的 已选/未选 */
    cgcartcheck(evt, cart_id, myIndex) {
        // console.log(evt);
        // console.log(evt.detail.checked);
        // console.log('cart_id_' + cart_id);
        let isSelected;
        // 根据target判断用户点击的地方
        if (evt.target.checked === true || evt.target.checked === false) {
            // 用户点击多选框(checkbox)
            isSelected = evt.target.checked;
        } else {
            // 用户点击除多选框其他地方(checkbox)
            this.storelist[myIndex].selected = !this.storelist[myIndex].selected;
            isSelected = this.storelist[myIndex].selected;
        }
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        this.api.postFormData('Cart/modifyCartGoodsStatus', {
            'op_type': 0,
            'cart_id': cart_id,
            // 'cart_select': evt.value ? 1 : 0,
            'cart_select': evt.detail.checked ? 1 : 0,
        }).subscribe((res: any) => {
            if (res.status == 1) {
                // console.log(this.storelist);

                let storeselect = 0;//已选店铺数量
                this.storelist.forEach(val => {
                    let cartselect = 0;//单个店铺被选商品数量
                    val.cartList.forEach(cval => {
                        if (cval.selected) {
                            cartselect++;
                        }
                    })
                    if (val.cartList.length == cartselect) {
                        val.select_all = true;//单个店铺被选
                        storeselect++;
                    } else {
                        val.select_all = false;//单个店铺没被选
                    }
                    // console.log('cartselect_'+cartselect);//1 1
                })

                //切换全选
                if (this.storelist.length == storeselect) {
                    this.ifall = true;
                } else {
                    this.ifall = false;
                }
                // console.log('storeselect_'+storeselect);//


                this.calcuprice();
            } else {
                console.log(res.msg);
            }
        }, (err) => {
            console.log(err);
        })
    }

    /** 改变商品数量(编辑) */
    modifycartgoods(evt, cart_id) {

        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        if (!/^[1-9]\d*$/.test(evt.detail.value)) {
            this.native.showToastTips('输入正整数');
            return false;
        }

        this.storelist.forEach(val => {
            val.cartList.forEach(cval => {
                if (cval.id == cart_id) {
                    cval.goods_num = evt.detail.value;
                }
            });
        });

        this.api.postFormData('Cart/modifyCartGoods',
            { 'cart_id': cart_id, 'goods_num': evt.detail.value }
        ).subscribe((res: any) => {
            if (res.status == 1) {
                this.calcuprice();
            }
        }, (err) => {
            console.log(err);
        });
    }

    //改变商品数量(+-)
    changenum(evt, step, cart_id) {
        // 阻止事件冒泡
        if (evt.preventDefault) {
            evt.stopPropagation();
        }
        this.num = 0;
        this.storelist.forEach(val => {
            val.cartList.forEach(cval => {
                if (cval.id == cart_id) {
                    // console.log(Utils.accAdd(cval.goods_num,step));
                    if (Utils.accAdd(cval.goods_num, step) < 1) {
                        this.native.showToastTips('不能小于1');
                    } else {
                        cval.goods_num = Utils.accAdd(cval.goods_num, step);
                    }
                }
                this.num += Number(cval.goods_num);
            });
        });
    }



    /** 全选 */
    changeall(evt) {
        // console.log(evt);
        // this.storelist.forEach(val=>{
        //   val.select_all=evt.value;
        //   val.cartList.forEach(cval=>{
        //     cval.selected=evt.value;
        //   })
        // })
    }
    /** 全选 */
    clickchangeall(ifall) {
        let localIfall = (ifall == true ? false : true);
        // console.log(ifall);
        this.storelist.forEach(val => {
            val.select_all = localIfall;
            val.cartList.forEach(cval => {
                cval.selected = localIfall;
            });
        });
    }
    /** 去结算 */
    submit() {
        // console.log('submit');
        this.btn_status = true
        this.api.postFormData('Address/ajaxAddress').subscribe(async (res: any) => {
            console.log(res);
            if (res.status == 1) {
                if (Number(this.num) === 0) {
                    this.native.showToast('请选择商品!');
                    this.btn_status = false
                    return;
                }
                if(this.btn_status){
                    this.router.navigate(['fill-order']);
                    this.btn_status = false

                }
            } else if (res.status == -1) {
                this.native.showToastTips('请先设置地址！');
                const modal = await this.modalCtrl.create({
                    component: NewaddressPage,
                });
                await modal.present();
                await modal.onDidDismiss().then(() => {
                    this.btn_status = false
                });
                const { data } = await modal.onDidDismiss();
                if (data) {
                    this.router.navigate(['fill-order']);
                }
                

            } else {

            }
        }, (err) => {
            console.log(err);
            this.native.showToastTips('数据异常！');

        });

    }

    // more(myEvent) {
    //     let popover = this.popoverCtrl.create({
    //         component: PopoverOnePage,
    //         componentProps: {
    //             ev: myEvent,
    //             navActive: this.navCtrl
    //         }
    //     })
    // }

    gotostore(store_id) {
        this.router.navigate(['product'], {
            queryParams: {
                storeId: store_id
            }
        })
    }

    goback() {
        this.navCtrl.back();
    }

    gopege() {
        this.navCtrl.navigateRoot(['/']);
    }

}
