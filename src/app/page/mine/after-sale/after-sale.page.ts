import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UploadService } from 'src/services/UploadService';
// import { DomSanitizer } from '@angular/platform-browser';
import { Utils, NativeService, Api } from 'src/services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-after-sale',
  templateUrl: './after-sale.page.html',
  styleUrls: ['./after-sale.page.scss'],
})
export class AfterSalePage implements OnInit {
  @ViewChild('imgFile', { static: false }) imgFile: any;
  imgList = [];
  status_desc: any;

  apply_data = {
    type: 1, // 1退款，2退货退款
    goods_num: 0,
    reason: '',
    describe: '',
    mobile: '',
    order_id: '',
    order_sn: '',
    goods_id: '',
    spec_key: '',
    rec_id: '',
    imgs: ''
  };

  public max_goods_num: number = 0; // 最大退货数量

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
      this.apply_data.rec_id = params['rec_id'];
      this.apply_data.order_id = params['order_id'];
      this.apply_data.order_sn = params['order_sn'];
      this.apply_data.goods_id = params['goods_id'];
      this.apply_data.spec_key = params['spec_key'];
      this.apply_data.goods_num = params['goods_num'];
      this.max_goods_num = params['goods_num'];
      this.status_desc = params['status_desc'];

    });
  }

  ngOnInit() {
  }

  /**  申请售后 */
  applyAftersale() {
    this.apply_data.type = (this.status_desc === '待发货') ? 1 : 2;
    let imgs = '';
    this.imgList.forEach((v) => {
      imgs += v.value + ',';
    });
    this.apply_data.imgs = imgs;

    this.api.postFormData('AfterSale/applyAftermarket', this.apply_data).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.router.navigate(['myconsumeorder'], { queryParams: { index: 0 } });
        } else {
          this.native.showToastTips(res.msg);
        }
      }, (err) => {
        console.log(err);
      }
    );
  }
  /** 添加图片 */
  addImg() {
    this.imgFile.nativeElement.click();
    // console.log(this.imgFile.nativeElement);
    // this.uploadImg();
    return;
  }
  /** 删除图片 */
  deleteImg(id) {
    this.imgList.forEach((val, idx) => {
      if (val.id == id) {
        this.imgList.splice(idx, 1);
      }
    });
    this._UploadService.clearongimgobj(id);
  }
  /** 更换 图片 */
  changeImg(evn) {
    console.log(evn.target.files);
    if (!evn.target.files[0]) {
      return false;
    }
    let Alias = Utils.uuid();
    // this._UploadService.NewUploadImgObj = {filename: Alias, file: evn.target.files};

    // tslint:disable-next-line:prefer-const
    let file = evn.target.files[0];
    // tslint:disable-next-line:prefer-const
    let imgUrl = window.URL.createObjectURL(file);
    // tslint:disable-next-line:prefer-const
    let sanitizerUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
    this.setImgUrl(Alias, sanitizerUrl);
    this._UploadService.fileCheck(evn.target.files[0]).then((res: any) => {
      // console.log(res);
      if (res.status > 0) {
        this._UploadService.NewUploadImgObj = { filename: Alias, file: res.res };
        // this._UploadService.dataURLtoImage(res.res).then((res: any) => {
        //   console.log(res);
        // });
      }
    });
    // this.data.img = sanitizerUrl;
  }
  /** 提交售后  */
  uploadImg() {
    if (this.apply_data.goods_num <= 0) {
      this.native.showToast('申请数量需要大于0！');
      return;
    }
    if (this.apply_data.goods_num > this.max_goods_num) {
      this.native.showToast('申请数量不能超过' + this.max_goods_num + '！');
      return;
    }
    // 上传图片
    if (this._UploadService.UploadImgObj.length > 0) {
      this._UploadService.UploadImgObj.forEach((val, idx) => {
        val.file.onSuccessItem = (fitem, response, status, headers) => {
          // 上传文件成功
          if (status == 200) {
            // 上传文件后获取服务器返回的数据
            // tslint:disable-next-line:prefer-const
            let tempRes = JSON.parse(response);
            console.log(tempRes);
            if (tempRes.state > 0) {
              this.setImgUrl(tempRes.filename, tempRes.url);
              this._UploadService.clearongimgobj(tempRes.filename);
            } else {
              alert(tempRes.msg);
            }
          } else {
            alert('上传失败，服务器出错！');
          }
        };
        val.file.uploadAll();
      });
    }

    let count = 0;
    let set_time = setInterval((v) => {
      if (this._UploadService.UploadImgObj.length == 0) {
        this.applyAftersale();
        clearInterval(set_time);
      }
      count++;
      if (count > 500) {
        clearInterval(set_time);
      }
    }, 100);
  }
  /** 设置 图片 的 Url */
  setImgUrl(filename, url) {
    let ishave = false;
    this.imgList.forEach((val, idx) => {
      if (val.id == filename) {
        val.value = url;
        ishave = true;
      }
    });
    if (!ishave) {
      this.imgList.push({ id: filename, value: url });
    }
  }
  /** 返回上一级 */
  goback() {
    history.go(-1);
  }

}
