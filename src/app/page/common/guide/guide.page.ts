import { Component, OnInit } from '@angular/core';
import { Utils, User, Api } from 'src/services';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
})
export class GuidePage implements OnInit {
  public isShowCommission: boolean = true;
  public isShowMask: boolean = false;
  //保存下载地址、下载的二维码
  // public download = {
  //   // "url": "http://mall.rossai.cn/app_download/app-debug.apk",
  //   "url": "http://qiniu.zhonglianxf.com/zn1105.apk",
  //   // "url": Utils.localStorageGetItem('appUrl'),
  // };

  public url: string = Utils.localStorageGetItem('appUrl') ? Utils.localStorageGetItem('appUrl') : "http://qiniu.zhonglianxf.com/zn1105.apk";
  // public url:string = "http://qiniu.zhonglianxf.com/zn1105.apk";
  imgUrl = ''

  constructor(
    private router: Router,
    private user: User,
    public api: Api,
    public activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.imgUrl = params.is_download == 1 ? 'assets/guide.jpg' : 'assets/downloadqr.jpg'
    })
    this.isShowCommission = (Utils.localStorageGetItem('entryType') == 'weixin') ? false : true;

  }


  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getVersion()
  }

  /** 获取线上最新的版本号 */
  getVersion() {
    this.api.get('User/getAppVersion').subscribe(
      (res: any) => {
        if (res.status == 200) {
          Utils.localStorageSetItem('appUrl', res.data.url['0'])
          this.url = Utils.localStorageGetItem('appUrl')
        }
      },
      err => {
        console.error('ERROR', err);
      }
    );
  }



  /* 跳转到我的粉丝(myfans)页面 */
  downloadApp() {
    if (this.isShowCommission) {
      this.user.downloadFile(this.url, '众能优选')
    } else {
      this.openMask();
    }
  }
  /** 打开分享 */
  openMask() {
    this.isShowMask = true;
  }
  /** 关闭分享 */
  closeMask() {
    this.isShowMask = false;
  }

  /* 下载 */
  // downloadFile(url, filename) {
  //   if (!url) return
  //   let link = document.createElement('a') //创建a标签
  //   link.style.display = 'none'  //使其隐藏
  //   link.href = url //赋予文件下载地址
  //   link.setAttribute('download', filename) //设置下载属性 以及文件名
  //   document.body.appendChild(link) //a标签插至页面中
  //   link.click() //强制触发a标签事件
  //   document.body.removeChild(link);
  // }
  goback() {
    this.router.navigate(["/tabs/mine"]);
  }

}
