import { Injectable } from '@angular/core';
import { Athletes } from '../interface/athletes';
import { dsv } from 'd3';
import { Crossfilter, Dimension, Group } from 'crossfilter2';
import * as crossfilter from 'crossfilter2';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private ndx: Crossfilter<Athletes>;
  athletesDimension: Dimension<Athletes, string>;
  numberOfAthletesPerYearGroup: Group<Athletes, string, string>;

  constructor() { }

  private createGroupFromDimension() {
    this.numberOfAthletesPerYearGroup = this.athletesDimension.group();
    console.log(this.numberOfAthletesPerYearGroup.all());
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
      console.log(result.splice(0, 10));
      this.ndx = crossfilter(result);
      this.athletesDimension = this.ndx.dimension(d => d.games);
      this.createGroupFromDimension();
    });
  }

}
