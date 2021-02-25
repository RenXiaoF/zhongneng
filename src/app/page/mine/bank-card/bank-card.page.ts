import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular'; 
import { Api } from 'src/services/api'; 
import { NativeService } from 'src/services/NativeService'; 
import { GlobalData } from 'src/services/GlobalData'; 

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.page.html',
  styleUrls: ['./bank-card.page.scss'],
})
export class BankCardPage implements OnInit {
  public data:boolean = true; //保存页面数据状态，默认false为无数据
  public token:string = ""; //保存用户token
  public segments = []; 
  public index = 0;  //保存选项卡下标
  public showData = [];  //保存页面数据

  constructor(
    private router: Router,
    private Api: Api,
    private _GlobalData: GlobalData,
    private native: NativeService,
    private alertTips: AlertController,
  ) { }

  ngOnInit() {
  }

  // 初始化页面
  ionViewWillEnter() {
    this.token = this._GlobalData.token;
    this.getCard();
  }
  // 解除银行卡/支付宝/微信
  delectCard(card_id){
    console.log(card_id);
    this.native.showLoading();
    this.Api.postFormData('bank/delete', {
      "id": card_id,
    }).subscribe((res: any) => {
      console.log(res)
      this.native.hideLoading();
      if (res.status == 200) {
        this.native.showToast(res.msg);
        this.getCard();
      }else{
        this.native.showToast(res.msg);
      }
    }, (err) => {
        this.native.hideLoading();
        console.log(err);
    });  
  }

  // 显示提示框
  async showAlert(myIndex){
    let text = this.segments[this.index].type_name;
    console.log(this.showData);
    const alert = await this.alertTips.create({
      header: '解除'+text+'绑定',
      message: '你是否要解除绑定',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        }, {
          text: '确认',
          role: 'OK',
          handler: () => {
            this.delectCard(this.showData[myIndex].id);
          }
        }
      ]
    });

    await alert.present();
  }
  // 初始化页面数据列表
  getCard(){
    this.native.showLoading();
    this.Api.get('bank/index', {"Token": this.token}).subscribe((res: any) => {
      console.log(res)
      this.native.hideLoading();
      if (res.status == 200) {
        this.segments = res.data;
        if(this.segments.length > 0){
          for(let item of this.segments){
            item.isChecked = false;
          }
          this.changeSegment(this.index);
        }
      } else {
          this.native.showToastTips(res.msg);
        }
    }, (err) => {
        this.native.hideLoading();
        console.log(err);
    });    
  }
  //选项卡切换
  changeSegment(myIndex){
    this.index = myIndex;
    this.showData = this.segments[myIndex].data;
    if(this.showData.length == 0){
      this.data = false;
    }else{
      this.data = true;
    }
    for(let item of this.segments){
      item.isChecked = false;
    }
    this.segments[myIndex].isChecked = true;
    console.log(this.showData)
  } 
  // 跳转到新增银行卡/支付宝账号(addcard)页面
  goaddcard(type?:string,item?:any){
    if(type == 'edit'){
      this.router.navigate(["addcard"],{queryParams:{type:type,edit: JSON.stringify(item)}});
    }else{
      this.router.navigate(["addcard"]);
    }
  }
  // 返回上一级页面(tabs/mine)
  goback(){
    this.router.navigate(["/tabs/mine"]);
  }
}
