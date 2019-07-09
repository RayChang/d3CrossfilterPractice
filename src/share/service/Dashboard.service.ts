import { Injectable } from '@angular/core';
import { Athletes } from '../interface/athletes';
import { dsv } from 'd3';
import { Crossfilter, Dimension, Group } from 'crossfilter2';
import * as crossfilter from 'crossfilter2';

class AthletesPerYearGroup {
  year: number = null;
  season: string = null;
  count = 0;
  valueOf() {
    return this.count;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private ndx: Crossfilter<Athletes>;
  athletesDimension: Dimension<Athletes, string>;
  numberOfAthletesPerYearGroup: Group<Athletes, AthletesPerYearGroup, AthletesPerYearGroup>;

  constructor() { }

  private createGroupFromDimension() {
    this.numberOfAthletesPerYearGroup = this.athletesDimension.group<AthletesPerYearGroup, AthletesPerYearGroup>()
      .reduce(
        // reduceAdd()
        (output, input) => {
          ++output.count;
          output.year = input.year;
          output.season = input.season;
          return output;
        },
        // reduceRemove()
        (output, input) => {
          --output.count;
          output.year = input.year;
          output.season = input.season;
          return output;
        },
        // reduceInitial()
        () => new AthletesPerYearGroup()
      );
  }

  getData() {
    return new Promise(resolve => {
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
        this.athletesDimension = this.ndx.dimension(d => d.games);
        this.createGroupFromDimension();
        resolve();
      });
    });
  }

}
