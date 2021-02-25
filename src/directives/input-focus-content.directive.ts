import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputFocusContent]'
})
export class InputFocusContentDirective {

  constructor() { }

  @HostListener('mousedown', ['$event.target'])
  onfocus(e: any) {
    console.log(e);
    
    e.select();
    
  }
}
