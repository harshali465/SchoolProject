import React, { useContext } from "react";
import { useRef } from "react";
import "./viewclass.css";

import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import maleGenericimage from "../../../../../image/images/malegeneric.png";
import femaleGeneric from "../../../../../image/images/femalegeneric.png";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import {
  allClass,
  allSection,
  gender,
  names,
  status,
} from "../../../../../core/common/selectoption/selectoption";
// import CommonSelect from '../../../../core/common/commonSelect'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CContainer } from "@coreui/react";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AuthContext } from "../../../../helper/AuthState";
import { useAssignContext } from "../../../../helper/AuthSelector";
import CommonSelect from "../../../../../core/common/commonSelect";
const ClassWise = () => {
  const token = localStorage.getItem("accessToken");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();
  const getStudentsByIds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/stage-grade-section/get-student-by-grade-section?gradeId=${filterGrade}&sectionId=${filterSection}&from_date=${
          startDate === "" || startDate === null
            ? ""
            : moment(startDate).format("YYYY-MM-DD")
        }&end_date=${
          endDate === "" || endDate === null
            ? ""
            : moment(endDate).format("YYYY-MM-DD")
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getStudentsByIds();
  }, [filterGrade, filterSection, filterKeyword, dateRange]);

  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  const getGrades = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/grade`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllGrades(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSections = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/section/${filterGrade}`,
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

  useEffect(() => {
    getGrades();
    if (filterGrade) {
      getSections();
    }
  }, [filterSection, filterGrade]);

  const header = ["Student Name", "Grade", "Section", "Points", "Remark"];

  const exportToExcel = () => {
    // Format data with the header
    const dataWithHeader = students?.map((res) => ({
      "Student Name": `${res?.firstName} ${res?.lastName}`,
      Grade: res?.stageGradeSection?.grade?.grade,
      Section: res?.stageGradeSection?.section?.section,
      Points: res?.pointsCount,
      Remark: res?.remarkCount,
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
    saveAs(dataBlob, `ClassViseexcel.xlsx`);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">View Points - Class Wise</h3>
            </div>
            {/* <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          
              <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Back
            </button>
               
              </div> */}
          </div>
          {/* /Page Header */}
          {/* Filter */}

          <div className="d-flex newmwnu gap-2 align-items-center me-2 ">
            <div className="col-xxl-3 col-xl-3 col-md-3">
              {" "}
              <div className="mb-3">
                <label className="form-label">Grade</label>
                <CommonSelect
                  className="select"
                  options={allGrades.map((grade) => ({
                    value: grade._id,
                    label: grade.grade,
                  }))}
                  value={
                    filterGrade
                      ? {
                          value: filterGrade,
                          label: allGrades.find(
                            (grade) => grade._id === filterGrade
                          )?.grade,
                        }
                      : {
                        value: "",
                        label:""
                      }
                  } 
                  onChange={(e) => {
                    setFilterGrade(e ? e.value : "");
                  }}
                />
              </div>
            </div>

            <div className="col-xxl-3 col-xl-3 col-md-3">
              {" "}
              <div className="mb-3">
                <label className="form-label">Section</label>
                <CommonSelect
                  className="select"
                  options={allSections.map((section) => ({
                    value: section._id, 
                    label: section.section, 
                  }))}
                  value={
                    filterSection
                      ? {
                          value: filterSection,
                          label: allSections.find(
                            (section) => section._id === filterSection
                          )?.section,
                        }
                      : {
                        value: "",
                        label:"",
                      }
                  } // Ensure value matches with the section value
                  onChange={(e) => {
                    setFilterSection(e ? e.value : ""); // e.value holds the selected section ID
                  }}
                />
              </div>
            </div>

            <div className="">
              <Link
                to="#"
                onClick={() => {
                  setFilterSection("");
                  setFilterGrade("");
                  setAllGrades([]);
                  setAllSections([]);
                }}
                className="btn btn-light "
                style={{ marginTop: "7px" }}
              >
                Reset
              </Link>
            </div>
          </div>

       

            <div className="grid-containers mt-4 mobile-div">
                    {students?.map((student) => {
                      return (
                        <>
                          {" "}
                          <div key={student._id} className="student-box d-flex gap-3   " style={{marginLeft:"10px"}}>
                         
                       
                              <div className="d-flex" style={{ paddingTop: "10px" }}>
                                <img
                                  crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                                  src={
                                    student?.photo
                                      ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${student?.photo}`
                                      : student?.gender == "female"
                                      ? femaleGeneric
                                      : maleGenericimage
                                  }
                                  alt={student.firstName}
                                  className="student-img"
                                  style={{
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                              <div
                                className=" d-flex justify-content-between  align-items-center gap-1  student-border"
                                style={{ width: "100%" }}
                              >
                               <h3
  className="text-start"
  style={{ fontSize: "14px", fontWeight: 400 }}
>
  {`${student?.firstName} ${student?.lastName}`.length > 20
    ? `${student?.firstName} ${student?.lastName}`.slice(0, 20) + " ..."
    : `${student?.firstName} ${student?.lastName}`}
</h3>
                                <div className=" d-flex gap-3">
                                  <span className="green-box">
                                    {student?.pointsCount}
                                  </span>
                                  {/* <span className="red-box">{student?.remarkCount}</span> */}
                                </div>
                              </div>
                          
                          </div>
                          
                        </>
                      );
                    })}
          </div>
          

            <div className="grid-container mt-4 desktop-div content">
                    {students?.map((student) => {
                      return (
                        <>
                          <div className=" d-flex justify-content-between gap-3 border-box-student " >
                             
                     
                    
                          
                              <div className="d-flex">
                                <img
                                  crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                                  src={
                                    student?.photo
                                      ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${student?.photo}`
                                      : student?.gender == "female"
                                      ? femaleGeneric
                                      : maleGenericimage
                                  }
                                  alt={student.firstName}
                                  className="student-img"
                                  style={{
                                    height: "50px",
                                    width: "50px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                              <div
                                className=" d-flex justify-content-between  align-items-center gap-1  "
                                style={{ width: "100%" }}
                              >
                                 <h3
  className="text-start"
  style={{ fontSize: "14px", fontWeight: 400 }}
>
  {`${student?.firstName} ${student?.lastName}`.length > 20
    ? `${student?.firstName} ${student?.lastName}`.slice(0, 20) + " ..."
    : `${student?.firstName} ${student?.lastName}`}
</h3>
                                <div className=" d-flex gap-3">
                                  <span className="green-box">
                                    {student?.pointsCount}
                                  </span>
                                  {/* <span className="red-box">
                                    {student?.remarkCount}
                                  </span> */}
                                </div>
                              </div>
                         
                          </div> 
                        </>
                      );
                    })}
                  </div>
          


        </div>
      </div>
    </>
  );
};

export default ClassWise;
