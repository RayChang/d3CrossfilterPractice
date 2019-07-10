import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dsv } from 'd3';
import { Crossfilter, Dimension, Group } from 'crossfilter2';
import * as crossfilter from 'crossfilter2';
import { Athletes, AthletesPerYearGroupValue } from '../interface/numberOfAthletesPerYearInterface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private ndx: Crossfilter<Athletes>;
  athletesDimension: Dimension<Athletes, string>;
  athletesGroup: Group<Athletes, string, AthletesPerYearGroupValue>;
  athletesPerYearGroup$ = new Subject<Group<Athletes, string, AthletesPerYearGroupValue>>();

  constructor() { }

  private createGroupFromDimension() {
    this.athletesGroup = this.athletesDimension.group<string, AthletesPerYearGroupValue>()
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
    ).order(d => d.count);

    this.athletesPerYearGroup$.next(this.athletesGroup);
  }

  getData() {
    dsv(',', '/assets/athlete_events.csv', row => ({
      age: row['Age'] !== 'NA' ? +row['Age'] : null,
      city: row['City'],
      event: row['Event'],
      games: row['Games'],
      height: row['Height'] !== 'NA' ? +row['Height'] : null,
      weight: row['Weight'] !== 'NA' ? +row['Weight'] : null,
      medal: row['Medal'],
      name: row['Name'],
      season: row['Season'],
      sex: row['Sex'],
      sport: row['Sport'],
      team: row['Team'],
      year: row['Year'] !== 'NA' ? +row['Year'] : null
    })).then(result => {
      // 將取回的結果轉換成 crossfilter 物件
      this.ndx = crossfilter(result);
      // 用 ndx 中的 games 建立維度
      this.athletesDimension = this.ndx.dimension<string>(d => d.games);
      this.createGroupFromDimension();
    });
  }

}
