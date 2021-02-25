import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-registration-agreement',
  templateUrl: './registration-agreement.page.html',
  styleUrls: ['./registration-agreement.page.scss'],
})
export class RegistrationAgreementPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  // 返回上一级页面(sign-up)
  goback(){
    this.modalCtrl.dismiss();
  }
}
