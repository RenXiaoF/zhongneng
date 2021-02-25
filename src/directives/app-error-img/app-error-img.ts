import { Directive, Input, HostListener } from '@angular/core';
import { DEFAULT_GOODS } from 'src/services/Constants';

/**
 * Generated class for the AppErrorImgDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[app-error-img]' // Attribute selector
})
export class AppErrorImgDirective {

  constructor() {}

  @Input('app-error-img') errorImagSrc: string;
  @HostListener('error', ['$event.target'])
  ImageError(event) {
    if (this.errorImagSrc) {
      event.src = this.errorImagSrc;
    } else {
      event.src = DEFAULT_GOODS;
    }
  }

}
