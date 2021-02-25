import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.page.html',
  styleUrls: ['./menu-modal.page.scss'],
})
export class MenuModalPage implements OnInit {
  goods_num = 1
  goodsDetail:any = {}
  size = []
  
  constructor(
    public renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public router: Router,
    public navParams: NavParams,

  ) { 
    this.goodsDetail = this.navParams.get('goodsdetail');
    this.size = this.goodsDetail.spec
    console.log(this.goodsDetail);
    

  }

  ngOnInit() {
  }

  onSub(){
    this.goods_num = this.goods_num - 1
    console.log( this.goods_num);
    
  }
  onAdd(){
    this.goods_num = this.goods_num + 1
    console.log( this.goods_num);

  }

  onClick(i){
    console.log(i);
    
  }

  // 关闭
  dismiss() {
    this.modalCtrl.dismiss();
  }

}
