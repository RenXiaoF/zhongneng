import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecommendedCoursePage } from './recommended-course.page';

const routes: Routes = [
  {
    path: '',
    component: RecommendedCoursePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecommendedCoursePageRoutingModule {}
