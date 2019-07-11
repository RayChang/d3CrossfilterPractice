import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Crossfilter, Dimension, Group } from 'crossfilter2';
import {
  line as d3Line, Line,
  scaleTime, ScaleTime,
  select, Selection,
  scaleLinear, ScaleLinear,
  axisLeft, axisBottom, Axis
} from 'd3';
import {
  Athletes,
  GroupItem,
  AthletesPerYear
} from 'src/share/interface/athletes.interface';

@Component({
  selector: 'app-athletes-per-year',
  templateUrl: './athletes-per-year.component.html',
  styleUrls: ['./athletes-per-year.component.css']
})
export class AthletesPerYearComponent implements OnInit, OnChanges {
  @Input() ndx: Crossfilter<Athletes>;
  @ViewChild('weightHeightChart') weightHeightChart: ElementRef;

  private dimension: Dimension<Athletes, string>;
  private group: Group<Athletes, string, AthletesPerYear>;
  private chartContainer: Selection<SVGElement, {}, HTMLElement, any>;
  private chartWidth = 960;
  private chartHeight = 300;
  private margin = 40;
  private chartHeightWithoutMargin = this.chartHeight - this.margin;
  private countScale: ScaleLinear<number, number>;
  private yearScale: ScaleTime<number, number>;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ndx.firstChange && !this.ndx) {
      return null;
    }
    this.dimension = this.ndx.dimension<string>(d => d.games);
    this.group = this.dimension.group<string, AthletesPerYear>()
      .reduce(
        // reduceAdd()
        (output, input) => {
          ++output.count;
          output.year = new Date(input.year, 0, 1, 0);
          output.season = input.season;
          return output;
        },
        // reduceRemove()
        (output, input) => {
          --output.count;
          output.year = new Date(input.year, 0, 1, 0);
          output.season = input.season;
          return output;
        },
        // reduceInitial()
        () => ({year: null, season: null, count: 0})
      )
      .order(d => d.count);
    this.render(this.group);
  }

  private render(group: Group<Athletes, string, AthletesPerYear>) {
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
    const line: Line<GroupItem<AthletesPerYear>> = d3Line<GroupItem<AthletesPerYear>>()
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
        this.dimension.filter(data[index].key);
        console.log(this.dimension.id());
      });
  }

}
