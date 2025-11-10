export interface WeatherData {
  region: string;
  parameter: 'Tmax' | 'Tmin' | 'Rainfall' | 'Sunshine';
  year: number;
  month: string;
  value: number;
}

export interface StatisticsData {
  average: number;
  max: number;
  min: number;
}

export interface FilterOptions {
  region: string;
  parameter: 'Tmax' | 'Tmin' | 'Rainfall' | 'Sunshine';
  startYear: number;
  endYear: number;
  startMonth: string;
  endMonth: string;
}
