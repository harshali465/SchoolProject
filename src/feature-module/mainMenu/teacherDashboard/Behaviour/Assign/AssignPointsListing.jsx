import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import { Studentlist } from "../../../../../core/data/json/studentList";
import maleGenericimage from "../../../../../image/images/malegeneric.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import {Table} from "antd";
// import Table from "../../../../core/common/dataTable/index";
import Table from "../../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import {
  allClass,
  allSection,
  gender,
  names,
  status,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { AuthContext } from "../../../../helper/AuthState";
import axios from "axios";
import moment from "moment";

const AssignPoints = () => {
  const routes = all_routes;
  const data = Studentlist;
  const dropdownMenuRef = useRef(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const [collecIds, setcollecIds] = useState([]);
  const location = useLocation();
  const academic_Year = location?.state?.academicYear;
  //   filter states
  const [search, setSearch] = useState("");
  const [sortBy, setSoryBy] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
  //   pagination

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1); // Current page, starts at 1

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const token = localStorage.getItem("accessToken");

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section?search=${search}&sortBy=${sortBy}&sortDirection=asc&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            stageId: filterStage,
            gradeId: filterGrade,
            sectionId: filterSection,
          },
        }
      );

      setSections(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // getUsers();
  }, [search, sortBy, page, limit, filterGrade, filterStage, filterSection]);

  const [pointsList, setPointsList] = useState([]);
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    setcollecIds([]);

    if (!selectAll) {
      const selectedIds = sections.map((student) => student._id);
      setcollecIds(selectedIds);
    } else {
      setcollecIds([]);
    }
    // setting frontend to checked
    setSelectAll(!selectAll);
    setSections((prevStudents) =>
      prevStudents.map((section) => ({ ...section, selected: !selectAll }))
    );
  };

  const handleSelect = async (index) => {
    const updatedSection = [...sections];
    if (updatedSection[index].selected === false) {
      setcollecIds([...collecIds, updatedSection[index]._id]);
    } else {
      setcollecIds((prevCollecIds) =>
        prevCollecIds.filter((id) => id !== updatedSection[index]._id)
      );
    }

    updatedSection[index].selected = !updatedSection[index].selected;
    setSections(updatedSection);
  };

  // Calculate the range of students to display based on the current page
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      width: 50,
      align:"center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      render: (date) => moment(date).format("MMM D"),

    },
    {
      title: "Time Stamp",
      dataIndex: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      render: (date) => moment(date).format("H:MM A"),
      responsive: ["lg"],
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      render: (user_type) =>
        user_type ? user_type.charAt(0).toUpperCase() + user_type.slice(1) : "",
      className: "user-column",
    },
    {
      title: "Name",
      dataIndex: "assigned_to",
      key: "firstName",
      // render: (assignedTo) => assignedTo?.firstName, // Access nested field `firstName`
      render: (assignedTo, record) => (
        <div className="d-flex align-items-center gap-1 min-width-maxContent">
          <img
            crossOrigin={process.env.REACT_APP_DEV_BASE_URL}
            src={
              assignedTo.photo
                ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${assignedTo.photo}`
                : maleGenericimage
            }
            alt="Profile"
            style={{ height: "30px", width: "30px" }}
            className=" rounded-circle image-table"
          />
          <span className="white-space">{`${assignedTo?.firstName} ${assignedTo?.lastName}`}</span>
        </div>
      ),
      // sorter: (a, b) => a.term.localeCompare(b.term),
      className: "name-column",
    },

    {
      title: "Type",
      dataIndex: "assigned_to",
      key: "type",
      render: (assignedTo) => assignedTo?.teacherType?.type,
      responsive: ["lg"],
    },

    {
      title: "Category",
      dataIndex: "category_id",
      render: (category_id) => category_id?.category_name,

      // render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"), // Format the date (using moment.js)
    },
    {
      title: "Remark Expression",
      dataIndex: "remark",
      className: "remark-column", 
    },
    {
      title: "Point",
      dataIndex: "category_id",
      render: (category_id) => category_id?.point,
      sorter: (a, b) => {
        const pointA = a.category_id?.point || 0;
        const pointB = b.category_id?.point || 0;
        return pointA - pointB;
      },
    },
  ];
  const getAssignPoints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-points-assign-by-user?search=${search}&from_date=${
          startDate ? moment(startDate).format("YYYY-MM-DD") : ""
        }&end_date=${
          endDate ? moment(endDate).format("YYYY-MM-DD") : ""
        }&academicYearId=${
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
      setPointsList(response?.data?.data?.docs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate) {
      if (endDate) {
        if(academicYearId)
        getAssignPoints();
      }
    } else {
      if(academicYearId)
      getAssignPoints();
    }
  }, [search, dateRange, academicYearId, authState?.startYearId, upcomingyear]);

  const handleDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-flex custom-responsive align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1" style={{ fontSize: "x-large" }}>
                Assign Points
              </h3>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              {authState.startYearId !== academicYearId &&
              authState.startYearId !== upcomingyear ? (
                <>
                  <Link
                    to={routes.teacher.assignPoints}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Assign Points
                  </Link>
                </>
              ) : (
                <Link
                  to={routes.teacher.assignPoints}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Assign Points
                </Link>

                // <button
                //   className="btn btn-dark float-end-btn mobile_btn_sec"
                //   onClick={() =>
                //     navigate(routes.assignPoints, {
                //       state: { academicYear: authState?.startYearId },
                //     })
                //   }
                // >
                //   Assign Points{" "}
                // </button>
              )}
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Points List</h4>

              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative responsive-width-100"  >
                  {/* <PredefinedDateRanges
                    onDateChange={handleDateChange}
                    initialStartDate={selectedStartDate}
                    initialEndDate={selectedEndDate}
                  /> */}
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
                <div className="input-icon-start mb-3 me-2 position-relative responsive-width-100"  >
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    style={{ padding: "0.5rem 0.625rem" }}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    onClick={() => {
                      setdateRange([null, null]);
                      setSearch("");
                    }}
                  >
                    Reset
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-body p-0 pb-3">
              {/* Student List */}
              <Table
                rowKey="_id"
                columns={columns}
                className="bordered-table"
                dataSource={pointsList}
                pagination={{
                  defaultPageSize: 25,
                  pageSizeOptions: ["25", "50", "100", "All"],
                  showSizeChanger: true,
                  position: ["bottomRight"],
                  locale: {
                    items_per_page: "",
                  },
                }}
              />
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* <StudentModals /> */}
    </>
  );
};

export default AssignPoints;
