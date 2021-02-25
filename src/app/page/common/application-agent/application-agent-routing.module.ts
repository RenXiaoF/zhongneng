import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationAgentPage } from './application-agent.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicationAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationAgentPageRoutingModule {}
