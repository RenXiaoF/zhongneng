import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from 'src/services';

@Component({
  selector: 'app-brand-classify',
  templateUrl: './brand-classify.page.html',
  styleUrls: ['./brand-classify.page.scss'],
})
export class BrandClassifyPage implements OnInit {
  public is_checked_category = 0; // 选中的一级分类
  public categoryList = []
  storeList = [];

  constructor(
    private router: Router,
    private api: Api

  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getNav()
    // setTimeout(() => {
    //   this.changeSegment(0)
    // }, 500);
  }

  getNav(){
    this.api.get('BrandStreet/index').subscribe(
      (res: any) => {
        console.log('res',res);
        let len = res.data.length
        if(len){
          this.categoryList = res.data
        }
        this.changeSegment(0)
        
      },
      (err) => {
        console.error('ERROR' + err);
      }
    );
    
  }

  /** 分类选项卡 切换 */
  changeSegment(myIndex) {
    this.is_checked_category = myIndex

    this.storeList = this.categoryList[myIndex].stores
    console.log('321',this.storeList);
    
  }

  goStreet(store_id){
    this.router.navigate(['brand-street'],{queryParams:{storeId:store_id}})
  }

  goBack(){
    this.router.navigate(['/tabs/home']);

  }

}
