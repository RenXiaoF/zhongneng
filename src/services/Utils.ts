// import { Buffer } from 'safe-buffer';
import { Injectable } from '@angular/core';
import { FILE_ONLINE_SERVE_URL } from './Constants';
declare var window: any;


/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Utils {

  static isEmpty(value): boolean {
    return value == null || typeof value === 'string' && value.length === 0;
  }

  static isNotEmpty(value): boolean {
    return !Utils.isEmpty(value);
  }

  /**
   * 格式“是”or“否”
   * @param value
   * @returns {string|string}
   */
  static formatYesOrNo(value: number | string): string {
    return value == 1 ? '是' : (value == '0' ? '否' : null);
  }


  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    const time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? '0' + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? '0' + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond));
  }

  /**
   * @param  {number} range
   * @param  {string} [type]
   * @memberOf  VehicleOverviewComponent
   * @description  获取今天及前后天
   */
  static getRangeDate(range: number, type?: string) {

    const formatDate = (time: any) => {
      // 格式化日期，获取今天的日期
      const Dates = new Date(time);
      const year: number = Dates.getFullYear();
      const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      return year + '-' + month + '-' + day;
    };

    const now = formatDate(new Date().getTime()); // 当前时间
    const resultArr: Array<any> = [];
    let changeDate: string;
    if (range) {
      if (type) {
        if (type === 'one') {
          changeDate = formatDate(new Date().getTime() + (1000 * 3600 * 24 * range));
          console.log(changeDate);
          return changeDate;
        }
        if (type === 'more') {
          if (range < 0) {
            for (let i = Math.abs(range); i >= 0; i--) {
              resultArr.push(formatDate(new Date().getTime() + (-1000 * 3600 * 24 * i)));
              console.log(resultArr);
            }
          } else {
            for (let i = 1; i <= range; i++) {
              resultArr.push(formatDate(new Date().getTime() + (1000 * 3600 * 24 * i)));
              console.log(resultArr);
            }
          }

        }
      } else {
        changeDate = formatDate(new Date().getTime() + (1000 * 3600 * 24 * range));
        console.log(changeDate);
        return changeDate;
      }
    }
  }

  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  static getSequence = (() => {
    let sequence = 1;
    return () => {
      return ++sequence;
    };
  })();

  /**
   * 返回字符串长度，中文计数为2
   * @param str
   * @returns {number}
   */
  static strLength(str: string): number {
    let len = 0;
    for (let i = 0, length = str.length; i < length; i++) {
      str.charCodeAt(i) > 255 ? len += 2 : len++;
    }
    return len;
  }

  /**
   * 把url中的双斜杠替换为单斜杠
   * 如:http://localhost:8080//api//demo.替换后http://localhost:8080/api/demo
   * @param url
   * @returns {string}
   */
  static formatUrl(url = ''): string {
    let index = 0;
    if (url.startsWith('http')) {
      index = 7;
    }
    return url.substring(0, index) + url.substring(index).replace(/\/\/*/g, '/');
  }


  static sessionStorageGetItem(key: string) {
    const jsonString = sessionStorage.getItem(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  }

  static sessionStorageSetItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static sessionStorageRemoveItem(key: string) {
    sessionStorage.removeItem(key);
  }

  static sessionStorageClear() {
    sessionStorage.clear();
  }

  static localStorageGetItem(key: string) {
    const jsonString = window.localStorage.getItem(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  }

  static localStorageSetItem(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  static localStorageRemoveItem(key: string) {
    window.localStorage.removeItem(key);
  }

  static localStorageClear() {
    window.localStorage.clear();
  }

  /** 产生一个随机的32位长度字符串 */
  static uuid() {
    let text = '';
    const possible = 'abcdef0123456789';
    for (let i = 0; i < 19; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + new Date().getTime();
  }
  /** 判断是否超链接 */
  static isUrl(str) {
    let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    let objExp = new RegExp(reg);
    return objExp.test(str);
  }
  // base64加密
  // static base64encoder(context): any {
  //   // tslint:disable-next-line:prefer-const
  //   let encoder = new Buffer(context).toString('base64');
  //   return encoder;
  // }
  // base64解密
  // static base64decoder(context): any {
  //   // tslint:disable-next-line:prefer-const
  //   let decoder = new Buffer(context, 'base64').toString();
  //   return decoder;
  // }


  /** 乘法 */
  static accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
      m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }

  static accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
  }

  /** 禁止number类型的input框输入其它的字符 */
  static checknumber(evt) {
    // console.log(evt);
    let arr1 = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // 数字0~9(大键盘)
    let arr2 = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105]; // 数字0~9(小键盘)
    let arr3 = [8, 46, 37, 39]; // backspace,delete,<,>
    let arr = arr1.concat(arr2, arr3);
    if (arr.indexOf(evt.keyCode) == -1) {
      return false;
    }
  }
  /** 字符串中src 链接补全链接 */
  static imgUrlConversion(str) {
    if (Utils.isEmpty(FILE_ONLINE_SERVE_URL) || Utils.isEmpty(str)) {
      return str;
    }
    let subStr1 = /src="(\S*)"/g;
    let subStr2 = /src="(\S*)"/;
    let back = str.replace(subStr1, ($1) => {
      let str = $1.match(subStr2)[1];
      if ((!str.includes('http') || !str.includes('www')) && !str.includes('assets')) {
        str = FILE_ONLINE_SERVE_URL + str;
      }
      return String.raw`src="${str}"`;
    });
    return back;
  }

    // Base64 解码
    // base64decoder(base64): any{
    //     let decoder = "";
    //     if (this.strIsNotEmpty(base64)) {
    //         decoder = new Buffer(base64,'base64').toString();
    //     }
    //     //new Buffer('YWRtaW4=','base64').toString();//解码
    //     //new Buffer('admin').toString('base64');//编码
    //     return decoder;
    // }

    // Base64 编码
    // base64encoder(str){
    //     let decoder = "";
    //     if (this.strIsNotEmpty(str)) {
    //         decoder = new Buffer(str).toString('base64');
    //     }
    //     return decoder;
    // }

    // 判断字符串是否不为空
    static strIsNotEmpty(str){
        let isNotEmpty = false;
        if(str != null && str != undefined && str != "")
            isNotEmpty = true;
        return isNotEmpty;
    }

    // app自动更新
    static testAppVersion() {
        document.addEventListener('deviceready', () => {
            // 插件1
            let versionCode = window.AppVersion.version;
            console.log('本地app版本：' + versionCode);

            function allow() { console.log('更新App成功：' + JSON.stringify(arguments)); }
            function disable() { console.log('更新App失败：' + JSON.stringify(arguments)); }
            try {
                let updateUrl = 'http://mall.rossai.cn/version.xml';
                window.AppUpdate.checkAppUpdate(allow, disable, updateUrl);
            } catch (e) {
                alert(e);
            }
        });
    }


    /** 获取当前安装应用的包名 */
    static testGetAppIdentifier() {
      document.addEventListener('deviceready', () => {
        Utils.localStorageSetItem('package_name', window.navigator.appInfo.identifier);
        Utils.localStorageSetItem('version_code', window.navigator.appInfo.version);

        // alert('应用包名' + window.navigator.appInfo.identifier + '-----' + window.navigator.appInfo.version);
      });
    }
}
