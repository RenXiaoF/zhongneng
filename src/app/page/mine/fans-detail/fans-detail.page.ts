import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeService, Api } from 'src/services';

@Component({
  selector: 'app-fans-detail',
  templateUrl: './fans-detail.page.html',
  styleUrls: ['./fans-detail.page.scss'],
})
export class FansDetailPage implements OnInit {
  public data:any[] = [] 
  constructor(
    private router:Router,
    private native:NativeService,
    private Api:Api,
  ) { 
  }

  ngOnInit() {
  }

  // 返回上一级页面(myfans)
  goback(){
    this.router.navigate(["myfans"]);
  }

}
