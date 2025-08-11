<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Using @hebcal/core JavaScript Library for Hebrew Calendar Integration

## Overview

The **@hebcal/core** library provides a powerful JavaScript solution to replace REST API calls for Hebrew calendar functionality. This library offers comprehensive support for Hebrew event names and date conversions, making it an ideal replacement for your current API-based approach.

## Installation and Setup

### Basic Installation

```bash
npm install @hebcal/core
```


### For Additional Hebrew Language Support

```bash
npm install @hebcal/locales
```

The `@hebcal/locales` package provides additional language translations beyond the built-in Hebrew support.[^1]

## Key Features for Hebrew Support

### Built-in Language Options[^2][^3]

- **`en`** - Default Sephardic transliterations (e.g., "Shabbat")
- **`ashkenazi`** - Ashkenazi transliterations (e.g., "Shabbos")
- **`he`** - Hebrew with nikud (e.g., "שַׁבָּת")
- **`he-x-NoNikud`** - Hebrew without nikud (e.g., "שבת")


### Event Rendering with render() Method

Every Event object has a `render()` method that accepts a locale parameter. For example:[^4]

```javascript
const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
ev.render('en');        // 'Shavuot'
ev.render('he');        // 'שָׁבוּעוֹת'
ev.render('ashkenazi'); // 'Shavuos'
```


## Complete Implementation Guide

### 1. Basic Date Conversion (Replacing REST API)

```javascript
import { HebrewCalendar, HDate, Location, Event } from '@hebcal/core';
import '@hebcal/locales'; // Optional for additional languages

// Convert Gregorian to Hebrew date
function gregorianToHebrewDate(year, month, day) {
    const gregorianDate = new Date(year, month - 1, day);
    const hebrewDate = new HDate(gregorianDate);
    
    return {
        gregorianDate: gregorianDate.toLocaleDateString(),
        hebrewDate: hebrewDate.toString(),                    // English: "17th of Av, 5785"
        hebrewDateHebrew: hebrewDate.render('he'),           // Hebrew: "17 אָב, 5785"
        hebrewDateNoNikud: hebrewDate.render('he-x-NoNikud'), // No nikud: "17 אב, 5785"
        day: hebrewDate.getDate(),
        month: hebrewDate.getMonth(),
        monthName: hebrewDate.getMonthName(),
        year: hebrewDate.getFullYear()
    };
}
```


### 2. Getting Events in Hebrew

```javascript
// Get events for a specific date with Hebrew names
function getEventsForDate(gregorianDate, locale = 'he') {
    const hdate = new HDate(gregorianDate);
    
    const options = {
        year: gregorianDate.getFullYear(),
        month: gregorianDate.getMonth() + 1,
        locale: locale,  // 'he' for Hebrew events
        sedrot: true,    // Torah portions
        omer: true,      // Omer counting
        candlelighting: false
    };
    
    const events = HebrewCalendar.calendar(options);
    
    // Filter events for the specific date
    const dateEvents = events.filter(ev => {
        const eventDate = ev.getDate();
        return eventDate.getFullYear() === hdate.getFullYear() &&
               eventDate.getMonth() === hdate.getMonth() &&
               eventDate.getDate() === hdate.getDate();
    });
    
    return dateEvents.map(event => ({
        date: event.getDate().toString(),
        dateHebrew: event.getDate().render('he'),
        title: event.render(locale),           // Hebrew event name
        titleEnglish: event.render('en'),      // English for reference
        description: event.getDesc(),          // Stable English description
        categories: event.getCategories(),
        emoji: event.getEmoji()
    }));
}
```


### 3. Comprehensive Hebrew Calendar Data

