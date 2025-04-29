import axios from "axios";
import { saveAs } from "file-saver";

import React, { useContext } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import {
  allClass,
  allSection,
  gender,
  names,
  status,
} from "../../../../core/common/selectoption/selectoption";
// import CommonSelect from '../../../../core/common/commonSelect'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CContainer } from "@coreui/react";
// import { RotatingLines } from "react-loader-spinner";

import maleGenericimage from "../../../../image/images/malegeneric.png";

import moment from "moment";
import * as XLSX from "xlsx";

import { AuthContext } from "../../../helper/AuthState";
import CommonSelect from "../../../../core/common/commonSelect";
const SingleView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = location?.state?.id;
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [pointType, setPointType] = useState("");
  const [categorys, setcategorys] = useState("");

  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [category, setCategory] = useState([]);
  const [assignedPoints, setAssignedPoints] = useState("");

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const handleDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };
  const getCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/categories?category_for=student`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCategory(response?.data?.data?.docs);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-assigned-points-by-student-id?studentId=${studentId}&from_date=${
          startDate === "" || startDate === null
            ? ""
            : moment(startDate).format("YYYY-MM-DD")
        }&end_date=${
          endDate === "" || endDate === null
            ? ""
            : moment(endDate).format("YYYY-MM-DD")
        }&category=${categorys ? categorys : ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAssignedPoints(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (startDate) {
      if (endDate) {
        getUsers();
      }
    } else {
      getUsers();
    }
  }, [dateRange, categorys]);

  useEffect(() => {
    getCategory();
  }, []);

  const header = [
    "Student Name",
    "Grade",
    "Section",
    "Points",
    "Remark By",
    "Remark Reason",
    "Category",
    "Date",
  ];

  const exportToExcel = () => {
    // Format data with the header
    const dataWithHeader = assignedPoints?.assignedPoints?.map((res) => ({
      "Student Name": `${assignedPoints?.student?.firstName} ${assignedPoints?.student?.lastName}`,
      Grade: assignedPoints?.student?.stageGradeSection?.grade?.grade,
      Section: assignedPoints?.student?.stageGradeSection?.section?.section,
      Points: res?.category_id?.point,
      "Remark By": `${res?.assigned_by?.firstName} ${res?.assigned_by?.lastName}`,
      "Remark Reason": res?.remark || "N/A", // Adjust based on available data
      Category: res?.category_id?.category_name || "N/A", // Adjust based on available data
      Date: moment(res?.createdAt).format("YYYY-MM-DD"), // Format date
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataWithHeader, { header });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook and trigger the download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Use file-saver to save the file
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `Student singleview excel.xlsx`);
  };

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">
              Individual Student Points Details
            </h3>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="dropdown me-2 mb-2">
              <Link
                to="#"
                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export"></i>
                Export
              </Link>
              <ul className="dropdown-menu  dropdown-menu-end p-3">
                <li>
                  <Link
                    to="#"
                    onClick={() => exportToExcel()}
                    className="dropdown-item rounded-1"
                  >
                    <i className="ti ti-file-type-xls me-1" />
                    Export as Excel{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Filter */}
        <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 ">
          <div className="d-flex newmwnu  me-2 justify-content-between">
            <div className="filters d-flex gap-4 mt-3 mb-3 align-items-center flex-wrap">
              <h5 style={{ fontWeight: 400, fontSize: "14px" }}>
                Student Name :&nbsp;{" "}
                <span style={{ fontWeight: 400, fontSize: "14px" }}>
                  {assignedPoints?.student?.firstName}{" "}
                  {assignedPoints?.student?.lastName}{" "}
                </span>
              </h5>

              <h5 style={{ fontWeight: 400, fontSize: "14px" }}>
                Section :{" "}
                <span style={{ fontWeight: 400, fontSize: "14px" }}>
                  {assignedPoints?.student?.stageGradeSection?.section?.section}
                </span>
              </h5>
              <h5 style={{ fontWeight: 400, fontSize: "14px" }}>
                Grade :{" "}
                <span style={{ fontWeight: 400, fontSize: "14px" }}>
                  {assignedPoints?.student?.stageGradeSection?.grade?.grade}
                </span>
              </h5>
              <h5 style={{ fontWeight: 400, fontSize: "14px" }}>
                {" "}
                Total Awards Point :&nbsp;
                <span style={{ fontWeight: 400, fontSize: "14px" }}>
                  {assignedPoints?.totalPositivePoints}
                </span>
              </h5>
            </div>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-3">
                <div className="input-icon-start  me-2 position-relative"                 style={{width:"100%"}}
 >
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
                placeholderText="Select Date Range"
              />
            </div>

            <div className="input-icon-start  me-2 position-relative"  style={{width:"100%"}}>
              {/* <CommonSelect
                className="select"
                options={category?.map((cat) => ({
                  value: cat._id,
                  label: cat.category_name,
                }))}
                value={
                  categorys
                    ? {
                        value: categorys,
                        label: category.find((cat) => cat._id === categorys)
                          ?.category_name,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  setcategorys(selectedOption ? selectedOption.value : null);
                }}
                isClearable={true}
              /> */}

              <select
                className="form-control form-select"
                style={{width:"100%" , paddingLeft:"10px"}}
                value={categorys || ""}
                onChange={(e) => setcategorys(e.target.value)}
              >
                <option value="">Select a category</option>
                {category?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-icon-start  me-2 position-relative">
              <button
                className="btn btn-light me-3"
                onClick={() => {
                  setdateRange([null, null]);
                  setcategorys(null);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {assignedPoints?.assignedPoints?.map((student) => {
            return (
              <div
                key={student.id}
                className="col-xxl-3 col-xl-4 col-md-6 d-flex"
              >
                <div className="card flex-fill">
                 
                  <div className="card-body" style={{padding:"10px"}}>
                  <div className="d-flex  justify-content-between align-items-center mb-3 gap-2">
                  <div className="d-flex gap-2 align-items-center">
                       


                        <Link
                          // to={routes.studentDetail}
                          className="avatar avatar-lg flex-shrink-0"
                        >
                          <img
                            crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                            src={maleGenericimage}
                            alt={student.name}
                            className="img-fluid rounded-circle"
                          />
                        </Link>
                        <div className="ms-2">
                          <h5 className="mb-0">
                            <Link>
                              {" "}
                              {student?.assigned_by?.firstName}{" "}
                              {student?.assigned_by?.lastName}
                            </Link>
                          </h5>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                      <span
                        style={{ fontSize: "18px", padding: "5px 20px" }}
                        className="badge badge-soft-success d-inline-flex align-items-center "
                      >
                        {/* <i className="ti ti-circle-filled fs-5 me-1" /> */}
                        {student?.category_id?.point ?? 0}
                      </span>
                    </div>
                      </div>
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <div>
                        <p className="mb-0" style={{ fontSize: "13.5px" }}>Category</p>
                        <p className="text-dark" style={{ fontSize: "13.5px" }}>
                          {" "}
                          {student?.category_id?.category_name}
                        </p>
                      </div>
                      <div>
                        <p className="mb-0" style={{ fontSize: "13.5px" }}> Remark By</p>
                        <p className="text-dark" style={{ fontSize: "13.5px" }}>
                        {student?.assigned_by?.role
                              ?.split("-")
                              .map(
                                (word) =>
                                  word?.charAt(0)?.toUpperCase() +
                                  word?.slice(1)
                              )
                              .join("-")}
                        </p>
                      </div>

                      <div>
                        <p className="mb-0" style={{ fontSize: "13.5px" }}>Date</p>
                        <p className="text-dark" style={{ fontSize: "13.5px" }}>
                        {moment(student.createdAt).format("MMM D")}

                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between" style={{padding:"10px"}}>
                    <div className="d-flex  gap-2">
                      <p className="mb-0" style={{ fontSize: "13.5px",
                            minWidth: "fit-content", }}> Remark Reason : </p>
                      <p className="text-dark " style={{ fontSize: "13.5px" }}>{student.remark} </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SingleView;
