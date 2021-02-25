import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Banks } from 'src/services/bank';
import { NativeService } from 'src/services/NativeService';
import { Api } from 'src/services/api';
import { GlobalData } from 'src/services/GlobalData';
import { UploadService } from 'src/services/UploadService';
import { Utils } from 'src/services';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.page.html',
  styleUrls: ['./addcard.page.scss'],
})
export class AddcardPage implements OnInit {
  @ViewChild('imgFile', { static: false }) imgFile: any;
  imgList = [];

  public index = 0; //保存选项卡选中下标
  public token: string = ""; //保存用户token
  public btn_disable: boolean = true; //底部按钮是否可用，默认false为不可用状态
  public bankList = Banks; //银行列表
  public userName = ""; //用户名称
  public imgUrl = '';
  public type = 'creat';
  public title = '';
  public editData: any = '';
  public editId = '';

  // 保存选项卡信息
  public segments = [];
  // 保存银行卡输入数据
  public bank = {
    "bank_name": "",
    "bank_addr": "",
    "user_name": "",
    "account": ""
  };
  // 保存支付宝输入数据
  public alipay = {
    "user_name": "",
    "account": ""
  };
  // 保存支付宝输入数据
  public weixin = {
    "user_name": "",
    "account": ""
  };
  previewImg: any[] = [];
  constructor(
    private router: Router,
    private native: NativeService,
    private Api: Api,
    private _GlobalData: GlobalData,
    public _UploadService: UploadService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,


  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.imgList = [];
      this.type = params.type ? params.type : 'create';
      this.title = this.type == 'edit' ? '编辑' : '新增';
      if (params.edit) {
        this.editData = params.edit ? JSON.parse(params.edit) : ''
        this.index = this.editData.type - 1;
        console.log(this.index);
        this.editId = this.editData.id;

        if (this.index == 0) {
          this.bank.bank_name = this.editData.bank_name;
          this.bank.bank_addr = this.editData.bank_address;
          this.bank.account = this.editData.card;
          this.bank.user_name = this.editData.name;
        } else if (this.index == 1) {
          this.alipay.account = this.editData.card;
          this.alipay.user_name = this.editData.name;
        } else if (this.index == 2) {
          this.weixin.account = this.editData.card;
          this.weixin.user_name = this.editData.name;
        }
        if (this.editData.money_receive_qrcode) {
          this.imgList.push({ value: this.editData.money_receive_qrcode })
        }


        console.log('321123', this.editData);
      }

    });
  }

  ngOnInit() {
  }

  // 获取卡类型
  ionViewWillEnter() {
    this.token = this._GlobalData.token;
    // this.userName = this._GlobalData.user.realname;
    console.log(this._GlobalData.user)
    console.log(this._GlobalData.user.realname)
    console.log(this.userName)
    this.getCard();
  }
  // 初始化页面数据列表
  getCard() {
    this.native.showLoading();
    this.Api.get('bank/index', { "Token": this.token }).subscribe((res: any) => {
      console.log(res)
      this.native.hideLoading();
      if (res.status == 200) {
        this.segments = res.data;
        if (this.segments.length > 0) {
          for (let item of this.segments) {
            item.isChecked = false;
          }
          this.changeSegment(this.index);
        }
      } else {
        this.native.showToastTips(res.msg);
      }
    }, (err) => {
      this.native.hideLoading();
      console.log(err);
    });
  }




  addLoad(e: string) {
    console.log(e);
    this.previewImg.push(e);
    // console.log(this.previewImg);
  }

  clearPreviewImg() {
    this.previewImg = [];
  }

  // 下面全是图片处理
  addImg() {
    if (this.imgList.length >= 1) {
      this.native.showToastTips('最多上传1张图片');
      return;
    }
    this.imgFile.nativeElement.click();
    return;
  }
  deleteImg(idx) {
    this.imgList = []
    // this.Api.get('Useroa/imageDel', { imgUrl: encodeURIComponent(this.imgList[idx].value) }).subscribe((res: any) => {
    // }, (err) => { });
    // this._UploadService.clearongimgobj(this.imgList[idx].id);
    // this.imgList.splice(idx, 1);
  }
  changeImg(evn) {
    console.log(evn);
    if (!evn.target.files[0]) {
      return false;
    }
    const Alias = Utils.uuid();
    const file = evn.target.files[0];
    const imgUrl = window.URL.createObjectURL(file);
    const sanitizerUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
    this.setImgUrl(Alias, sanitizerUrl);
    this._UploadService.fileCheck(evn.target.files[0]).then(async (res: any) => {
      if (res.status === 1) {
        await this.native.showLoading();
        this._UploadService.NewUploadImgObj = { filename: Alias, file: res.res };
        this.uploadImg();
      }
    });
  }
  uploadImg() {
    if (this._UploadService.UploadImgObj.length > 0) {
      this._UploadService.UploadImgObj.forEach((val, idx) => {
        val.file.onSuccessItem = (fitem, response, status, headers) => {
          // 上传文件成功
          if (status === 200) {
            // 上传文件后获取服务器返回的数据
            // tslint:disable-next-line:prefer-const
            let tempRes = JSON.parse(response);
            console.log(tempRes);
            this.imgUrl = tempRes.data
            if (tempRes.state > 0) {
              this.setImgUrl(tempRes.filename, tempRes.url);
              this._UploadService.clearongimgobj(tempRes.filename);
            } else {
              // alert(tempRes.msg);
            }
          } else {
            // 上传文件后获取服务器返回的数据错误
            alert('上传失败，服务器出错！');
          }
        };
        val.file.uploadAll();
        this.native.hideLoading();
      });
    } else {
      return false;
    }
  }
  setImgUrl(filename, url) {
    // console.log('321',this.imgList);
    let ishave = false;
    this.imgList.forEach((val, idx) => {
      if (val.id === filename) {
        val.value = url;
        ishave = true;
      }
    });
    if (!ishave) {
      this.imgList.push({ id: filename, value: url });
    }
  }




  // 点击确认按钮
  confirm() {
    this.native.showLoading();
    let obj = {
      "type": "",
      "bank_name": "",
      "bank_address": "",
      "name": "",
      "card": ""
    };

    // let imgs = '';
    // console.log('this.imgList', this.imgList);
    // console.log('this.previewImg', this.previewImg);
    // // return
    // this.imgList.forEach((v) => {
    //   imgs += v.value + ',';
    // });
    // obj['imgs'] = imgs;
    obj['money_receive_qrcode'] = this.imgUrl;

    obj.type = this.segments[this.index].type_id;
    if (this.index == 0) {
      obj.bank_name = this.bank.bank_name;
      obj.bank_address = this.bank.bank_addr;
      obj.card = this.bank.account;
      obj.name = this.bank.user_name;
    } else if (this.index == 1) {
      obj.card = this.alipay.account;
      obj.name = this.alipay.user_name;
    } else if (this.index == 2) {
      obj.card = this.weixin.account;
      obj.name = this.weixin.user_name;
    }

    if (this.type == 'edit') {
      obj['id'] = this.editId;
      this.Api.postFormData('bank/update', obj).subscribe((res: any) => {
        this.native.hideLoading();
        if (res.status == 200) {
          this.native.showToast("修改成功！");
          this.router.navigate(["bankcard"]);
        } else {
          this.native.showToast(res.msg);
        }
      }, (err) => {
        this.native.hideLoading();
        console.log(err);
      });

    } else {
      this.Api.postFormData('bank/store', obj).subscribe((res: any) => {
        this.native.hideLoading();
        if (res.status == 200) {
          this.native.showToast("添加成功！");
          this.router.navigate(["bankcard"]);
        } else {
          this.native.showToast(res.msg);
        }
      }, (err) => {
        this.native.hideLoading();
        console.log(err);
      });
    }

  }
  // 检测任意输入框变化
  checkVal() {
    if (this.userName) {
      this.alipay.user_name = this.userName;
      this.weixin.user_name = this.userName;
    }
    if (this.index == 0) {
      for (let key in this.bank) {
        if (!this.bank[key]) {
          this.btn_disable = true;
          return;
        }
      }
      this.btn_disable = false;
    }
    if (this.index == 1) {
      for (let key in this.alipay) {
        if (!this.alipay[key]) {
          this.btn_disable = true;
          return;
        }
      }
      this.btn_disable = false;
    }
    if (this.index == 2) {
      for (let key in this.weixin) {
        if (!this.weixin[key]) {
          this.btn_disable = true;
          return;
        }
      }
      this.btn_disable = false;
    }
  }
  // 切换选项卡 
  changeSegment(myIndex) {
    this.index = myIndex;
    for (let item of this.segments) {
      item.isChecked = false;
    }
    this.segments[myIndex].isChecked = true;
    this.checkVal();
  }
  // 返回上一级页面(bankcard)
  goback() {
    this.router.navigate(["bankcard"]);
  }
}
