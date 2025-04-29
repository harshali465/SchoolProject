import React, { useContext } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
} from "@mui/material";
import { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
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
import axios from "axios";

import { CContainer } from "@coreui/react";

import maleGenericimage from "../../../../image/images/malegeneric.png";

import moment from "moment";
import * as XLSX from "xlsx";

import { saveAs } from "file-saver";
import { AuthContext } from "../../../helper/AuthState";
import { CircularProgress } from "@mui/material";
const MyPoints = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef(null);
const navigate = useNavigate()
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const handleDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const location = useLocation();
  const studentId = location?.state?.id;
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [pointType, setPointType] = useState("");

  const [category, setCategory] = useState([]);
  const [assignedPoints, setAssignedPoints] = useState("");
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
    const [expandedId, setExpandedId] = useState(null);
    const [readIds, setReadIds] = useState([]); 
  
    const handleAccordionChange =
      (panelId, shouldCall) => (event, isExpanded) => {
        if (isExpanded) {
          setExpandedId(panelId);
  
          setReadIds((prev) =>
            prev.includes(panelId) ? prev : [...prev, panelId]
          );
  
          if (shouldCall) {
            yourApiCallFunction(panelId);
          }
        } else {
          setExpandedId(null);
        }
      };
  
    const yourApiCallFunction = async (studentId) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/update-is-read/${studentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("API error:", err);
      }
    };
  
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-assigned-points-by-student-id?studentId=${localStorage.getItem(
          "userId"
        )}&from_date=${
          startDate ? moment(startDate).format("YYYY-MM-DD") : ""
        }&end_date=${
          endDate ? moment(endDate).format("YYYY-MM-DD") : ""
        }&academicYearId=${
          academicYearId == authState?.startYear
            ? academicYearId
            : authState?.startYear
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAssignedPoints(response?.data?.data);
      setLoading(false);
      console.log("reponse is her epk tem", response?.data);
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
  }, [dateRange, academicYearId, authState?.startYearId, upcomingyear]);

  //   useEffect(() => {
  //     getCategory()
  // },[])
  const header = [
    "Student Name",
    "Grade",
    "Section",
    "Points Type",
    "Points",
    "Remark By",
    "Remark Reason",
    "Category",
    "Date",
  ];

  const exportToExcel = () => {
    const dataWithHeader = assignedPoints?.assignedPoints?.map((res) => ({
      "Student Name": `${assignedPoints?.student?.firstName} ${assignedPoints?.student?.lastName}`,
      Grade: assignedPoints?.student?.stageGradeSection?.grade?.grade,
      Section: assignedPoints?.student?.stageGradeSection?.section?.section,
      "Points Type": res?.category_id?.point_type,
      Points: res?.category_id?.point,

      "Remark By": `${res?.assigned_by?.firstName} ${res?.assigned_by?.lastName}`,
      "Remark Reason": res?.remark || "N/A",
      Category: res?.category_id?.category_name || "N/A",
      Date: moment(res?.createdAt).format("DD-MM-YYYY"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataWithHeader, { header });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

   
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `My points excel.xlsx`);
  };

  return (
    <>
{loading && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
              >
                <CircularProgress size={60} />
              </div>
            )}         <div className="page-wrapper">
        <div className="content content-two">
         
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
              <button className="btn btn-light me-2 mb-2" onClick={()=>navigate(-1)}>Back</button>
            </div>
          </div>
          {/* /Page Header */}
          {/* Filter */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 ">
            <div className="d-flex newmwnu  me-2 justify-content-between">
              <div className="filters d-flex gap-4 mt-3 mb-3 align-items-center flex-wrap">
                <h5 style={{ fontWeight: 400, fontSize: "15px" }}>
                  Student Name :&nbsp;{" "}
                  <span style={{ fontWeight: 400, fontSize: "15px" }}>
                    {assignedPoints?.student?.firstName}{" "}
                    {assignedPoints?.student?.lastName}{" "}
                  </span>
                </h5>

                <h5 style={{ fontWeight: 400, fontSize: "15px" }}>
                  {" "}
                  Total Awards Point :&nbsp;
                  <span style={{ color:""  , fontWeight: 400, fontSize: "15px" }}>
                    {assignedPoints?.totalPositivePoints}
                  </span>
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="input-icon-start d-flex gap-2 me-2 position-relative">
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
                  isClearable={false}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date Range"
                />
                <Link
                  to="#"
                  className="btn btn-light d-flex align-items-center"
                  onClick={() => {
                    setdateRange([null, null]);
                  }}
                >
                  Reset
                </Link>
              </div>
             
            </div>
          </div>

          {/* /Filter */}
          <div className="row">
            {assignedPoints?.assignedPoints?.map((student) => {
              return (
                // <div
                //   key={student.id}
                //   className="col-xxl-3 col-xl-4 col-md-6 d-flex"
                // >
                //   <div className="card flex-fill">
                //     <div className="card-body" style={{padding:"10px"}}>
                //       <div className="d-flex align-items-center justify-content-between mb-3">
                //         <div className="d-flex align-items-center ">
                //           <Link className="avatar avatar-lg flex-shrink-0">
                //             <img
                //               crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                //               src={maleGenericimage}
                //               alt={student.name}
                //               className="img-fluid rounded-circle"
                //             />
                //           </Link>
                //           <div className="ms-2">
                //             <h5 className="mb-0">
                //               <Link>
                //                 {" "}
                //                 {student?.assigned_by?.firstName}{" "}
                //                 {student?.assigned_by?.lastName}
                //               </Link>
                //             </h5>
                //           </div>
                //         </div>

                //         <div className="d-flex align-items-center">
                //           {" "}
                //           <span
                //             style={{ fontSize: "18px", padding: "5px 20px" }}
                //             className="badge badge-soft-success d-inline-flex align-items-center "
                //           >
                //             {student?.category_id?.point ?? 0}
                //           </span>
                //         </div>
                //       </div>

                //       <div className="d-flex align-items-center justify-content-between gap-3">
                //         <div>
                //           <p className="mb-0" style={{ fontSize: "13.5px" }}>
                //             Category
                //           </p>
                //           <p
                //             className="text-dark"
                //             style={{ fontSize: "13.5px" }}
                //           >
                //             {" "}
                //             {student?.category_id?.category_name}
                //           </p>
                //         </div>
                //         <div>
                //           <p className="mb-0" style={{ fontSize: "13.5px" }}>
                //             {" "}
                //             Remark By
                //           </p>
                //           <p
                //             className="text-dark"
                //             style={{ fontSize: "13.5px" }}
                //           >
                //             {" "}
                //             {student?.assigned_by?.role
                //               ?.split("-")
                //               .map(
                //                 (word) =>
                //                   word?.charAt(0)?.toUpperCase() + word?.slice(1)
                //               )
                //               .join("-")}
                //           </p>
                //         </div>

                //         <div>
                //           <p className="mb-0" style={{ fontSize: "13.5px" }}>
                //             Date
                //           </p>
                //           <p
                //             className="text-dark"
                //             style={{ fontSize: "13.5px" }}
                //           >
                //             {moment(student.createdAt).format("MMM D")}
                //           </p>
                //         </div>
                //       </div>
                //     </div>
                //     <div className="card-footer d-flex align-items-center justify-content-between" style={{padding:"10px"}}>
                //       <div className="d-flex  gap-2">
                //         <p
                //           className="mb-0"
                //           style={{
                //             fontSize: "13.5px",
                //             minWidth: "fit-content",
                //           }}
                //         >
                //           {" "}
                //           Remark Reason :{" "}
                //         </p>
                //         <p
                //           className="text-dark "
                //           style={{ fontSize: "13.5px" }}
                //         >
                //           {student.remark}
                //         </p>
                //       </div>
                //     </div>
                //   </div>
                // </div>


                    <Box className="width-acc" sx={{ maxWidth: 350, mb: 2 }}>
                                  {" "}
                                  <Accordion
                                    className="custom-accordion-shadow"
                                    expanded={expandedId === student._id}
                                    onChange={handleAccordionChange(
                                      student._id,
                                      student?.is_read ? false : true
                                    )}
                                  >
                                    <AccordionSummary
                                      className={`${
                                        student?.is_read || readIds.includes(student._id)
                                          ? "bg-blues"
                                          : ""
                                      }`}
                                      expandIcon={<ExpandMoreIcon />}
                                      sx={{ display: "flex", alignItems: "center", px: 2 }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          flexGrow: 1,
                                        }}
                                      >
                                        <Avatar
                                          src={maleGenericimage}
                                          alt={student?.assigned_by?.firstName}
                                          sx={{ width: 40, height: 40, mr: 2 }}
                                        />
                                        <div className="ms-2">
                                          <h5 className="mb-0">
                                            <Link>
                                              {" "}
                                              {student?.assigned_by?.firstName}{" "}
                                              {student?.assigned_by?.lastName}
                                            </Link>
                                          </h5>
                                        </div>
                                      </Box>
                                      <div className="d-flex align-items-center">
                                        <span
                                          style={{ fontSize: "18px", padding: "5px 20px" }}
                                          className="badge badge-soft-success d-inline-flex align-items-center"
                                        >
                                          {student?.category_id?.point ?? 0}
                                        </span>
                                      </div>
                                    </AccordionSummary>
                
                                    <AccordionDetails className="accordian-detail">
                                      <div className="d-flex align-items-center justify-content-between gap-3">
                                        <div>
                                          <p className="mb-0" style={{ fontSize: "13.5px" }}>
                                            Category
                                          </p>
                                          <p
                                            className="text-dark"
                                            style={{ fontSize: "13.5px" }}
                                          >
                                            {" "}
                                            {student?.category_id?.category_name}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="mb-0" style={{ fontSize: "13.5px" }}>
                                            {" "}
                                            Remark By
                                          </p>
                                          <p
                                            className="text-dark"
                                            style={{ fontSize: "13.5px" }}
                                          >
                                            {" "}
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
                                          <p className="mb-0" style={{ fontSize: "13.5px" }}>
                                            Date
                                          </p>
                                          <p
                                            className="text-dark"
                                            style={{ fontSize: "13.5px" }}
                                          >
                                            {" "}
                                            {moment(student.createdAt).format("MMM D")}
                                          </p>
                                        </div>
                                      </div>
                
                                      <div className="card-footers d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "13.5px",
                                              minWidth: "fit-content",
                                            }}
                                          >
                                            {" "}
                                            Remark Reason :{" "}
                                          </p>
                                          <p
                                            className="text-dark"
                                            style={{ fontSize: "13.5px" }}
                                          >
                                            {student.remark}
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        className="btn btn-light "
                                        onClick={() =>
                                          navigate(
                                            "/student/behaviour/assign-points/individual",
                                            { state: { data: student } }
                                          )
                                        }
                                      >
                                        Give Points
                                      </button>
                                    </AccordionDetails>
                                  </Accordion>
                                </Box>
              );
            })}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default MyPoints;
