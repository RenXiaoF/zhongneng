import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { NavController, ModalController, PickerController, NavParams } from '@ionic/angular';
import { NativeService, Api } from 'src/services';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {SelAreaPage} from 'src/app/page/mine/sel-area/sel-area.page';

@Component({
  selector: 'app-newaddress',
  templateUrl: './newaddress.page.html',
  styleUrls: ['./newaddress.page.scss'],
})
export class NewaddressPage implements OnInit {
  title_new_address = "新增地址";

  consignee = '';
  mobile = '';
  chooseAdd = '' ;
  chooseValue = {
      'provinceValue': '',
      'cityValue': '',
      'districtValue': ''
  };
  chooseStr = '';
  address = '';//详细地址
  is_default = false;
  id = '';
  
  province = '';
  province_id;
  city_id;
  district_id;
  city = '';
  district = '';
  placeholderpcd = '';

  ifalter = false;//'修改'为true '新增'为false
  ifcart = false;//'从购物车来'为true

  default = '';
  simpleColumns = [];
  addressList = [];
  name = '';
  Areas = "地址信息";
  value = [];
  ifdisabled = false;
  
  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    // public navParams: NavParams,
    // public viewCtrl: ViewController,
    public api: Api,
    public native: NativeService,
    // public events: Events,
    private modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public pickerCtrl: PickerController,
    public http: HttpClient,
    public renderer: Renderer2
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      var addressinfo = params['address'];
      if (addressinfo === undefined) {
        addressinfo = this.navParams['data']['editAddress'];
      }
      if (addressinfo) {
        this.title_new_address = "编辑地址";
        this.ifalter = true;
        this.consignee = addressinfo.consignee;
        this.mobile = addressinfo.mobile;
        this.id = addressinfo.address_id;
        this.is_default = addressinfo.is_default ? true : false;
        this.address = addressinfo.address;
        this.province = addressinfo.province;
        this.city = addressinfo.city;
        this.district = addressinfo.district;
        this.default = addressinfo.province + ' ' + addressinfo.city + ' ' + addressinfo.district;
        this.placeholderpcd = addressinfo.province_name + ' ' + addressinfo.city_name + ' ' + addressinfo.district_name;
        this.name = addressinfo.province_name + addressinfo.city_name + addressinfo.district_name;
        this.chooseAdd = this.navParams['data']['province_city_district'];
      }
      this.activatedRoute = params['ifcart'];
    });
    // this.test();
  }
  ngOnInit() {
  }
              
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewaddressPage');
    // this.getregionlist();
  }

  ionViewDidEnter()
  {
    let elemet = window.document.getElementsByClassName("am-list-line");
    if(elemet[0] !== undefined)
    {
      let line = elemet[0];
      this.renderer.setStyle(line,"border-bottom","1px solid #ccc");  
      this.renderer.setStyle(line,"padding-right","0");     
    }
  }

  test() {
    // this.http.get('assets/city.json').subscribe(data => {
    this.api.get('address/getRegion').subscribe(data => {
      if (data['status'] === 1 && data['msg'] === '获取成功') {
        this.addressList = data['result'];
      }
    }, error => {
      console.log(error);
    });
  }

  getResult(result) {
    this.value = [];
    let temp = '';
    result.forEach(item => {
      this.value.push(item.label || item);
      temp += item.label || item;
    });
    return this.value.map(v => v).join(' ');
  }

  getregionlist() {
    console.log('')
    this.api.postFormData('User/getRegionList').subscribe((res: any) => {
      console.log('打印res'+res);
      if (res.status == 1) {
        this.simpleColumns = [
          {
            name: 'province',
            options: res.result.province,
          }, {
            name: 'city',
            parentCol: 'province',
            options: res.result.city,
          }, {
            name: 'district',
            parentCol: 'city',
            options: res.result.district,
          }
        ];
        // this.firstList = res.result.province;
        // this.secondList = res.result.city;
        // this.thirdList = res.result.district;
      }
    }, (err) => {
      console.log(err);
    })
  }
  // 显示需要调
  // selectedProvince(item) {
  //   this.secondList = item.cities;
  //   this.thirdList = this.secondList[0].district;
  //   this.firstList.forEach(element => {
  //     element.isSelected = false;
  //   });
  //   item.isSelected = true;
  // }
  // selectedCity(item) {
  //   this.thirdList = this.secondList.district;
  //   this.firstList.forEach(element => {
  //     element.isSelected = false;
  //   });
  //   item.isSelected = true;
  // }
  // selectedDistrict(item) {
  //   this.thirdList.forEach(element => {
  //     element.isSelected = false;
  //   });
  //   item.isSelected = true;
  // }

  changepick() {
    this.province = this.chooseAdd.split(' ')[0];
    this.city = this.chooseAdd.split(' ')[1];
    this.district = this.chooseAdd.split(' ')[2];
  }

  newaddress() {
    this.changepick();
    this.ifdisabled = true;
    if (!this.consignee || !this.mobile || !this.province || !this.city || !this.district || !this.address) {
      this.native.showToastTips("请填写完整！");
      this.ifdisabled = false;
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
      this.native.showToastTips("手机号码有误，请重填!");
      this.ifdisabled = false;
      return false;
    }
    let data = {
        'consignee': this.consignee,
        'mobile': this.mobile,
        'province': this.chooseValue.provinceValue ? this.chooseValue.provinceValue : this.province_id,
        'city': this.chooseValue.cityValue ? this.chooseValue.cityValue : this.city_id,
        'district': this.chooseValue.districtValue ? this.chooseValue.districtValue : this.district_id,
        'address': this.address,
        'is_default': this.is_default ? 1 : 0,
        'id': this.id,
    };console.log(data);
    this.api.postFormData('Address/add_address', data).subscribe((res: any) => {
      if (res.status == 1) {
        this.modalCtrl.dismiss(["myaddress"]);
      } else {
        console.log(res.msg);
        this.modalCtrl.dismiss();
      }
      this.ifdisabled = false;
    }, (err) => {
      console.log(err);
      this.ifdisabled = false;
    })
  }

  async createpicker() {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: '取消',
      },{
        text: '确定',
      }],
      columns: [
        {
          name: 'days',
          options: [
            {
              text: '1',
              value: 1
            },
            {
              text: '2',
              value: 2
            },
            {
              text: '3',
              value: 3
            },
          ]
        },
        {
          name: 'years',
          options: [
            {
              text: '1992',
              value: 1992
            },
            {
              text: '1993',
              value: 1993
            },
            {
              text: '1994',
              value: 1994
            },
          ]
        },
      ]
    });
    await picker.present();
  }

  close() {
    this.modalCtrl.dismiss({flag: true});
  }

  //选择地址 
  chooseAddr(){

  }

  async chooseAddress() {
    this.ifdisabled = true;
    const modal = await this.modalCtrl.create({
      component: SelAreaPage,
      componentProps: { 
        chooseValue: this.chooseStr,
       }
    });
    modal.present();
    await modal.onDidDismiss().then((e) => {
      this.ifdisabled = false;
      if(e['data']){
        this.chooseAdd = e['data']['addressStr'];
        this.chooseValue = e['data']['addressValue'];
        this.chooseStr = e['data']['addressFullStr'];
      }
      

      
    });
  }

}
