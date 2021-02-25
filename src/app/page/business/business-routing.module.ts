import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessPage } from './business.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessPage
  },
  {
    path: 'class-rom',
    loadChildren: () => import('./class-rom/class-rom.module').then( m => m.ClassRomPageModule)
  },
  {
    path: 'recommended-course',
    loadChildren: () => import('./recommended-course/recommended-course.module').then( m => m.RecommendedCoursePageModule)
  },
  {
    path: 'course-detail',
    loadChildren: () => import('./course-detail/course-detail.module').then( m => m.CourseDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessPageRoutingModule {}
