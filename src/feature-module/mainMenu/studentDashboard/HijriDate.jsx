export class HijriDate {
    static KABISA_YEAR_REMAINDERS = [2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29];
    static DAYS_IN_YEAR = [30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325];
    static DAYS_IN_30_YEARS = [
      354,  708, 1063, 1417, 1771, 2126, 2480, 2834,  3189,  3543,
      3898, 4252, 4606, 4961, 5315, 5669, 6024, 6378,  6732,  7087,
      7441, 7796, 8150, 8504, 8859, 9213, 9567, 9922, 10276, 10631
    ];
  
    static MONTH_NAMES = {
      long: {
        en: [
          "Moharram al-Haraam", "Safar al-Muzaffar", "Rabi al-Awwal", "Rabi al-Aakhar",
          "Jumada al-Ula", "Jumada al-Ukhra", "Rajab al-Asab", "Shabaan al-Karim",
          "Ramadaan al-Moazzam", "Shawwal al-Mukarram", "Zilqadah al-Haraam", "Zilhaj al-Haraam"
        ]
      },
      short: {
        en: ["Moharram", "Safar", "Rabi I", "Rabi II", "Jumada I", "Jumada II",
             "Rajab", "Shabaan", "Ramadaan", "Shawwal", "Zilqadah", "Zilhaj"]
      }
    };
  
    constructor(year, month, day) {
      this.year = year;
      this.month = month;
      this.day = day;
    }
  
    getYear() { return this.year; }
    getMonth() { return this.month; }
 static   getDate() { return this.day; }
  
    
    static fromGregorian = function (date) {
        console.log("this is a date from fromGregorian date", date)
    // return this.fromAJD("ghfh");
        
    return this.fromAJD(this.gregorianToAJD(date));
  };


      // return Astronomical Julian Date corresponding to this Hijri Date object
  static  fromAJD = function (ajd) {
    //   return "soemthing "
    var year,
        month,
        date,
        i = 0,
        left = Math.floor(ajd - 1948083.5),
        y30 = Math.floor(left / 10631.0);

    left -= y30*10631;
    while (left > this.DAYS_IN_30_YEARS[i]) {
      i += 1;
    }

    year = Math.round(y30*30.0 + i);
    if (i > 0) {
      left -= this.DAYS_IN_30_YEARS[i - 1];
    }
    i = 0;
    while (left > this.DAYS_IN_YEAR[i]) {
      i += 1;
    }
    month = Math.round(i);
    date = (i > 0) ? Math.round(left - this.DAYS_IN_YEAR[i - 1]) : Math.round(left);
return {year, month, date};
    // return new hijriDate(year, month, date);
  };
    
    
  static isJulian = function (date) {
    if (date.getFullYear() < 1582) {
      return true;
    } else if (date.getFullYear() === 1582) {
      if (date.getMonth() < 9) {
        return true;
      } else if (date.getMonth() === 9) {
        if (date.getDate() < 5) {
          return true;
        }
      }
    }
    return false;
  };
    
     static  gregorianToAJD = function (date) {
        var a, b,
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate()
                + date.getHours()/24
                + date.getMinutes()/1440
                + date.getSeconds()/86400
                + date.getMilliseconds()/86400000;
        if (month < 3) {
          year--;
          month += 12;
        }
        if (this.isJulian(date)) {
          b = 0;
        } else {
          a = Math.floor(year / 100);
          b = 2 - a + Math.floor(a / 4);
        }
        return Math.floor(365.25*(year + 4716)) + Math.floor(30.6001*(month + 1)) + day + b - 1524.5;
      };

    static getMonthName(month) {
      return HijriDate.MONTH_NAMES.long.en[month];
    }
  
    static getShortMonthName(month) {
      return HijriDate.MONTH_NAMES.short.en[month];
    }
  
    static isKabisa(year) {
      return HijriDate.KABISA_YEAR_REMAINDERS.includes(year % 30);
    }
  
    static daysInMonth(year, month) {
      return ((month === 11 && HijriDate.isKabisa(year)) || (month % 2 === 0)) ? 30 : 29;
    }
  }
  