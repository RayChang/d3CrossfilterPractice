import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/share/service/Dashboard.service';
import { select, Selection } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('weightHeightChart') weightHeightChart: ElementRef;
  chartContainer: Selection<SVGElement, {}, HTMLElement, any>;

  private chartWidth = 960;
  private chartHeight = 300;
  private margin = 50;
  private chartHeightWithoutMargin = this.chartHeight - this.margin;

  constructor(
    private dashboardService: DashboardService
  ) {}
  ngOnInit() {
    this.dashboardService.getData();
    this.createSvg();
  }
  createSvg() {
    this.chartContainer = select(this.weightHeightChart.nativeElement);
    this.chartContainer
      .append<SVGElement>('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
    console.log(this.chartContainer);
  }
}
