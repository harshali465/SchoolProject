
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-bootstrap-daterangepicker";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";

const PredefinedDateRanges = ({ onDateChange, initialStartDate, initialEndDate }) => {
  const [state, setState] = useState({
    start: initialStartDate || null, // Use null initially
    end: initialEndDate || null,     // Use null initially
  });

  const { start, end } = state;
  useEffect(() => {
    setState({
      start: initialStartDate || null,
      end: initialEndDate || null,
    });
  }, [initialStartDate, initialEndDate]);
  const handleCallback = (startDate, endDate) => {
    const newStart = moment(startDate);
    const newEnd = moment(endDate);
    setState({ start: newStart, end: newEnd });
    onDateChange(newStart, newEnd); 
  };

  // Render label only if both start and end are not null
  const label = start && end
    ? `${moment(start).format("D MMMM, YYYY")} - ${moment(end).format("D MMMM, YYYY")}`
    : "Select a date range"; // When dates are null

  return (
    <DateRangePicker
      initialSettings={{
        // Omit startDate and endDate if they are null
        ...(start && { startDate: moment(start).toDate() }),
        ...(end && { endDate: moment(end).toDate() }),
        ranges: {
          Today: [moment().toDate(), moment().toDate()],
          Yesterday: [moment().subtract(1, "days").toDate(), moment().subtract(1, "days").toDate()],
          "Last 7 Days": [moment().subtract(6, "days").toDate(), moment().toDate()],
          "Last 30 Days": [moment().subtract(29, "days").toDate(), moment().toDate()],
          "This Month": [moment().startOf("month").toDate(), moment().endOf("month").toDate()],
          "Last Month": [
            moment().subtract(1, "month").startOf("month").toDate(),
            moment().subtract(1, "month").endOf("month").toDate(),
          ],
        },
      }}
      onCallback={handleCallback}
    >
      <div
        id="reportrange"
        style={{
          background: "#fff",
          cursor: "pointer",
          padding: "0.5rem 0.625rem",
          border: "1px solid #E9EDF4",
          width: "100%",
          borderRadius: "5px",
          fontSize: "14px",
          color: "#202C4B",
          height: "38px",
        }}
      >
        <i className="ti ti-calendar"></i>&nbsp;
        <span>{label}</span> {/* Display the label */}
      </div>
    </DateRangePicker>
  );
};

export default PredefinedDateRanges;
