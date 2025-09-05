// src/index.ts
import { getDayCanChi, getLunarDate, getMonthCanChi, getSolarDate, getYearCanChi } from './core';
import { LunarCalendar } from './lunar-calendar';
import { LunarDate } from './lunar-date';
import { decodeLunarYear } from './utils';

export { LunarDate } from "./lunar-date";
export { LunarCalendar } from "./lunar-calendar";
export {
  getLunarDate,
  getSolarDate,
  getYearCanChi,
  getDayCanChi,
  getMonthCanChi,
} from "./core";
export * from "./types";
export * from "./constants";
export { decodeLunarYear, getYearInfo } from "./utils";

// Default export for convenience
export default {
  LunarDate,
  LunarCalendar,
  getLunarDate,
  getSolarDate,
  getYearCanChi,
  getDayCanChi,
  getMonthCanChi,
  decodeLunarYear,
};