```javascript
function getHebrewCalendarData(gregorianDate) {
    const hdate = new HDate(gregorianDate);
    
    const options = {
        year: gregorianDate.getFullYear(),
        month: gregorianDate.getMonth() + 1,
        locale: 'he',
        sedrot: true,
        omer: true
    };
    
    const events = HebrewCalendar.calendar(options);
    const todayEvents = events.filter(ev => {
        const eventDate = ev.getDate();
        return eventDate.getFullYear() === hdate.getFullYear() &&
               eventDate.getMonth() === hdate.getMonth() &&
               eventDate.getDate() === hdate.getDate();
    });
    
    return {
        // Date in multiple formats
        gregorianDate: gregorianDate.toLocaleDateString(),
        hebrewDate: {
            english: hdate.toString(),                    // "17th of Av, 5785"
            hebrew: hdate.render('he'),                  // "17 אָב, 5785"
            hebrewNoNikud: hdate.render('he-x-NoNikud'), // "17 אב, 5785"
            ashkenazi: hdate.render('ashkenazi')         // Ashkenazi transliteration
        },
        
        // Events in Hebrew
        events: todayEvents.map(event => ({
            hebrew: event.render('he'),                  // "שַׁבָּת"
            hebrewNoNikud: event.render('he-x-NoNikud'), // "שבת"
            english: event.render('en'),                 // "Shabbat"
            ashkenazi: event.render('ashkenazi'),        // "Shabbos"
            description: event.getDesc(),                // Stable identifier
            categories: event.getCategories(),
            emoji: event.getEmoji()
        }))
    };
}
```


## Key Advantages Over REST API

### 1. **Performance Benefits**

- No network requests required
- Instant calculations
- Works offline
- Reduced latency


### 2. **Hebrew Language Support**

- Built-in Hebrew with nikud (`'he'`)
- Hebrew without nikud (`'he-x-NoNikud'`)
- Multiple transliteration options
- Consistent rendering across all event types


### 3. **Comprehensive Event Coverage**[^5]

- Major holidays (`maj=on`)
- Minor holidays (`min=on`)
- Rosh Chodesh (`nx=on`)
- Torah portions (`sedrot=true`)
- Omer counting (`omer=true`)
- Candle lighting times (`candlelighting=true`)


### 4. **Flexible Configuration**

```javascript
const options = {
    year: 2025,
    locale: 'he',           // Hebrew events
    sedrot: true,           // Torah readings
    omer: true,             // Omer count
    candlelighting: true,   // Shabbat times
    location: Location.lookup('Jerusalem'), // For location-specific times
    yomKippurKatan: true,   // Additional observances
    molad: true             // New moon announcements
};
```


## Practical Migration Steps

### 1. **Replace API Calls**

Instead of:

```javascript
fetch(`https://www.hebcal.com/hebcal?cfg=json&lg=he&...`)
```

Use:

```javascript
const events = HebrewCalendar.calendar({
    year: 2025,
    locale: 'he',
    sedrot: true,
    omer: true
});
```


### 2. **Hebrew Event Names**

The key advantage is that `event.render('he')` provides the Hebrew names you're seeking, such as:[^6]

- "שַׁבָּת" (Shabbat)
- "רֹאשׁ חוֹדֶשׁ" (Rosh Chodesh)
- "חֲנֻכָּה" (Chanukah)
- "פֶּסַח" (Pesach)


### 3. **Date Conversion**[^7]

Replace API date conversion calls with:

```javascript
// Gregorian to Hebrew
const hebrewDate = new HDate(new Date(2025, 7, 11));
console.log(hebrewDate.render('he')); // "17 אָב, 5785"

