export interface Athletes {
  age: number;
  city: string;
  event: string;
  games: string;
  height: number;
  weight: number;
  medal: string;
  name: string;
  season: string;
  sex: string;
  sport: string;
  team: string;
  year: number;
}

export interface AthletesPerYearGroupValue {
  year: Date;
  season: string;
  count: number;
}

export interface AthletesPerYearGroupItem<TValue> {
  key: string;
  value: TValue;
}
