import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertController, NavController, ModalController, NavParams  } from '@ionic/angular';
import { Api } from 'src/services';
import { NewaddressPage } from '../newaddress/newaddress.page';

@Component({
  selector: 'app-myaddress',
  templateUrl: './myaddress.page.html',
  styleUrls: ['./myaddress.page.scss'],
})
export class MyaddressPage implements OnInit {
  @Input() chooseaddress: boolean;

  callback;
  addresslist = [];
  ifchooseaddress = false;
  ifdisabled = false;
  constructor(
    public navCtrl: NavController,
    public api: Api,
    // public events: Events,
    public modalController: ModalController,
    public alertCtrl: AlertController,
    public activateRoute: ActivatedRoute,
    public nav: NavController,
    public navParams: NavParams
  ) {
    this.activateRoute.queryParams.subscribe((params: Params) => {
      this.ifchooseaddress = this.navParams.get("chooseaddress");
    //   if(this.navParams.get("chooseaddress")){
    //     this.ifchooseaddress = this.navParams.get("chooseaddress");
    //   }else{
    //     this.ifchooseaddress = params['chooseaddress'] ? true : false;
    //   }
    });

    // this.events.subscribe('updateaddress', () => {
    //   this.getaddresslist();
    // })
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getaddresslist();
  }

  setDefualtAddr(event, addr){
    console.log(addr)
    // 阻止事件冒泡
    if(event.preventDefault){
      event.stopPropagation();
    }
    let obj = {
      'consignee': addr.consignee,
      'mobile': addr.mobile,
      'province': addr.province,
      'city': addr.city,
      'district': addr.district,
      'address': addr.address,
      'is_default': addr.is_default == 1?0:1,
      'id': addr.address_id
    }
    console.log(obj);
    this.api.postFormData('Address/add_address', obj).subscribe((res: any) => {
        console.log(res)
        if (res.status == 1) {
          this.getaddresslist();
        } else {
          console.log(res.msg);
        }
      }, (err) => {
        console.log(err);
      })
  }

  getaddresslist() {
    this.api.postFormData('Address/ajaxAddress').subscribe((res: any) => {
      console.log(res);
      if (res.status == 1) {
        this.addresslist = res.result.address_list;
      }
    }, (err) => {
      console.log(err);
    })
  }

  selectaddress(addressinfo) {
    // this.events.publish('changeaddress', addressinfo)
    // this.modalController.dismiss();
    // if (this.ifchooseaddress) {
    //   this.events.publish('changeaddress', addressinfo)
    // }
  }

  async newaddress() {
    this.ifdisabled = true;
    const modal = await this.modalController.create({
      component: NewaddressPage,
    });
    await modal.present();
    await modal.onDidDismiss().then((data) => {
      this.ifdisabled = false;
      if (data) {
          this.getaddresslist();
      }
    });
  }

  async alteraddress(event, address) {
    // 阻止事件冒泡
    if(event.preventDefault){
      event.stopPropagation();
    }
    const modal = await this.modalController.create({
      component: NewaddressPage,
      componentProps: {
        editAddress : address,
        consignee : address['consignee'],
        mobile : address['mobile'],
        is_default :address['is_default'],
        address_id : address['address_id'],
        user_id : address['user_id'],
        province_id : address['province'],        
        city_id : address['city'],         
        district_id : address['district'],
        province_city_district: address.province_name+' '+address.city_name+' '+address.district_name,
      }
    });
    await modal.present();
    // return await modal.present();
    const { data } = await modal.onDidDismiss();
    this.getaddresslist();
    return;
  }

  async deleteaddress(event, address_id, idx) {
    // 阻止事件冒泡
    if(event.preventDefault){
      event.stopPropagation();
    }
    let alert = await this.alertCtrl.create({
      header: '是否删除？',
      buttons: [
        {
          text: '取消',
          handler: () => {
          },
        }, {
          text: '确定',
          handler: () => {
            this.del_address(address_id, idx);
          }
        }
      ]
    });
    await alert.present();
  }

  del_address(address_id, idx) {
    this.api.postFormData('Cart/del_address', { 'id': address_id }).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.addresslist.splice(idx, 1);
        } else {
          console.log(res.msg);
        }

      },
      (err) => {
        console.log(err);
      }
    )
  }

  goback() {
    this.modalController.dismiss({flag: true});
    // if(this.ifchooseaddress){
    //   this.modalController.dismiss();
    // }else{
    //   this.nav.back();
    // }
  }
}
