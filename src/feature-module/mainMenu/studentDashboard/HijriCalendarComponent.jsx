import React, { useState } from "react";
import { HijriCalendar } from "./HijriCalendar";

const HijriCalendarComponent = () => {
  const [year, setYear] = useState(1445);
  const [month, setMonth] = useState(0); // 0 = Moharram
  const hijriCalendar = new HijriCalendar(year, month);
  console.log("0-0-0-0-", hijriCalendar);
  const [date, setDate] = useState(new Date());
  const goToPreviousMonth = () => {
    const prev = hijriCalendar.previousMonth();
    setYear(prev.getYear());
    setMonth(prev.getMonth());
  };

  const goToNextMonth = () => {
    const next = hijriCalendar.nextMonth();
    setYear(next.getYear());
    setMonth(next.getMonth());
  };

  return (
    <div>
      <h2>Hijri Calendar</h2>
      <p>Month: {HijriCalendar.fromGregorian(date).month}</p>
      <p>Month: {HijriCalendar.fromGregorian(date).date}</p>

      <p>Month: {HijriCalendar.fromGregorian(date).year}</p>
    </div>
  );
};

export default HijriCalendarComponent;
