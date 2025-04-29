import { HijriDate } from "./HijriDate";

export class HijriCalendar {
    static MIN_YEAR = 1000;
    static MAX_YEAR = 3000;
  
    constructor(year, month, iso8601 = false) {
        console.log("year" ,year)
      this.year = year;
      this.month = month;
      this.iso8601 = iso8601;
    }
  
    getYear() { return this.year; }
    getMonth() { return this.month; }
    isISO() { return this.iso8601; }
  
    static getMinYear() { return HijriCalendar.MIN_YEAR; }
    static getMaxYear() { return HijriCalendar.MAX_YEAR; }
  
    static dayOfWeek(year, month , date) {
    //     let hijriDate = new HijriDate(year, month, date);
    //     console.log("this date hijri"  ,hijriDate)
    //   let offset =  1.5; // this.iso8601 ? 0.5 :
      return  HijriDate.getDate();
    }
    static fromGregorian(date) {
          console.log("HijriDate.fromGregorian(date)" , HijriDate.fromGregorian(date))
          return  HijriDate.fromGregorian(date);
        }

    
  
    previousMonth() {
      let year = (this.month === 0 && this.year > HijriCalendar.MIN_YEAR) ? this.year - 1 : this.year;
      let month = this.month === 0 ? 11 : this.month - 1;
      return new HijriCalendar(year, month, this.iso8601);
    }
  
    nextMonth() {
      let year = (this.month === 11 && this.year < HijriCalendar.MAX_YEAR) ? this.year + 1 : this.year;
      let month = this.month === 11 ? 0 : this.month + 1;
      return new HijriCalendar(year, month, this.iso8601);
    }
  }
  