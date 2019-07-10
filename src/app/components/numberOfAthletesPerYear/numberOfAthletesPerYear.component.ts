import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  line as d3Line, Line,
  scaleTime, ScaleTime,
  select, Selection,
  scaleLinear, ScaleLinear,
  axisLeft, axisBottom, Axis, interpolateRound
} from 'd3';
import { Group, Dimension } from 'crossfilter2';
import { DashboardService } from 'src/share/service/Dashboard.service';
import {
  Athletes,
  AthletesPerYearGroupItem,
  AthletesPerYearGroupValue
} from 'src/share/interface/numberOfAthletesPerYearInterface';

@Component({
  selector: 'app-number-of-athletes-per-year',
  templateUrl: './numberOfAthletesPerYear.component.html',
  styleUrls: ['./numberOfAthletesPerYear.component.css']
})
export class NumberOfAthletesPerYearComponent implements OnInit {
  @ViewChild('weightHeightChart') weightHeightChart: ElementRef;

  private group: Group<Athletes, string, AthletesPerYearGroupValue>;
  private chartContainer: Selection<SVGElement, {}, HTMLElement, any>;
  private chartWidth = 960;
  private chartHeight = 300;
  private margin = 40;
  private chartHeightWithoutMargin = this.chartHeight - this.margin;
  private countScale: ScaleLinear<number, number>;
  private yearScale: ScaleTime<number, number>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.athletesPerYearGroup$.subscribe(this.render.bind(this));
  }

  private render(group: Group<Athletes, string, AthletesPerYearGroupValue>) {
    console.log(group.all());
    this.group = group;
    this.createSvg();
    this.initScales();
    this.drawAxes();
    this.drawLine();
    this.drawPoints();
  }

  private createSvg() {
    this.chartContainer = select(this.weightHeightChart.nativeElement)
      .append<SVGElement>('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
  }

  private initScales() {
    const maxCount = this.group.top(1)[0];
    const chartWidth = this.chartWidth - this.margin;
    const chartHeight = this.chartHeight - this.margin;
    this.countScale = scaleLinear<number, number>()
      .domain([0, maxCount.value.count])
      .range([chartHeight, this.margin]);
    this.yearScale = scaleTime<number, number>()
      .domain([new Date(1890, 0, 1, 0), new Date(2020, 0, 11, 23)])
      .range([this.margin, chartWidth]);
  }

  private drawAxes() {
    const countAxis: Axis<number> = axisLeft<number>(this.countScale);
    const yearAxis: Axis<Date> = axisBottom<Date>(this.yearScale);

    this.chartContainer
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', `translate(${this.margin}, 0)`)
      .call(countAxis);

    this.chartContainer
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', `translate(0, ${this.chartHeightWithoutMargin})`)
      .call(yearAxis);
  }

  private drawLine() {
    const line: Line<AthletesPerYearGroupItem<AthletesPerYearGroupValue>> = d3Line<AthletesPerYearGroupItem<AthletesPerYearGroupValue>>()
      .x(d => this.yearScale(d.value.year))
      .y(d => this.countScale(d.value.count));

    this.group.order(d => d.year);

    this.chartContainer
      .append('g')
      .attr('class', 'c-line')
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'darkorange')
      .attr('d', line(this.group.all()));
  }

  private drawPoints() {
    this.chartContainer
      .append('g')
      .attr('class', 'c-points')
      .selectAll('circle')
      .data(this.group.all())
      .enter()
      .datum(this.group.all())
      .append('circle')
      .attr('cx', (d, i) => this.yearScale(d[i].value.year))
      .attr('cy', (d, i) => this.countScale(d[i].value.count))
      .attr('r', 3)
      .attr('fill', 'darkorange')
      .on('mouseover', (data, index, elements) => {
        select(elements[index])
          .transition()
          .duration(200)
          .attr('r', 5);
          // .tween('animation', (d, i, e) => t => select(e[i]).attr('r', interpolateRound(3, 5)(t)));
      })
      .on('mouseleave', (data, index, elements) => {
        select(elements[index])
          .transition()
          .duration(500)
          .attr('r', 3);
      })
      .on('click', (data, index) => {
        this.dashboardService.athletesDimension.filter(data[index].key);
        console.log(this.dashboardService.athletesGroup.all());
      });
  }

}
