import { Injectable } from '@angular/core';
import { dsv, DSVParsedArray } from 'd3';
import { Athletes } from '../interface/athletes.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getData(): Promise<DSVParsedArray<Athletes>> {
    return dsv(',', '/assets/athlete_events.csv', row => ({
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
    }));
  }
}
