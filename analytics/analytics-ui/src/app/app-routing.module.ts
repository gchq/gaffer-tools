import { AnalyticsComponent } from './analytics/analytics.component'
import { TableComponent } from './table/table.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ParameterInputComponent } from './parameter-input/parameter-input.component'

const routes: Routes = [
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'parameters', component: ParameterInputComponent },
  { path: 'parameters/:operation', component: ParameterInputComponent },
  { path: 'results', component: TableComponent },
  { path: '**', redirectTo: 'analytics' }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
