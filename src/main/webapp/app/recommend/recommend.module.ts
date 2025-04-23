import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { RecommendComponent } from './recommend.component';

@NgModule({
  imports: [SharedModule, RecommendComponent],
  declarations: [],
})
export class RecommendModule {}
