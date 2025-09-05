// src/lunar-calendar.ts
import { LunarDate } from './lunar-date';
import { getLunarDate, getSolarDate, getYearCanChi, getDayCanChi, getMonthCanChi } from './core';
import { TUAN, TIET_KHI } from './constants';
import { jdn } from './utils';
import type { LunarDateInfo, SolarDateInfo } from './types';

export class LunarCalendar {
  private _lunarDate: LunarDate;
  private _solarDate: SolarDateInfo;

  constructor(day: number, month: number, year: number, isLunar: boolean = false) {
    if (isLunar) {
      this._lunarDate = new LunarDate(day, month, year, false, 0);
      this._solarDate = getSolarDate(day, month, year);
    } else {
      this._solarDate = { day, month, year, jd: jdn(day, month, year) };
      this._lunarDate = getLunarDate(day, month, year);
    }
  }

  static fromSolar(day: number, month: number, year: number): LunarCalendar {
    return new LunarCalendar(day, month, year, false);
  }

  static fromLunar(day: number, month: number, year: number, leap: boolean = false): LunarCalendar {
    const calendar = new LunarCalendar(day, month, year, true);
    if (leap) {
      calendar._lunarDate.leap = true;
    }
    return calendar;
  }

  static today(): LunarCalendar {
    const now = new Date();
    return LunarCalendar.fromSolar(now.getDate(), now.getMonth() + 1, now.getFullYear());
  }

  get lunarDate(): LunarDate {
    return this._lunarDate;
  }

  get solarDate(): SolarDateInfo {
    return this._solarDate;
  }

  get yearCanChi(): string {
    return getYearCanChi(this._lunarDate.year);
  }

  get dayCanChi(): string {
    return getDayCanChi(this._solarDate.jd);
  }

  get monthCanChi(): string {
    return getMonthCanChi(this._lunarDate.month, this._lunarDate.year);
  }

  get dayOfWeek(): string {
    const dayIndex = (this._solarDate.jd + 1) % 7;
    return TUAN[dayIndex];
  }

  formatLunar(): string {
    return this._lunarDate.toString();
  }

  formatSolar(): string {
    return `${this._solarDate.day}/${this._solarDate.month}/${this._solarDate.year}`;
  }

  toString(): string {
    return `Solar: ${this.formatSolar()}, Lunar: ${this.formatLunar()}`;
  }
}