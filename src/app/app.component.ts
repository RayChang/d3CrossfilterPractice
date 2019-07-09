import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/share/service/Dashboard.service';
import {
  select, Selection,
  scaleLinear, ScaleLinear,
  axisLeft, axisBottom, Axis
} from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('weightHeightChart') weightHeightChart: ElementRef;
  chartContainer: Selection<HTMLElement, {}, HTMLElement, any>;

  private chartWidth = 960;
  private chartHeight = 300;
  private margin = 40;
  private chartHeightWithoutMargin = this.chartHeight - this.margin;
  private chart: Selection<SVGElement, {}, HTMLElement, any>;
  private countScale: ScaleLinear<number, number>;
  private yearScale: ScaleLinear<number, number>;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.chartContainer = select(this.weightHeightChart.nativeElement);
    this.dashboardService.getData()
    .then(() => {
      this.createSvg();
      this.initScales();
      this.drawAxes();
    });
  }

  createSvg() {
    this.chart = this.chartContainer
      .append<SVGElement>('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
  }

  initScales() {
    const maxCount = this.dashboardService.numberOfAthletesPerYearGroup.top(1)[0];
    const chartWidth = this.chartWidth - this.margin;
    const chartHeight = this.chartHeight - this.margin;

    this.countScale = scaleLinear<number, number>().domain([0, maxCount.value.count]).range([chartHeight, this.margin]);
    this.yearScale = scaleLinear<number, number>().domain([1890, 2020]).range([this.margin, chartWidth]);
  }

  drawAxes() {
    const countAxis: Axis<number> = axisLeft<number>(this.countScale);
    const yearAxis: Axis<number> = axisBottom<number>(this.yearScale);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', `translate(${this.margin}, 0)`)
      .call(countAxis);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', `translate(0, ${this.chartHeightWithoutMargin})`)
      .call(yearAxis);
  }

  drawLine() {

  }
}
