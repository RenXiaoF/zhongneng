import { Pipe, PipeTransform } from '@angular/core';
import { FILE_OFFLINE_SERVE_URL, IS_DEBUG, FILE_ONLINE_SERVE_URL } from 'src/services/Constants';
import { Utils } from 'src/services';

/**
 * Generated class for the UrlImgPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'urlImg',
})
export class UrlImgPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    console.log(value);
    if(typeof(value) !== 'string'){
      return value
    }
    
    if (Utils.isEmpty(value)) {
      value = "assets/default_goods_image_240.png";
    }

    let img1 = value.indexOf('http');
    let img2 = value.indexOf('assets');
    let img3 = value.indexOf('data:image');

    if (img1>=0 || img2>=0 || img3>=0) {
        return value;
    } else {
        if (IS_DEBUG) {
            value = FILE_OFFLINE_SERVE_URL + value;
        } else {
            value = FILE_ONLINE_SERVE_URL + value;
        }
    }
    
    // if (Utils.isNotEmpty(FILE_SERVE_URL)) {
    //   if (!value.includes('http') || !value.includes('www')) {
    //     value = FILE_SERVE_URL + value;
    //     // console.log('url-img.ts');
    //     // console.log(value);
    //   }
    // }
    // console.log(value);
    return value;
  }
}
