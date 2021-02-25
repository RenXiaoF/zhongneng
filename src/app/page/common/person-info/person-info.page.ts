import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Api, GlobalData, Utils, NativeService } from 'src/services';
import { UploadService } from 'src/services/UploadService';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { SelAreaPage } from '../../mine/sel-area/sel-area.page';

@Component({
  selector: 'app-person-info',
  templateUrl: './person-info.page.html',
  styleUrls: ['./person-info.page.scss'],
})
export class PersonInfoPage implements OnInit {
  @ViewChild('imgFile', { static: false }) imgFile: any;
  imgList: any[] = [];
  previewImg: any[] = [];
  imgUrl = '';
  chooseStr = '';
  ifdisabled = false;
  chooseAdd = '';
  chooseValue = {
    'provinceValue': '',
    'cityValue': '',
    'districtValue': ''
  };
  userInit: any;

  public user: any = {
    'head_pic': "",
    'nickname': "",
    'sex': '0',
    'address': "",
    'birthday': "",
  }

  constructor(
    private router: Router,
    private api: Api,
    private globalData: GlobalData,
    public _UploadService: UploadService,
    private sanitizer: DomSanitizer,
    private native: NativeService,
    public modalCtrl: ModalController,

  ) {
    this.userInit = this.globalData.user;

    console.log(this.userInit);


    // 初始化查询结束时间
    let now: any = new Date();
    let beginDateYear = now.getFullYear();
    let beginDateMonth = now.getMonth() + 1;
    let beginDateDay = now.getDate();
    if (beginDateDay <= 0) {
      beginDateDay = 1;
    }
    this.user.birthday = beginDateYear + "/" + beginDateMonth + "/" + beginDateDay;
    this.imgList = [];
    if (this.userInit.head_pic) {
      this.imgList.push({ value: this.userInit.head_pic })
    }
    this.user.birthday = this.userInit.birthday ? this.format(this.userInit.birthday*1000) : '';
    this.user.head_pic = this.userInit.head_pic;
    this.user.address = this.userInit.address;

    this.user.nickname = this.userInit.nickname;
    this.user.sex = String(this.userInit.sex);
    this.chooseAdd = this.userInit.address_name;

    console.log(this.user, this.userInit.head_pic);


  }


  ngOnInit() {
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
        this._UploadService.HeadPicImgObj = { filename: Alias, file: res.res };
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




  updateUser() {

  }

  async chooseAddress() {
    this.ifdisabled = true;
    const modal = await this.modalCtrl.create({
      component: SelAreaPage,
      componentProps: { chooseValue: this.chooseStr }
    });
    await modal.present();
    await modal.onDidDismiss().then((e) => {
      this.ifdisabled = false;
      if (e['data']) {
        this.chooseAdd = e['data']['addressStr'];
        this.chooseValue = e['data']['addressValue'];
        this.chooseStr = e['data']['addressFullStr'];
      }



    });
  }

  // 时间改变
  timeChange() {
    // console.log(this.user);
  }

  submit() {
    // console.log(this.chooseValue);

    let now = new Date(String(this.user.birthday))
    this.user.address = JSON.stringify(this.chooseValue) !=='{}' ? this.chooseValue.cityValue + ',' + this.chooseValue.districtValue + ',' + this.chooseValue.provinceValue :this.user.address;
    // console.log(this.user.address);
    
    this.user.birthday = now.getTime() / 1000;
    this.user.head_pic = this.imgUrl ? this.imgUrl : this.imgList[0].value;

    this.api.postFormData('user/updateUser', this.user).subscribe((res: any) => {
      console.log(res);
      if (res.status == 1) {
        this.native.showToast(res.msg);
        this.goback();
      } else {
        this.native.showToast(res.msg);
      }

    })

  }

  goback() {
    this.router.navigate(["/tabs/mine"]);

  }

  add0(m){return m<10?'0'+m:m }
  format(shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + this.add0(m) + '-' + this.add0(d)
  }
}
