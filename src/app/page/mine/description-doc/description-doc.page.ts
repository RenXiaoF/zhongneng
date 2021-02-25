import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-description-doc',
  templateUrl: './description-doc.page.html',
  styleUrls: ['./description-doc.page.scss'],
})
export class DescriptionDocPage implements OnInit {
  public doc_url = '';
  public jumpLink: any;
  public title = '信息';

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private sanitizer: DomSanitizer,
  ) {
      // this.doc_url = 'https://m.kuaidi100.com/result.jsp?nu=552022603090056';
      this.doc_url = this.navParams.data.url;
      this.title = this.navParams.data.title ? this.navParams.data.title : this.title;
      this.jumpLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.doc_url); // 信任该url
  }

  ngOnInit() {
  }

  close(){
    this.modalCtrl.dismiss();
  }
}

