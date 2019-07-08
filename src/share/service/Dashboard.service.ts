import { Injectable } from '@angular/core';
import { Athletes } from '../interface/athletes';
import { dsv } from 'd3';
import { Crossfilter, Dimension } from 'crossfilter2';
import * as crossfilter from 'crossfilter2';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  ndx: Crossfilter<Athletes>;
  constructor() { }

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
      this.ndx = crossfilter(result);
    });
  }

}
