import { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { AuthContext } from "../../../helper/AuthState";
import moment from "moment";
import { Modal, Box, IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import CommonSelect from "../../../../core/common/commonSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getClassAttendanceAPI } from "../../../../Api/AllApis";
import { useQuery } from "@tanstack/react-query";
const TodayAttendanceteacher = () => {
  const [token] = useState(localStorage.getItem("accessToken"));
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const location = useLocation();
  console.log("location?.state", location?.state);
  const { stage, grade, section } = location?.state
    ? location?.state
    : { stage: "", grade: "", section: "" };

  const { authState } = useContext(AuthContext);
  const academicYearId = localStorage.getItem("academicYearId");
  const [allStages, setAllStages] = useState([]);
  const [stages, setStages] = useState("");

  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);
  const [workingDay, setWorkingDay] = useState([]);

  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [filterStage, setFilterStage] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [dateRanges, setDateRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { Column } = Table;

  useEffect(() => {
    getStages();
    // getCouponList();
  }, []);

  useEffect(() => {
    if (stage && grade && section) {
      setFilterStage(stage);

      setFilterGrade(grade);
      setFilterSection(section);
    }
  }, [stage, grade, section]);

  useEffect(() => {
    if (filterStage) {
      getGrades(filterStage);
    }
  }, [filterStage]);

  useEffect(() => {
    if (filterSection) {
      getSections(filterGrade);
    }
  }, [filterGrade]);

  const getGrades = async (id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage/${id}/grade`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllGrades(res?.data?.records);
    } catch (error) {
      console.log(error);
    }
  };

  const getSections = async (id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage/${filterStage}/grade/${id}/section`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllSections(res?.data?.records);
    } catch (error) {
      console.log(error);
    }
  };

  const getStages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllStages(res?.data?.records);
    } catch (error) {
      console.log(error);
    }
  };

  const disabledDate = () => {
    return true;
  };

  const getMinDate = () => {
    if (!filterDateRange) return null;
    return moment(filterDateRange.split(" - ")[0]).toDate();
  };

  const getMaxDate = () => {
    if (!filterDateRange) return null;
    return moment(filterDateRange.split(" - ")[1]).toDate();
  };

  // useEffect(() => {

  //     getClassAttendance();

  // }, [filterDateRange , filterSection]);

  const handleClassSelect = () => {
    setOpen(false);
  };

  // const {
  //   data: classAttendanceData,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: [
  //     "attendanceList",
  //     pagination.current,
  //     pagination.pageSize,
  //     filterGrade,
  //     filterSection,
  //     academicYearId,
  //   ],
  //   queryFn: () =>
  //     getClassAttendanceAPI({
  //       page: pagination.current,
  //       pageSize: pagination.pageSize,
  //       filterGrade,
  //       filterSection,
  //       academicYearId,
  //       authState,
  //       token,
  //     }),
  //   keepPreviousData: true,
  //   refetchOnWindowFocus: false,
  //   enabled: !!(pagination.current && pagination.pageSize && academicYearId),
  //   onSuccess: (response) => {
  //     setPagination((prev) => ({
  //       ...prev,
  //       current: response?.currentPage || 1,
  //       pageSize: response?.limit || 10,
  //       total: response?.totalRecords || 0,
  //     }));
  //   },
  // });

  // useEffect(() => {
  //   if (classAttendanceData) {
  //     setData(classAttendanceData?.data);
  //   }
  // }, [classAttendanceData]);

  // console.log("this is a classAttendance", classAttendanceData);

  const getClassAttendance = async (page = 1, pageSize = 10) => {
    console.log("coming insdie the ting 1 1", data);
    setData([]);

    console.log("coming insdie the ting2 2", data);

    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/attendance/class-attendance?date=${moment().format(
          "YYYY-MM-DD"
        )}&teacherId=${localStorage.getItem('userId')}&assistantTeachers=&students=&subjectId=&gradeId=${
          filterGrade ? filterGrade : ""
        }&sectionId=${filterSection ? filterSection : ""}&academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId
        }&page=${page}&limit=${pageSize}
        `,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setData(response?.data?.data?.data);
      setPagination({
        current: response?.data?.data?.currentPage,
        pageSize: response?.data?.data?.limit,
        total: response?.data?.data?.totalRecords,
      });
      console.log("coming insdie the ting3 3", data);

      console.log("this is a resposne", response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (filterSection) {
      getClassAttendance();
    }
  }, [filterSection, section]);

  const handleTableChange = (pag) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current,
      pageSize: pag.pageSize,
    }));
  };

  useEffect(() => {
    getStages();
  }, []);

  const columns = [
    {
      title: "Grade",
      dataIndex: "name",
      render: (_, render) => render?.grade,
    },
    {
      title: "Section",
      dataIndex: "name",
      render: (_, render) => render?.section,
    },

    {
      title: "Lecture Time",
      render: (_, record) =>
        `${record?.startTime || ""} - ${record?.endTime || ""}`,
      className: "white-space",
    },
    {
      title: "Subject",
      render: (_, render) => render?.subject,
    },
    // {
    //   title: "Attendance Status",
    //   dataIndex: "name",
    //   render: (_, render) =>
    //     render?.status === "yet to submit" ? (
    //       <>
    //         <a
    //           className=""
    //           disabled
    //         >
    //           yet to submit
    //         </a>
    //       </>
    //     ) : (
    //       <a
    //         className="hover-a "
    //         onClick={() =>
    //           navigate("/teacher/attendance/attendanceEdit", { state: render })
    //         }
    //       >
    //         {render?.status}
    //       </a>
    //     ),
    // },

    {
      title: "Attendance Status",
      dataIndex: "name",
      render: (_, record) => {
        const currentTime = moment();
        const lectureStartTime = moment(record?.startTime, "HH:mm");

        const isDisabled = lectureStartTime.isAfter(currentTime);

        if (record?.status === "yet to submit") {
          return (
            <a
              className={`hover-a`}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  navigate("/teacher/attendance/attendanceEdit", {
                    state: {
                      state: record,
                      grade: filterGrade,
                      section: filterSection,
                      stage: filterStage,
                      page: "today",
                    },
                  });
                }
              }}
            >
              Yet to Submit
            </a>
          );
        }

        return (
          <a
            className="hover-a"
            onClick={(e) => {
              navigate("/teacher/attendance/attendanceEdit", {
                state: {
                  state: record,
                  grade: filterGrade,
                  section: filterSection,
                  stage: filterStage,
                  page: "today",
                },
              });
            }}
          >
            {record?.status}
          </a>
        );
      },
    },

    {
      title: "Check Strength",
      dataIndex: "name",
      render: (_, render) => render?.totalStrength,
    },
    {
      title: "Present",
      dataIndex: "name",
      render: (_, render) => render?.presentCount,
    },
    {
      title: "Absent",
      dataIndex: "name",
      render: (_, render) => render?.absentCount,
    },
    {
      title: "Homework",
      dataIndex: "selected",
      render: (_, record) => (
        <button className="btn btn-primary" disabled>
          Add
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div>
            <h3
              className="text-dark"
              style={{ fontSize: "x-large", marginBottom: "50px" }}
            >
              Today's Attendance
            </h3>
          </div>

          <div className="card p-3 desktop-show">
            <div
              className="d-flex gap-2 justify-content-between"
              style={{ flexWrap: "wrap" }}
            >
              <div className="mb-3 flex-fill flex-1">
                {" "}
                <label
                  className="form-label font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Stage
                </label>
                <select
                  value={filterStage}
                  onChange={(e) => {
                    setFilterStage(e.target.value);
                    // getGrades(e.target.value);
                    // setFilterGrade("");
                    // setFilterSection("");
                  }}
                  className="form-control form-select"
                >
                  <option value="">Select Stage</option>
                  {allStages?.map((res, i) => (
                    <option value={res?._id} key={i}>
                      {" "}
                      {res?.stage}{" "}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2 */}

              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Grade
                </label>
                <select
                  value={filterGrade}
                  onChange={(e) => {
                    setFilterGrade(e.target.value);
                    getSections(e.target.value);
                  }}
                  className="form-control form-select"
                >
                  <option value="">Select Grade</option>
                  {allGrades?.map((res, i) => (
                    <option value={res?._id} key={i}>
                      {" "}
                      {res?.grade}{" "}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3 */}

              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Section
                </label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="form-control form-select"
                >
                  <option value="">Select Section</option>
                  {allSections?.map((res, i) => (
                    <option value={res?._id} key={i}>
                      {res?.section}{" "}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4 */}

              {/* <div className="mb-3 flex-fill flex-1">
                {" "}
                <label
                className="form-label font-size-seperate"
                style={{
                  display: "block",
                  fontSize: "13px !important",
                  textAlign: "start",
                }}
              >
                Working Day
              </label>{" "}
              <select
                value={filterDateRange}
                onChange={(e) => {
                  setFilterDateRange(e.target.value);
                  console.log("Selected Date Range:", e.target.value);
                }}
                className="form-control form-select"
              >
                <option value="">Select Date Range</option>
                {dateRanges &&
                  dateRanges?.map((res, i) => (
                    <option value={res?._id} key={i}>
                      {moment(res?.start_date).format("DD-MM-YYYY")} -{" "}
                      {moment(res?.end_date).format("DD-MM-YYYY")}
                    </option>
                  ))}
              </select>
              </div> */}

              {/* 5 */}

              <div className="mb-3 flex-fill flex-1">
                {" "}
                <label
                  className="form-label font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Date
                </label>
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  selected={selectedDate ? new Date(selectedDate) : new Date()}
                  onChange={(date) =>
                    setSelectedDate(
                      date ? moment(date).format("YYYY-MM-DD") : null
                    )
                  }
                  disabled
                  minDate={getMinDate()}
                  maxDate={getMaxDate()}
                  className="form-control"
                />
              </div>

              <button
                onClick={() => {
                  setFilterSection("");
                  setFilterGrade("");
                  setFilterStage("");
                  setFilterDateRange("");

                  setAllGrades([]);
                  setAllSections([]);
                  setDateRanges([]);
                  setSelectedDate(null);
                }}
                className="btn btn-primary"
                style={{ marginTop: "25px", height: "max-content" }}
              >
                Reset Filter
              </button>
            </div>
          </div>

          <div className="filters card p-3 row gap-2 gap-md-0 align-items-centers mobile-show ">
            <div className="col-md-3 mb-1">
              <label
                className="form-label font-size-seperate"
                style={{
                  display: "block",
                  fontSize: "13px !important",
                  textAlign: "start",
                }}
              >
                Stage
              </label>
              <select
                value={filterStage}
                onChange={(e) => {
                  setFilterStage(e.target.value);
                  getGrades(e.target.value);
                  // setFilterGrade("");
                  // setFilterSection("");
                }}
                className="form-control form-select"
              >
                <option value="">Select Stage</option>
                {allStages?.map((res, i) => (
                  <option value={res?._id} key={i}>
                    {" "}
                    {res?.stage}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-1">
              <label
                className="form-label font-size-seperate"
                style={{
                  display: "block",
                  fontSize: "13px !important",
                  textAlign: "start",
                }}
              >
                Grade
              </label>
              <select
                value={filterGrade}
                onChange={(e) => {
                  setFilterGrade(e.target.value);
                  getSections(e.target.value);
                }}
                className="form-control form-select"
              >
                <option value="">Select Grade</option>
                {allGrades?.map((res, i) => (
                  <option value={res?._id} key={i}>
                    {" "}
                    {res?.grade}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-1">
              <label
                className="form-label font-size-seperate"
                style={{
                  display: "block",
                  fontSize: "13px !important",
                  textAlign: "start",
                }}
              >
                Section
              </label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="form-control form-select"
              >
                <option value="">Select Section</option>
                {allSections?.map((res, i) => (
                  <option value={res?._id} key={i}>
                    {res?.section}{" "}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="col-md-3 mb-1">
              <label
                className="form-label font-size-seperate"
                style={{
                  display: "block",
                  fontSize: "13px !important",
                  textAlign: "start",
                }}
              >
                Working Day
              </label>{" "}
              <select
                value={filterDateRange}
                onChange={(e) => {
                  setFilterDateRange(e.target.value);
                  console.log("Selected Date Range:", e.target.value);
                }}
                className="form-control form-select"
              >
                <option value="">Select Date Range</option>
                {dateRanges &&
                  dateRanges?.map((res, i) => (
                    <option value={res?._id} key={i}>
                      {moment(res?.start_date).format("DD-MM-YYYY")} -{" "}
                      {moment(res?.end_date).format("DD-MM-YYYY")}
                    </option>
                  ))}
              </select>
            </div> */}

            <div className="col-md-3 mb-1">
              <label
                className="form-label font-size-seperate"
                style={{
                  display: "block",
                  fontSize: "13px !important",
                  textAlign: "start",
                }}
              >
                Date
              </label>
              <DatePicker
                format="dd-MM-yyyy"
                selected={selectedDate ? new Date(selectedDate) : new Date()}
                onChange={(date) =>
                  setSelectedDate(
                    date ? moment(date).format("YYYY-MM-DD") : null
                  )
                }
                disabled
                minDate={getMinDate()}
                maxDate={getMaxDate()}
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <button
                onClick={() => {
                  setFilterSection("");
                  setFilterGrade("");
                  setFilterStage("");
                  setFilterDateRange("");

                  setAllGrades([]);
                  setAllSections([]);
                  setDateRanges([]);
                  setSelectedDate(null);
                }}
                className="btn btn-primary"
              >
                Reset Filter
              </button>
            </div>
          </div>
          <div className="card mt-5">
            <Table
              rowKey="_id"
              columns={columns}
              className="bordered-table remove-entries"
              dataSource={data}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayAttendanceteacher;
