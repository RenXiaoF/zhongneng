import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UploadService } from 'src/services/UploadService';
import { DomSanitizer } from '@angular/platform-browser';
import { Utils, Api, NativeService } from 'src/services';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-after-sale-process',
  templateUrl: './after-sale-process.page.html',
  styleUrls: ['./after-sale-process.page.scss'],
})
export class AfterSaleProcessPage implements OnInit {
  @ViewChild('imgFile', {static:false}) imgFile: any;
  imgList = [];
  id: any;
  return_goods_data: any;
  code: any;

    constructor(
        public navCtrl: NavController,
        // public navParams: NavParams,
        public _UploadService: UploadService,
        private sanitizer: DomSanitizer,
        public api: Api,
        public router: Router,
        public native: NativeService,
        public activeRoute: ActivatedRoute
    ) {
        this.activeRoute.queryParams.subscribe((params: Params) => {
            this.id = params['id'];
        });
    }

  ngOnInit() {
        this.returnGoodsInfo();
  }

    // 申请售后
    returnGoodsInfo() {
        this.api.postFormData('AfterSale/returnGoodsInfo', {id: this.id}).subscribe(
            (res: any) => {
                if (res.status == 200) {
                    this.return_goods_data = res.data;
                } else {
                    this.native.showToastTips(res.msg);
                }
            }, (err) => {
                console.log(err);
            }
        );
    }

    sendCode() {
        this.api.postFormData('AfterSale/sendCode', {code: this.code, id: this.return_goods_data.id}).subscribe(
            (res: any) => {
                if (res.status == 200) {
                    this.router.navigate(['myconsumeorder']);
                } else {
                    this.native.showToastTips(res.msg);
                }
            }, (err) => {
                console.log(err);
            }
        );
    }

  goback() {
    this.navCtrl.back();
  }

}
