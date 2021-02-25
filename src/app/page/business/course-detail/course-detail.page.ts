import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api, NativeService, Utils } from 'src/services';
import { NavController } from '@ionic/angular';
import { FILE_ONLINE_SERVE_URL } from 'src/services/Constants';
import { DomSanitizer } from '@angular/platform-browser';
// import { Plugins } from 'protractor/built/plugins';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file/ngx';
// import { Clipboard } from '@ionic-native/clipboard/ngx';

// import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.page.html',
  styleUrls: ['./course-detail.page.scss'],
})
export class CourseDetailPage implements OnInit {
  public qiniuUrl = FILE_ONLINE_SERVE_URL;  // 七牛的链接头部
  public id = '';  // 上一页产过来的 id
  public audio = ''; // 音频文件
  public video = ''; // 视频文件
  public url = '';  // 图片文件
  public pdf; // ppt  pdf world excel 信任后的url
  public pdf2; //  ppt  pdf world excel 文件
  public type;  // 文件类型
  public fileUrl;  // 文件的url
  content: any;
  title: any;
  filename: any;
  routerName: any;

  constructor(
    private router: Router,
    public api: Api,
    public activatedRoute: ActivatedRoute,
    public nativeService: NativeService,
    public navCtrl: NavController,

    // 信任 解决跨域
    public sanitizer: DomSanitizer,
    // private transfer: FileTransfer,
    // private file: File,
    // public clipboard: Clipboard,
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      // console.log('商学院详情：', params);
      let businessDetailData = Utils.localStorageGetItem('businessDetailData');
      this.id = businessDetailData.id ? params.id : 0;
      this.routerName = params.routerName;
      this.type = businessDetailData.type;
      this.fileUrl = businessDetailData.fileUrl ? businessDetailData.fileUrl : '';
      this.content = businessDetailData.content;
      this.title = businessDetailData.title;
      // 图片
      if (this.type == 1) {
        this.url = this.fileUrl;
      }
      // 视频
      if (this.type == 2) {
        console.log('获取数据-video', this.qiniuUrl + this.fileUrl);
        this.video = this.qiniuUrl + this.fileUrl;
      }
      // 音频
      if (this.type == 3) {
        this.audio = this.qiniuUrl + this.fileUrl;
      }
      //  ppt  pdf world excel 文件
      if (this.type == 4) {
        this.pdf2 = this.qiniuUrl + this.fileUrl;
        console.log(this.pdf2);
        // http://view.xdocin.com/xdoc?_xdoc= 后面可以拼接 很多类型
        // 如：docx / xlsx / pptx / pdf / ofd /jpg / mp4 / doc / xls / ppt / word xml / rtf / csv / java / zip / txt ...
        this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl('http://view.xdocin.com/xdoc?_xdoc=' + this.pdf2);
      }

    });

  }


  ngOnInit() {
  }

  ionViewWillEnter() { }




  goback() {
    // this.navCtrl.back();
    this.router.navigate([this.routerName]);

  }

  // 文件下载
  downloadFile(fileUrl: any, fileName: any) {

    // 获取文件扩展名
    const index = fileUrl.lastIndexOf('.');
    const fileExtension = fileUrl.substring(index + 1, fileUrl.length);

    // 图片下载  在web 浏览器上可以使用
    if (/^image\[jpeg|jpg|png|gif]/.test(fileExtension)) {
      const image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        const url = canvas.toDataURL(fileUrl); // 得到图片的base64编码数据
        const a = document.createElement('a'); // 生成一个a元素
        const event = new MouseEvent('click'); // 创建一个单击事件
        a.download = fileName || 'photo'; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = fileUrl;
    } else {
      const elemIF = document.createElement('iframe');
      elemIF.src = fileUrl;
      elemIF.style.display = 'none';
      document.body.appendChild(elemIF);
      setTimeout(() => {
        document.body.removeChild(elemIF);
      }, 1000);
    }

  }

  gitFileName(url) {
    let filename = url.substring('/', '.');
    this.filename = filename
  }



  /** 文件 下载 */
  // download(fileUrl) {
  //   this.nativeService.presentAlert('进入下载');

  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   let url = fileUrl;
  //   console.log('文件 下载000:', url);

  //   // 获取文件扩展名
  //   let index = fileUrl.lastIndexOf('/');
  //   let fileExtension = fileUrl.substring(index + 1, fileUrl.length);

  //   console.log('文件 下载001', fileExtension);
  //   // fileTransfer.download(url, this.file.dataDirectory + fileExtension).then(
  //   fileTransfer.download(url, this.file.externalApplicationStorageDirectory + fileExtension).then(
  //     (entry) => {
  //       this.nativeService.presentAlert('下载...');
  //       console.log('download complete: ' + entry.toURL());
  //       this.nativeService.presentAlert('下载成功');
  //     }, (error) => {
  //       alert(error.code);
  //     });
  // }

  /** 复制  测试 */
  // copyText(){
    // this.clipboard.copy('Hello world');
    // this.nativeService.showToast("已复制！");
    // Plugins.Clipboard.write({
    //   string: "hello,123"
    // })
  // }






}
