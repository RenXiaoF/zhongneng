import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DescriptionDocPage } from './description-doc.page';

const routes: Routes = [
  {
    path: '',
    component: DescriptionDocPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DescriptionDocPage],
  entryComponents:[
    DescriptionDocPage
  ],
  exports:[

  ]
})
export class DescriptionDocPageModule {}
