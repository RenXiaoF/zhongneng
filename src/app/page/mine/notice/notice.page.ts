import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api, NativeService } from 'src/services';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {
  public data = false; // 是否有数据
  public page = 1; // 默认页码数
  public articleData; // 文章数据
  public currentPage = 1; // 当前页
  public lastPage = 1; // 最后页
  public perPage = 10; // 每页条数
  constructor(
    private router: Router,
    private api: Api,
    public native: NativeService,
    public nav: NavController,
  ) { }

  ngOnInit() {
  }
  // 初始化页面
  ionViewWillEnter() {
      this.getMessage(this.page);
  }
  // 获取文章通知信息
  getMessage(page) {
      this.api.get('consign/getMessage', {'per_page': this.perPage, 'page': page}).subscribe((res: any) => {
          if (res.status == 200) {
              this.articleData = res.data.data;
              if (res.data.data.length === 0) {
                  this.data = false;
              } else {
                  this.data = true;
                  this.currentPage = res.data.current_page;
                  this.lastPage = res.data.last_page;
              }

          } else {
              this.native.showToastTips(res.msg);
          }
      }, (err) => {
          console.log(err);
      });
  }
    // 刷新数据
    doRefresh(event) {
        setTimeout(() => {
            this.articleData = [];
            this.getMessage(1);
            event.target.complete();
        }, 1000);
    }
    // 加载更多
    loadData(event) {
        setTimeout(() => {
            if (this.currentPage < this.lastPage) {
                const oldArticleData = this.articleData;
                this.currentPage = this.currentPage + 1;
                this.getMessage(this.currentPage);
                this.articleData = oldArticleData.push(this.articleData);
            }
            event.target.complete();
        }, 1000);
    }

  // 返回上一级页面
  goback() {
    this.router.navigate(['/tabs/home']);
  }
}
