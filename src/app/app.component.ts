import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/share/service/Dashboard.service';
import { Crossfilter } from 'crossfilter2';
import { Athletes } from 'src/share/interface/athletes.interface';
import * as crossfilter from 'crossfilter2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ndx: Crossfilter<Athletes>;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardService.getData().then(result => this.ndx = crossfilter(result));
  }
}
