// src/lunar-date.ts
import type { LunarDateInfo, SolarDateInfo } from './types';

export class LunarDate implements LunarDateInfo {
  public day: number;
  public month: number;
  public year: number;
  public leap: boolean;
  public jd: number;

  constructor(day: number, month: number, year: number, leap: boolean, jd: number) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.leap = leap;
    this.jd = jd;
  }

  toString(): string {
    const leapStr = this.leap ? ' (nhuận)' : '';
    return `${this.day}/${this.month}/${this.year}${leapStr}`;
  }

  isValid(): boolean {
    return this.day > 0 && this.month > 0 && this.year > 0;
  }

  equals(other: LunarDate): boolean {
    return this.day === other.day &&
           this.month === other.month &&
           this.year === other.year &&
           this.leap === other.leap;
  }
}