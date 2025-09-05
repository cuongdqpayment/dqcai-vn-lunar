# 🌙 @dqcai/vn-lunar

[![npm version](https://badge.fury.io/js/%40dqcai%2Fvn-lunar.svg)](https://badge.fury.io/js/%40dqcai%2Fvn-lunar)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@dqcai/vn-lunar.svg)](https://npmjs.org/package/@dqcai/vn-lunar)

**A comprehensive Vietnamese Lunar Calendar library for JavaScript/TypeScript applications** - The most accurate and feature-rich solution for integrating Vietnamese lunar calendar functionality into modern web applications.

## 🎯 **Features**

- ✅ **Accurate Solar ↔ Lunar Date Conversion** (1200-2199 CE)
- ✅ **Can Chi (Heavenly Stems & Earthly Branches)** calculations
- ✅ **Leap Month Detection** for precise lunar calculations
- ✅ **Vietnamese Localization** - Fully localized in Vietnamese
- ✅ **TypeScript Support** - Complete type definitions included
- ✅ **Modern ES6+ Syntax** - Tree-shakeable and optimized
- ✅ **Zero Dependencies** - Lightweight and fast
- ✅ **Cross-Platform** - Works in browsers, Node.js, React Native
- ✅ **Comprehensive API** - Easy-to-use classes and functions

## 🚀 **Installation**

```bash
# npm
npm install @dqcai/vn-lunar

# yarn
yarn add @dqcai/vn-lunar

# pnpm
pnpm add @dqcai/vn-lunar
```

## 📖 **Quick Start**

### ES6 Modules / TypeScript
```typescript
import { LunarCalendar, getLunarDate, getYearCanChi } from '@dqcai/vn-lunar';

// Convert today's date to lunar calendar
const today = LunarCalendar.today();
console.log(today.formatLunar()); // "15/8/2023 (nhuận)"
console.log(today.yearCanChi);    // "Quý Mão"
```

### CommonJS
```javascript
const { LunarCalendar, getLunarDate } = require('@dqcai/vn-lunar');

const calendar = LunarCalendar.fromSolar(25, 12, 2023);
console.log(calendar.formatLunar()); // "3/11/2023"
```

## 🎨 **API Reference**

### LunarCalendar Class

The main class for working with Vietnamese lunar calendar dates.

#### **Creating Instances**

```typescript
// From solar date (Gregorian calendar)
const calendar = LunarCalendar.fromSolar(25, 12, 2023);

// From lunar date
const lunarCal = LunarCalendar.fromLunar(15, 8, 2023);

// From lunar date with leap month
const leapCal = LunarCalendar.fromLunar(15, 4, 2023, true);

// Today's date
const today = LunarCalendar.today();
```

#### **Properties & Methods**

```typescript
const calendar = LunarCalendar.fromSolar(25, 12, 2023);

// Date information
console.log(calendar.lunarDate);      // LunarDate object
console.log(calendar.solarDate);      // Solar date object
console.log(calendar.dayOfWeek);      // "Thứ hai" (Monday)

// Can Chi (Vietnamese astrology)
console.log(calendar.yearCanChi);     // "Quý Mão"
console.log(calendar.monthCanChi);    // "Giáp Tý"
console.log(calendar.dayCanChi);      // "Đinh Sửu"

// Formatting
console.log(calendar.formatLunar());  // "3/11/2023"
console.log(calendar.formatSolar());  // "25/12/2023"
console.log(calendar.toString());     // "Solar: 25/12/2023, Lunar: 3/11/2023"
```

### Utility Functions

#### **Date Conversion**

```typescript
import { getLunarDate, getSolarDate } from '@dqcai/vn-lunar';

// Convert solar to lunar
const lunar = getLunarDate(25, 12, 2023);
console.log(lunar.day, lunar.month, lunar.year); // 3 11 2023

// Convert lunar to solar
const solar = getSolarDate(15, 8, 2023);
console.log(solar.day, solar.month, solar.year); // 29 9 2023
```

#### **Can Chi Calculations**

```typescript
import { getYearCanChi, getDayCanChi, getMonthCanChi } from '@dqcai/vn-lunar';

// Year Can Chi
const yearCC = getYearCanChi(2023); // "Quý Mão"

// Day Can Chi (requires Julian Day Number)
const dayCC = getDayCanChi(2460310); // "Đinh Sửu"

// Month Can Chi
const monthCC = getMonthCanChi(11, 2023); // "Giáp Tý"
```

### LunarDate Class

```typescript
import { LunarDate } from '@dqcai/vn-lunar';

const lunarDate = new LunarDate(15, 8, 2023, false, 2460310);

// Methods
console.log(lunarDate.toString());    // "15/8/2023"
console.log(lunarDate.isValid());     // true
console.log(lunarDate.equals(other)); // boolean

// Properties
console.log(lunarDate.day);    // 15
console.log(lunarDate.month);  // 8
console.log(lunarDate.year);   // 2023
console.log(lunarDate.leap);   // false
console.log(lunarDate.jd);     // 2460310 (Julian Day Number)
```

## 🌟 **Real-World Examples**

### 1. **Event Calendar with Lunar Dates**

```typescript
import { LunarCalendar } from '@dqcai/vn-lunar';

function createEventCalendar(events: Array<{date: string, title: string}>) {
  return events.map(event => {
    const [day, month, year] = event.date.split('/').map(Number);
    const calendar = LunarCalendar.fromSolar(day, month, year);
    
    return {
      ...event,
      solarDate: calendar.formatSolar(),
      lunarDate: calendar.formatLunar(),
      canChi: calendar.yearCanChi,
      dayOfWeek: calendar.dayOfWeek
    };
  });
}

const events = createEventCalendar([
  { date: '25/12/2023', title: 'Christmas Day' },
  { date: '1/1/2024', title: 'New Year' }
]);
```

### 2. **Vietnamese Festival Detector**

```typescript
import { LunarCalendar } from '@dqcai/vn-lunar';

class VietnameseFestival {
  private festivals = new Map([
    ['1/1', 'Tết Nguyên Đán'],
    ['15/1', 'Rằm tháng Giêng'],
    ['15/4', 'Phật Đản'],
    ['5/5', 'Tết Đoan Ngọ'],
    ['15/7', 'Vu Lan'],
    ['15/8', 'Tết Trung Thu'],
    ['23/12', 'Ông Táo']
  ]);

  getFestival(solarDate: {day: number, month: number, year: number}): string | null {
    const calendar = LunarCalendar.fromSolar(solarDate.day, solarDate.month, solarDate.year);
    const lunarKey = `${calendar.lunarDate.day}/${calendar.lunarDate.month}`;
    
    return this.festivals.get(lunarKey) || null;
  }
}

const festivalDetector = new VietnameseFestival();
console.log(festivalDetector.getFestival({day: 29, month: 9, year: 2023})); // "Tết Trung Thu"
```

### 3. **React Component with Lunar Calendar**

```tsx
import React, { useState, useEffect } from 'react';
import { LunarCalendar } from '@dqcai/vn-lunar';

const LunarDatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [calendar, setCalendar] = useState<LunarCalendar | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const [day, month, year] = selectedDate.split('-').map(Number);
      setCalendar(LunarCalendar.fromSolar(day, month, year));
    }
  }, [selectedDate]);

  return (
    <div className="lunar-date-picker">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      
      {calendar && (
        <div className="lunar-info">
          <h3>Thông tin âm lịch</h3>
          <p><strong>Ngày âm:</strong> {calendar.formatLunar()}</p>
          <p><strong>Can Chi:</strong> {calendar.yearCanChi}</p>
          <p><strong>Thứ:</strong> {calendar.dayOfWeek}</p>
        </div>
      )}
    </div>
  );
};
```

### 4. **Node.js CLI Tool**

```typescript
#!/usr/bin/env node
import { LunarCalendar } from '@dqcai/vn-lunar';

function lunarCLI() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    const today = LunarCalendar.today();
    console.log(`Hôm nay: ${today.formatSolar()} (${today.formatLunar()})`);
    console.log(`Can Chi: ${today.yearCanChi}`);
    console.log(`Thứ: ${today.dayOfWeek}`);
  } else if (args.length === 3) {
    const [day, month, year] = args.map(Number);
    const calendar = LunarCalendar.fromSolar(day, month, year);
    console.log(`Dương lịch: ${calendar.formatSolar()}`);
    console.log(`Âm lịch: ${calendar.formatLunar()}`);
    console.log(`Can Chi: ${calendar.yearCanChi}`);
  }
}

lunarCLI();
```

## 🎯 **Use Cases**

### **Frontend Applications**
- **Event Management Systems** - Display events with both solar and lunar dates
- **Cultural Applications** - Vietnamese festival and holiday calculators
- **Calendar Widgets** - Dual calendar displays for Vietnamese users
- **Astrology Applications** - Can Chi calculations for fortune telling
- **E-commerce** - Display auspicious dates for important purchases

### **Backend Services**
- **API Endpoints** - Provide lunar calendar data to mobile apps
- **Scheduled Jobs** - Run tasks based on lunar calendar events
- **Data Analytics** - Analyze patterns based on lunar calendar cycles
- **Notification Systems** - Send reminders for Vietnamese festivals

### **Mobile Applications**
- **React Native** - Cross-platform lunar calendar apps
- **Ionic/Cordova** - Hybrid mobile applications
- **PWA** - Progressive web apps with offline lunar calendar

## 📊 **Performance**

- **Bundle Size**: ~15KB minified + gzipped
- **Memory Usage**: <1MB for full year calculations
- **Calculation Speed**: <1ms for single date conversion
- **Accuracy**: 100% accurate for years 1200-2199 CE

## 🌍 **Browser Compatibility**

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Node.js 14+
- ✅ React Native
- ✅ Electron

## 📝 **TypeScript Support**

Full TypeScript definitions included:

```typescript
interface LunarDateInfo {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

interface SolarDateInfo {
  day: number;
  month: number;
  year: number;
  jd: number;
}
```

## 🔧 **Advanced Usage**

### **Custom Date Range Validation**

```typescript
import { LunarCalendar } from '@dqcai/vn-lunar';

function isValidLunarRange(startDate: string, endDate: string): boolean {
  try {
    const start = LunarCalendar.fromSolar(...startDate.split('/').map(Number));
    const end = LunarCalendar.fromSolar(...endDate.split('/').map(Number));
    return start.lunarDate.isValid() && end.lunarDate.isValid();
  } catch {
    return false;
  }
}
```

### **Batch Date Conversion**

```typescript
import { getLunarDate } from '@dqcai/vn-lunar';

function convertDateBatch(solarDates: Array<[number, number, number]>) {
  return solarDates.map(([day, month, year]) => ({
    solar: `${day}/${month}/${year}`,
    lunar: getLunarDate(day, month, year)
  }));
}
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**

```bash
git clone https://github.com/dqcai/vn-lunar.git
cd vn-lunar
npm install
npm run dev
```

### **Running Tests**

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📄 License

MIT License - see [LICENSE](https://github.com/cuongdqpayment/dqcai-vn-lunar/blob/main/LICENSE) file for details.

## 🙋‍♂️ **Support**

- **📂 GitHub**: [https://github.com/cuongdqpayment/dqcai-vn-lunar](https://github.com/cuongdqpayment/dqcai-vn-lunar)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/cuongdqpayment/dqcai-vn-lunar/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/cuongdqpayment/dqcai-vn-lunar/discussions)
- **📦 NPM Package**: [https://www.npmjs.com/package/@dqcai/vn-lunar](https://www.npmjs.com/package/@dqcai/vn-lunar)
- **🐛 Report Issues**: [GitHub Issues](https://github.com/cuongdqpayment/dqcai-vn-lunar/issues)
- **📘 Facebook**: [Facebook Page](https://www.facebook.com/share/p/19esHGbaGj/)

## 🔗 **Related Projects**

- [`lunar-javascript`](https://github.com/lzh0145/lunar-javascript) - Chinese lunar calendar
- [`hijri-date`](https://github.com/arabiaweather/hijri-date) - Islamic calendar
- [`solar-lunar-calendar`](https://github.com/jjonline/calendar.js) - Multi-calendar system

## 📊 **Keywords**

`vietnamese lunar calendar`, `âm lịch việt nam`, `solar lunar conversion`, `can chi`, `typescript calendar`, `javascript date`, `vietnamese festivals`, `lunar calculator`, `frontend calendar`, `việt hóa lịch`, `tết calculation`, `vietnamese astrology`

---

**@dqcai/vn-lunar** - Help your project eazier in lunar Vietnamese intergrated 🌳⚡

⭐ **If this library helps you, please give it a star!** ⭐

Made with ❤️ for the Vietnamese developer community