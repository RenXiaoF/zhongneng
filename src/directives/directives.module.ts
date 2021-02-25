import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorImgDirective } from './app-error-img/app-error-img';
import { InputFocusContentDirective } from './input-focus-content.directive'

@NgModule({
  declarations: [
    AppErrorImgDirective,
    InputFocusContentDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AppErrorImgDirective,
    InputFocusContentDirective
  ]
})
export class DirectivesModule { }
