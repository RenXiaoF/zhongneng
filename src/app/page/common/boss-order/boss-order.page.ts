import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boss-order',
  templateUrl: './boss-order.page.html',
  styleUrls: ['./boss-order.page.scss'],
})
export class BossOrderPage implements OnInit {

  constructor(
    private router: Router,

  ) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigate(["boss-area"]);
    
  }

}
