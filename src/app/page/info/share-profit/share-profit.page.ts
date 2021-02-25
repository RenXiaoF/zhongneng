import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-profit',
  templateUrl: './share-profit.page.html',
  styleUrls: ['./share-profit.page.scss'],
})
export class ShareProfitPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigate(['/tabs/home']);

  }
  gotoDetail(){}

}
