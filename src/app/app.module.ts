import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AthletesPerYearComponent } from './components/athletes-per-year/athletes-per-year.component';
import { DashboardService } from 'src/share/service/Dashboard.service';
import { AgeSexComponent } from './components/age-sex/age-sex.component';

@NgModule({
  declarations: [
    AppComponent,
    AthletesPerYearComponent,
    AgeSexComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
