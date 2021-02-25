import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecommendedCoursePageRoutingModule } from './recommended-course-routing.module';

import { RecommendedCoursePage } from './recommended-course.page';
import { PipesModule } from 'src/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RecommendedCoursePageRoutingModule
  ],
  declarations: [RecommendedCoursePage]
})
export class RecommendedCoursePageModule {}
