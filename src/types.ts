// src/types.ts
export interface LunarDateInfo {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

export interface SolarDateInfo {
  day: number;
  month: number;
  year: number;
  jd: number;
}

export type CanChiIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ChiIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;