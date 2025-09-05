// src/utils.ts
import { TK13, TK14, /* other TK arrays */ } from './constants';
import { LunarDate } from './lunar-date';

/**
 * Discard the fractional part of a number
 */
export const INT = (d: number): number => Math.floor(d);

/**
 * Calculate Julian Day Number from Gregorian date
 */
export function jdn(day: number, month: number, year: number): number {
  const a = INT((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd = day + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  
  if (jd < 2299161) {
    jd = day + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  
  return jd;
}

/**
 * Convert Julian Day Number to Gregorian date
 */
export function jdn2date(jd: number): [number, number, number, number] {
  let A: number;
  const Z = jd;
  
  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = INT((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - INT(alpha / 4);
  }
  
  const B = A + 1524;
  const C = INT((B - 122.1) / 365.25);
  const D = INT(365.25 * C);
  const E = INT((B - D) / 30.6001);
  
  const day = INT(B - D - INT(30.6001 * E));
  const month = E < 14 ? E - 1 : E - 13;
  const year = month < 3 ? C - 4715 : C - 4716;
  
  return [day, month, year, jd];
}

/**
 * Decode lunar year information
 */
export function decodeLunarYear(year: number, k: number): LunarDate[] {
  const monthLengths = [29, 30];
  const regularMonths: number[] = new Array(12);
  const offsetOfTet = k >> 17;
  const leapMonth = k & 0xf;
  const leapMonthLength = monthLengths[k >> 16 & 0x1];
  const solarNY = jdn(1, 1, year);
  let currentJD = solarNY + offsetOfTet;
  
  let j = k >> 4;
  for (let i = 0; i < 12; i++) {
    regularMonths[12 - i - 1] = monthLengths[j & 0x1];
    j >>= 1;
  }
  
  const ly: LunarDate[] = [];
  
  if (leapMonth === 0) {
    for (let mm = 1; mm <= 12; mm++) {
      ly.push(new LunarDate(1, mm, year, false, currentJD));
      currentJD += regularMonths[mm - 1];
    }
  } else {
    for (let mm = 1; mm <= leapMonth; mm++) {
      ly.push(new LunarDate(1, mm, year, false, currentJD));
      currentJD += regularMonths[mm - 1];
    }
    ly.push(new LunarDate(1, leapMonth, year, true, currentJD));
    currentJD += leapMonthLength;
    for (let mm = leapMonth + 1; mm <= 12; mm++) {
      ly.push(new LunarDate(1, mm, year, false, currentJD));
      currentJD += regularMonths[mm - 1];
    }
  }
  
  return ly;
}

/**
 * Get year information from lookup tables
 */
export function getYearInfo(year: number): LunarDate[] {
  let yearCode: number;
  
  if (year < 1300) {
    yearCode = TK13[year - 1200];
  } else if (year < 1400) {
    yearCode = TK14[year - 1300];
  } else {
    // Add other conditions for TK15-TK22
    throw new Error(`Year ${year} is not supported`);
  }
  
  return decodeLunarYear(year, yearCode);
}
