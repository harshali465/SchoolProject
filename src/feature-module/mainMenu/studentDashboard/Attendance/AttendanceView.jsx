import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { teacherAttendance } from "../../../../core/data/json/teacher_attendance";
import { TableData } from "../../../../core/data/interface";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { notification, Table } from "antd";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  attendance,
  studentclass,
  studentName,
  teacherId,
} from "../../../../core/common/selectoption/selectoption";
import TooltipOption from "../../../../core/common/tooltipOption";
import { all_routes } from "../../../router/all_routes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import { AuthContext } from "../../../helper/AuthState";
const AttendanceListingView = () => {
  const location = useLocation();
  const formattedDate = location?.state?.date
    ? moment(location.state.date).format("YYYY-MM-DD")
    : "";

  const { authState } = useContext(AuthContext);
  const academicYearId = localStorage.getItem("academicYearId");
  const [search, setSearch] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  //new states
  const [data, setData] = useState([]);

  const columns = [
    {
      title: "S.No",
      key: "sno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Class Start Time",

      render: (_, render) => render?.startTime,
    },
    {
      title: "Class End Time",
      dataIndex: "day_type",
      render: (_, render) => render?.endTime,
    },

    {
      title: "Subject",
      dataIndex: "scan_source",
      render: (_, render) => render?.subjectId?.subject,
    },
    {
      title: "Timestamp", 
      dataIndex: "updatedAt",
      render: (_, render) =>
        new Date(render?.updatedAt).toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata", 
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, 
        }),
    },
    {
      title: "Attendance Tag",
      dataIndex: "time",

      render: (_, render) => render?.students?.[0]?.tag?.tag,
    },
  ];
  const getClassAttendance = async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/attendance/student/class-attendance/${localStorage.getItem(
          "userId"
        )}?date=${formattedDate ? formattedDate : ""}&academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  console.log("thisi s a reseoinse" , response?.data?.data)
      setData(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClassAttendance();
  }, [formattedDate, academicYearId, authState?.startYearId]);

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-flex custom-responsive align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1" style={{ fontSize: "x-large" }}>
                  Attendence
                </h3>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <div className="mb-2">
                  <Link
                    className="btn btn-light"
                    to={"/attendance/attendancelisting"}
                  >
                    Back
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Attendence List</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <DatePicker
                      selected={formattedDate ? new Date(formattedDate) : null}
                      disabled
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select Date Range"
                    />
                  </div>

                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <input
                      style={{ paddingLeft: "12px" }}
                      className="form-control"
                      type="text"
                      placeholder="Search by keyword"
                      value={location?.state?.dayType}
                      disabled
                    />{" "}
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default AttendanceListingView;
