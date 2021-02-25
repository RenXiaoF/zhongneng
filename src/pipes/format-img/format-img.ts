import { Pipe, PipeTransform } from '@angular/core';
import { FILE_OFFLINE_SERVE_URL, IS_DEBUG, FILE_ONLINE_SERVE_URL } from 'src/services/Constants';
// import { Utils } from 'src/services/Utils'; //过滤网络请求url2.0

/**
 * Generated class for the DefaultImgPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatImg',
})
export class FormatImgPipe implements PipeTransform {
  transform(value: string) {
    let img = value.slice(0, 4);
    if (img == 'http') {
      return value;
    } else {
      if (IS_DEBUG) {
          return FILE_OFFLINE_SERVE_URL + value;
      } else {
          return FILE_ONLINE_SERVE_URL + value;
      }
    }
  }
  // //2.0版本
  // transform(str: string) {
  //   if (Utils.isEmpty(FILE_SERVE_URL) || Utils.isEmpty(str)) {
  //     return str;
  //   }
  //   let subStr1 = /src="(\S*)"/g;
  //   let subStr2 = /src="(\S*)"/;
  //   let back = str.replace(subStr1,($1) => {
  //     let str = $1.match(subStr2)[1];
  //     if ((!str.includes('http') || !str.includes('www')) && !str.includes('assets')) {
  //       str = FILE_SERVE_URL + str;
  //     }
  //     return String.raw`src="${str}"`;
  //   });
  //   return back;
  // }
}
