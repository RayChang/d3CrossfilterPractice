import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NumberOfAthletesPerYearComponent } from './components/numberOfAthletesPerYear/numberOfAthletesPerYear.component';
import { DashboardService } from 'src/share/service/Dashboard.service';

@NgModule({
  declarations: [
    AppComponent,
    NumberOfAthletesPerYearComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
