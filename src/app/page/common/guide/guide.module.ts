/*
 * @Description: 
 * @Author: liutq
 * @Date: 2020-11-26 14:01:10
 * @LastEditTime: 2020-11-26 14:34:54
 * @LastEditors: liutq
 * @Reference: 
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidePageRoutingModule } from './guide-routing.module';

import { GuidePage } from './guide.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    GuidePageRoutingModule
  ],
  declarations: [GuidePage]
})
export class GuidePageModule {}
