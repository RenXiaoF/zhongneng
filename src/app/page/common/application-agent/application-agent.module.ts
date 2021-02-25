import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicationAgentPageRoutingModule } from './application-agent-routing.module';

import { ApplicationAgentPage } from './application-agent.page';
import { PipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ApplicationAgentPageRoutingModule
  ],
  declarations: [ApplicationAgentPage]
})
export class ApplicationAgentPageModule {}
