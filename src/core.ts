// src/core.ts
import { CAN, CHI, FIRST_DAY, LAST_DAY } from './constants';
import { LunarDate } from './lunar-date';
import { getYearInfo, jdn, jdn2date } from './utils';
import type { SolarDateInfo } from './types';

/**
 * Find lunar date from Julian Day Number
 */
function findLunarDate(jd: number, ly: LunarDate[]): LunarDate {
  if (jd > LAST_DAY || jd < FIRST_DAY || ly[0].jd > jd) {
    return new LunarDate(0, 0, 0, false, jd);
  }
  
  let i = ly.length - 1;
  while (jd < ly[i].jd) {
    i--;
  }
  
  const off = jd - ly[i].jd;
  return new LunarDate(ly[i].day + off, ly[i].month, ly[i].year, ly[i].leap, jd);
}

/**
 * Convert solar date to lunar date
 */
export function getLunarDate(day: number, month: number, year: number): LunarDate {
  if (year < 1200 || year > 2199) {
    return new LunarDate(0, 0, 0, false, 0);
  }
  
  let ly = getYearInfo(year);
  const jd = jdn(day, month, year);
  
  if (jd < ly[0].jd) {
    ly = getYearInfo(year - 1);
  }
  
  return findLunarDate(jd, ly);
}

/**
 * Convert lunar date to solar date
 */
export function getSolarDate(day: number, month: number, year: number, leap: boolean = false): SolarDateInfo {
  if (year < 1200 || year > 2199) {
    return { day: 0, month: 0, year: 0, jd: 0 };
  }
  
  const ly = getYearInfo(year);
  let lm = ly[month - 1];
  
  if (lm.month !== month) {
    lm = ly[month];
  }
  
  // Handle leap month
  if (leap && month < ly.length) {
    const leapMonth = ly.find(m => m.month === month && m.leap);
    if (leapMonth) {
      lm = leapMonth;
    }
  }
  
  const ld = lm.jd + day - 1;
  const [d, m, y, jd] = jdn2date(ld);
  
  return { day: d, month: m, year: y, jd };
}

/**
 * Get Can Chi (Heavenly Stems and Earthly Branches) for a given year
 */
export function getYearCanChi(year: number): string {
  const canIndex = (year + 6) % 10;
  const chiIndex = (year + 8) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

/**
 * Get Can Chi for a given day
 */
export function getDayCanChi(jd: number): string {
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

/**
 * Get Can Chi for a given month
 */
export function getMonthCanChi(month: number, year: number): string {
  const yearCanIndex = (year + 6) % 10;
  const monthCanIndex = (yearCanIndex * 2 + month) % 10;
  const monthChiIndex = (month + 1) % 12;
  return `${CAN[monthCanIndex]} ${CHI[monthChiIndex]}`;
}