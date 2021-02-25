import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Api, NativeService} from 'src/services';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.page.html',
  styleUrls: ['./commission.page.scss'],
})
export class CommissionPage implements OnInit {
    public data: boolean = false; // 保存页面是否有数据状态，true为有数据，false为无数据
    // 保存批发订单选项卡信息，0：所有订单，1：未付款，2：已寄售，3：未寄售，4：已出售，5：已提货
    public segments = [
        {text: '批发寄售利益', isChecked: true, typeId: 1},
        {text: 'O2O寄售利益', isChecked: false, typeId: 2},
        // {'text': '退款', 'isChecked': false, 'typeId': 2},
    ];

    public accountLogData = []; // 批发订单的数据
    public hasData = false;        // 是否有数据
    public typeId = 1; // 1：批发寄售利益，2：O2O寄售利益
    public beginDate;  // 查询起始时间,默认30天前
    public endDate;    // 查询结束时间，默认当天

    public total_amount = 0; // 总金额
    public finish_amount = 0; // 已结算金额
    public incomplete_amount = 0; // 未结算总金额
    public total_bcoin = 0;    // 总易货券

    constructor(
        private router: Router,
        public native: NativeService,
        private api: Api,
    ) {
    }

    ngOnInit() {
    }

    // 初始化页面
    ionViewWillEnter() {
        // 初始化查询结束时间
        const now = new Date();
        const timestamp = new Date(now.getTime() - 15 * 24 * 3600000);
        const beginDateYear = timestamp.getFullYear();
        const beginDateMonth = timestamp.getMonth();
        const beginDateDay = timestamp.getDate();

        this.beginDate = beginDateYear + '-' + beginDateMonth + '-' + beginDateDay;
        this.endDate = new Date();
        this.consignCommission(this.typeId);
    }

    // 请求批发订单分成数据
    consignCommission(typeId) {
        const start = new Date(this.beginDate).getTime();
        const end = new Date(this.endDate).getTime();
        if (start > end) {
            this.native.showToast('起始时间不能大于结束时间!');
            return;
        }
        // 请求参数对象
        const obj = {
            type: typeId,
            start_time: this.formatTime(this.beginDate),
            end_time: this.formatTime(this.endDate),
        };
        this.native.showLoading();
        this.api.postFormData('consign/consignProfit', obj).subscribe((res: any) => {
            this.native.hideLoading();
            if (res.status == 200) {
                this.accountLogData = res.data.account_log;
                this.total_amount = res.data.total_amount;
                this.finish_amount = res.data.finish_amount;
                this.incomplete_amount = res.data.incomplete_amount;
                this.total_bcoin = res.data.total_bcoin;
                if (res.data.account_log.length === 0) {
                    this.hasData = false;
                } else {
                    this.hasData = true;
                }

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
        this.accountLogData = [];
        this.hasData = false;
        for (const item of this.segments) {
            item.isChecked = false;
        }
        this.segments[myIndex].isChecked = true;
        this.typeId = this.segments[myIndex].typeId;
        this.consignCommission(this.typeId);
    }

    // 时间改变
    timeChange() {
        this.accountLogData = [];
        this.consignCommission(this.typeId);
    }

    // 返回上一级页面(tab-my)我的页面
    goback() {
        this.router.navigate(['/tabs/mine']);
    }

    /**
     * 功能：将一个时间对象转换为特定的格式
     * @param time 时间格式对象
     */
    formatTime(time) {
        const Year = new Date(time).getFullYear();
        const Month = new Date(time).getMonth() + 1;
        const Day = new Date(time).getDate();
        return Year + '/' + Month + '/' + Day;
    }
}