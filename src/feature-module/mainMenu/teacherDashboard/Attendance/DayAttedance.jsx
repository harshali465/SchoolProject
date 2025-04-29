


import React, { useContext, useEffect, useRef, useState } from "react";
import { teacherAttendance } from "../../../../core/data/json/teacher_attendance";
import { TableData } from "../../../../core/data/interface";
import { Link, useNavigate } from "react-router-dom";
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
const DayAttedance = () => {
  const [collecIds, setcollecIds] = useState([]);
  const { authState } = useContext(AuthContext);
  const academicYearId = localStorage.getItem("academicYearId");
  const [selectedDate, setSelectedDate] = useState("");
  //   filter states
  const [search, setSearch] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  //   pagination

  const navigate = useNavigate();
  const [allTag, setallTag] = useState([]);
  const [loading, setLoading] = useState(false);
  const upcomingyear = localStorage.getItem("upcomingyear");

  //new states
  const [data, setData] = useState([]);
  const [dayType, setDayType] = useState("");

  const [Tag, setTag] = useState("");

  const [alldayTagText, setallDayTagText] = useState("");

  const [dayTag, setDayTag] = useState({ value: "", label: "Select Day Type" });
  const [attendanceTag, setAttendanceTag] = useState({
    value: "",
    label: "Attendance Tag",
  });
  const dayTagOptions = [
    { value: "", label: "Select Day Type" },
    ...(Array.isArray(alldayTagText)
      ? alldayTagText.map((d) => ({
          value: d._id,
          label: d.type,
        }))
      : []),
  ];

  const attendanceTagOptions = [
    { value: "", label: "Attendance Tag" },
    ...(Array.isArray(allTag)
      ? allTag.map((d) => ({
          value: d._id,
          label: d.tag,
        }))
      : []),
  ];
  const redirectto = () => {
    navigate("/student/attendance/certificates");
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date",

      render: (_, render) => moment(render?.createdAt).format("MMM D"),
    },
    {
      title: "Day Type",
      dataIndex: "day_type",
      render: (_, render) => render?.day_type?.type,
    },

    {
      title: "Scan Source",
      dataIndex: "scan_source",
      // Access nested field `firstName`
    },
    {
      title: "TimeStamp",
      dataIndex: "time",

      render: (_, render) => render?.time,

      // sorter: (a, b) => a.user_type.localeCompare(b.user_type),
    },
    {
      title: "Attendance Tag",
      dataIndex: "tag",
      render: (_, render) => render?.tag?.tag,

      // sorter: (a, b) => a.user_type.localeCompare(b.user_type),
    },
    // {
    //   title: "Action",

    //   render: (_, record) => (
    //     <button
    //       className=" btn btn-outline-success"
    //       onClick={() =>
    //         navigate("/attendance/attendancelisting/view", {
    //           state: {
    //             date: record?.date,
    //             dayType: record?.day_type?.type,
    //           },
    //         })
    //       }
    //     >
    //       {" "}
    //       View{" "}
    //     </button>
    //   ),
    // },
  ];
  const getClassAttendance = async (page = 1, pageSize = 10) => {
    const studentId = localStorage.getItem("userId");
    // &academicYearId=${
    //   academicYearId == authState?.startYearId
    //     ? academicYearId
    //     : authState?.startYearId
    // }
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/attendance/user-attendance/${localStorage.getItem(
          "userId"
        )}?tagId=${dayTag.value ? dayTag.value : ""}&dayTypeId=${
          attendanceTag.value ? attendanceTag.value : ""
        }&startDate=${
          startDate ? moment(startDate).format("YYYY-MM-DD") : ""
        }&endDate=${
          endDate ? moment(endDate).format("YYYY-MM-DD") : ""
        }&search=${search}
        `,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("respnse", response);
      setData(response?.data?.data);

      console.log("this is a resposne", response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (startDate) {
      if (endDate) {
        getClassAttendance();
      }
    } else {
      getClassAttendance();
    }
  }, [startDate, endDate, attendanceTag, dayTag, search]);

  const getDayTag = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/day-type`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setallDayTagText(res?.data?.data?.docs);

      if (res.data && res.data.dayTag) {
      } else {
        console.warn("Unexpected response structure:", res);
      }
    } catch (error) {
      console.error("Error fetching day type:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const getTag = async () => {
    setLoading(true); // Start loading state for the button

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/tags`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setallTag(res?.data?.data?.docs);
    } catch (error) {
      console.error("Error fetching day type:", error.message || error);
    } finally {
      setLoading(false); // Stop loading state regardless of success or error
    }
  };
  useEffect(() => {
    getDayTag();
    getTag();
  }, []);

  const [pointsList, setPointsList] = useState([]);

  const token = localStorage.getItem("accessToken");

  const routes = all_routes;
  const [leaveType, setLeaveType] = useState("");
  const [leaveList, setleaveList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");

  const dropdownMenuRef = useRef(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

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
                 Day Attendence
                </h3>
              </div>
              {/* <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <div className="mb-2">
                  <Link className="btn btn-primary">
                    <i class="ti ti-file-certificate me-2"></i>
                    View Certificate
                  </Link>
                </div>
              </div> */}
            </div>
            {/* /Page Header */}
            {/* Teacher Attendence List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3"> Day Attendence List</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setdateRange(update);
                      }}
                      dateFormat="dd-MM-yyyy"
                      isClearable={true}
                      className="date-range-leave"

                      placeholderText="Select Date Range"
                    />
                  </div>

                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <CommonSelect
                      value={dayTag}
                      onChange={(selectedOption) => setDayTag(selectedOption)}
                      options={dayTagOptions}
                      placeholder="Select Day Type"
                    />
                  </div>

                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <CommonSelect
                      value={attendanceTag}
                      onChange={(selectedOption) =>
                        setAttendanceTag(selectedOption)
                      }
                      options={attendanceTagOptions}
                      placeholder="Attendance Tag"
                    />
                  </div>

                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <input
                      style={{ paddingLeft: "12px" }}
                      className="form-control"
                      type="text"
                      placeholder="Search by keyword"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />{" "}
                  </div>

                  <div className="input-icon-start  me-2 position-relative">
                    <Link
                      to="#"
                      className="btn btn-light"
                      style={{ marginBottom: "17px" }}
                      onClick={() => {
                        setdateRange([null, null]);
                        setDayTag({ value: "", label: "Select Day Type" });
                        setAttendanceTag({
                          value: "",
                          label: "Attendance Tag",
                        });
                        setSearch("");
                      }}
                    >
                      Reset
                    </Link>
                  </div>

                  {/* <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                    </Link>
                    <div
                      className="dropdown-menu drop-width"
                      ref={dropdownMenuRef}
                    >
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Day Type</label>
                                <CommonSelect
                                  className="select"
                                  options={[
                                    { value: "", label: "Select Day Type" },
                                    ...(alldayTagText
                                      ? alldayTagText.map((data) => ({
                                          value: data?._id,
                                          label: data?.type,
                                        }))
                                      : []),
                                  ]}
                                  value={
                                    dayTag
                                      ? {
                                          value: dayTag,
                                          label:
                                            alldayTagText?.find(
                                              (item) => item._id === dayTag
                                            )?.type || dayTag,
                                        }
                                      : { value: "", label: "Select Day Type" }
                                  }
                                  onChange={(e) => setDayTag(e ? e.value : "")}
                                />

                               
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Attendance Tag</label>

                                <CommonSelect
  className="select"
  options={[
    { value: "", label: "Attendance Tag" },
    ...(allTag
      ? allTag.map((data) => ({
          value: data?._id,
          label: data?.tag,
        }))
      : []),
  ]}
  value={
    Tag
      ? { value: Tag, label: allTag?.find(item => item._id === Tag)?.tag || Tag }
      : { value: "", label: "Attendance Tag" }
  }
  onChange={(e) => setTag(e ? e.value : "")}
/>

                              </div>
                            </div>

                          
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                                                  <Link to="#" className="btn btn-light me-3" onClick={() => {
                                                    
                          }}>
                            Reset
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div> */}
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

export default DayAttedance;
