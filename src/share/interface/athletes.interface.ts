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

export interface AthletesPerYear {
  year: Date;
  season: string;
  count: number;
}

export interface GroupItem<TValue> {
  key: string;
  value: TValue;
}

export interface MyInterface {
  age: number;
  sex: string;
  count: number;
}
