import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-agreement',
  templateUrl: './product-agreement.page.html',
  styleUrls: ['./product-agreement.page.scss'],
})
export class ProductAgreementPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  // 返回上一级页面(detail)
  goback(){
    this.modalCtrl.dismiss();
  }
}