// Hebrew to Gregorian  
const gregDate = new HDate(17, 'Av', 5785).greg();
```


## Language Support Summary[^6]

The Hebcal system supports 13 different languages for event titles, with Hebrew options including:


| Locale Code | Description | Example |
| :-- | :-- | :-- |
| `he` | Hebrew with nikud | שַׁבָּת |
| `he-x-NoNikud` | Hebrew without nikud | שבת |
| `s` | Sephardic transliteration | Shabbat |
| `a` | Ashkenazi transliteration | Shabbos |

## Best Practices

### 1. **Error Handling**

```javascript
function safeHebrewDateConversion(year, month, day) {
    try {
        const gregorianDate = new Date(year, month - 1, day);
        if (isNaN(gregorianDate.getTime())) {
            throw new Error('Invalid date');
        }
        return new HDate(gregorianDate);
    } catch (error) {
        console.error('Date conversion error:', error.message);
        return null;
    }
}
```


### 2. **Consistent Locale Usage**

Always specify the locale parameter to ensure consistent Hebrew output:

```javascript
const hebrewEvents = events.map(ev => ev.render('he'));
```


### 3. **Stable Identifiers**

Use `event.getDesc()` for stable English identifiers that don't change between versions, while using `event.render('he')` for display purposes.

The @hebcal/core library provides a robust, offline-capable solution that fully replaces REST API functionality while offering comprehensive Hebrew language support for all Jewish calendar events and dates.[^8][^9][^10][^2]

<div style="text-align: center">⁂</div>

[^1]: https://github.com/hebcal/hebcal-locales

[^2]: https://www.npmjs.com/package/@hebcal/core/v/5.4.8

[^3]: https://www.npmjs.com/package/@hebcal/core/v/5.4.2

[^4]: https://hebcal.userecho.com/communities/1-general/topics?page=27

[^5]: https://www.hebcal.com/home/195/jewish-calendar-rest-api

[^6]: https://www.hebcal.com/home/4534/jewish-calendar-event-language-support

[^7]: https://www.hebcal.com/home/219/hebrew-date-converter-rest-api

[^8]: https://www.npmjs.com/package/@hebcal/core

[^9]: https://hebcal.github.io/api/core/index.html

[^10]: https://hebcal.github.io/api/core/classes/HebrewCalendar.html

[^11]: https://www.hebcal.com/home/4912/specifying-a-location-for-jewish-calendar-apis

[^12]: https://www.hebcal.com/holidays/

[^13]: https://hebcal.userecho.com/communities/1/topics/1369-is-there-a-way-to-combine-hebrew-dates-in-the-react-fullcalendar-board-that-wont-look-like-an-event

[^14]: https://www.hebcal.com/holidays/2025

[^15]: https://hebcal.github.io/api/core/classes/TimedEvent.html

[^16]: https://www.hebcal.com/converter

[^17]: https://stackoverflow.com/questions/49402793/angular-2-events-calendar-with-hebrew-and-jewish-dates

[^18]: https://www.hebcal.com

[^19]: https://github.com/hebcal/hebcal-js

[^20]: https://gist.github.com/mjradwin/0ebb62ac6fa0abf23964

[^21]: https://www.hebcal.com/hebcal/?v=1%3Byear%3D2025%3Bmonth%3Dx%3Bnx%3Don%3Bnh%3Don%3Bvis%3Don

[^22]: https://www.hebcal.com/home/developer-apis

[^23]: https://www.hebcal.com/hebcal

[^24]: https://www.hebcal.com/home/help

[^25]: https://www.hebcal.com/hebcal?v=1\&maj=on\&min=on\&nx=on\&mf=on\&ss=on\&mod=on\&o=on\&year=2025\&yt=G\&lg=s\&d=on\&c=on\&geonameid=281184\&=Jerusalem%2C+Israel\&b=40\&m=42\&geo=geoname\&i=on

[^26]: https://www.hebcal.com/home/184/javascript-jewish-calendar-example

[^27]: https://www.npmjs.com/package/@hebcal/core/v/3.24.1

[^28]: https://github.com/hebcal/hebcal-go

[^29]: https://www.hebcal.com/home/help/page/15

[^30]: https://pkg.go.dev/github.com/hebcal/hebcal-go/hebcal

[^31]: https://hebcal.github.io/api/hdate/classes/HDate.html

[^32]: https://pypi.org/project/hebcal/

[^33]: https://www.hebcal.com/home/help/page/3

[^34]: https://www.hebcal.com/home/category/general

[^35]: https://www.hebcal.com/home/category/developers

[^36]: https://hebcal.github.io/api/core/classes/Event.html\#render

[^37]: https://hebcal.github.io/api/core/types/CalOptions.html\#locale

[^38]: https://hebcal.github.io/api/core/types/OmerLang.html

[^39]: https://hebcal.github.io/api/core/classes/OmerEvent.html\#sefira

[^40]: https://hebcal.github.io/api/core/classes/OmerEvent.html\#gettodayis

[^41]: https://calendarconverter.wordpress.com

[^42]: https://github.com/hebcal/hebcal-icalendar

[^43]: https://www.npmjs.com/package/@hebcal/core/v/1.1.4

[^44]: https://stackoverflow.com/questions/67560172/need-help-getting-hebrew-date-in-react-native-app

[^45]: https://codesandbox.io/examples/package/@hebcal/core

[^46]: https://www.prog.co.il/threads/המרת-תאריך-לועזי-לעברי.671957/

[^47]: https://www.hebcal.com/home/help/page/5

[^48]: https://en.wikipedia.org/wiki/Hebrew_calendar

[^49]: https://www.hebcal.com/home/category/developers/page/3

