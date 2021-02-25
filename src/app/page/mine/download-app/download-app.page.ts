/*
 * @Description: 
 * @Author: liutq
 * @Date: 2020-10-20 09:25:50
 * @LastEditTime: 2020-11-26 17:53:42
 * @LastEditors: liutq
 * @Reference: 
 */
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Utils } from 'src/services/Utils';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.page.html',
  styleUrls: ['./download-app.page.scss'],
})
export class DownloadAppPage implements OnInit {
  //保存下载地址、下载的二维码
  public download = {
    // "url":"http://mall.rossai.cn/app_download/app-debug.apk",
    "url":"http://qiniu.zhonglianxf.com/zn1105.apk",
    "url_image":"assets/Qrdown.png"
  };  

  constructor(
    private router: Router,
  ) { 
  }

  ngOnInit() {
  }

  // 页面初始化
  ionViewWillEnter() {
    // this.download = Utils.localStorageGetItem("versionInfo");
    console.log(this.download)
  }

  // 返回上一级页面(tabs/mine)
  goback(){
    this.router.navigate(["/tabs/mine"]);
  }

}
