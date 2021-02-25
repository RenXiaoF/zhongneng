import { Component, OnInit } from '@angular/core';
import { Api, Utils } from 'src/services';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-sel-area',
  templateUrl: './sel-area.page.html',
  styleUrls: ['./sel-area.page.scss'],
})
export class SelAreaPage implements OnInit {
  addressList: any = {};
  list: any = {};
  provinceArr = [];
  cityArr = [];
  districtArr = [];
  provinceValue = '';
  cityValue = '';
  districtValue = '';

  addrParams = '';

  default_city = '';
  default_district = '';


  constructor(
    public api: Api,
    public modalCtrl: ModalController,
    public navParams: NavParams

  ) {
    this.addrParams = this.navParams.data.chooseValue;
    console.log('构造器：', this.addrParams);
    // this.addValue(addrParams);

  }

  ngOnInit() {

    this.fetchAddress();
  }

  fetchAddress() {
    this.api.get('address/getRegion').subscribe(data => {
      if (data['status'] === 1 && data['msg'] === '获取成功') {
        this.addressList = data['result'];
        // 设置默认值
        if (this.addrParams) {
          let default_value = this.addrParams.split('#');
          this.provinceValue = default_value[0];

          this.default_city = default_value[1];
          // this.cityArr = this.addressList[this.cityValue.split('_')[1]].children;
          this.default_district = default_value[2];
          // this.districtArr = this.cityArr[this.districtValue.split('_')[1]].children;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  changeProvince(value) {
    this.cityArr = [];
    this.districtArr = [];
    this.cityValue = value;
    this.default_city = '';
    this.districtValue = '';
    let city_index = this.provinceValue.split('_')[1];
    this.cityArr = this.addressList[city_index].children;
  }

  changeCity(value) {
    this.districtArr = [];
    this.districtValue = value;
    this.default_district = '';
    let district_index = this.cityValue.split('_')[1];
    this.districtArr = this.cityArr[district_index].children;
  }

  async addValue(params) {
    if (params) {
      let default_value = params.split(' ');
      this.provinceValue = default_value[0];
      this.cityValue = default_value[1];
      this.districtValue = default_value[2];
      // this.changeProvince()
      // this.changeCity()
    } else {
      this.provinceValue = ''
      this.cityValue = ''
      this.districtValue = ''
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
  subBtn() {
    let province_value_arr = this.provinceValue.split('_');
    let city_value_arr = this.cityValue.split('_');
    let district_value_arr = this.districtValue.split('_');
    this.modalCtrl.dismiss({
      'addressValue': {
        'provinceValue': province_value_arr[0],
        'cityValue': city_value_arr[0],
        'districtValue': district_value_arr[0]
      },
      'addressFullStr': this.provinceValue + '#' + this.cityValue + '#' + this.districtValue,
      'addressStr': province_value_arr[2] + ' ' + city_value_arr[2] + ' ' + district_value_arr[2]

    });
  }

}
