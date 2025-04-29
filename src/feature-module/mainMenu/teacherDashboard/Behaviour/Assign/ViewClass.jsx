import React, { useContext } from "react";
import "./viewclass.css";
import { useRef } from "react";
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
import { CodeSandboxCircleFilled } from "@ant-design/icons";
const ViewClass = () => {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");
  const [students, setStudents] = useState([]);
  const { appState, setAppState } = useAssignContext();
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterGrade, setFilterGrade] = useState(appState?.grade || "");
  const [filterselectedUsers, setFilterSelectedUsers] = useState(
    appState?.alldata || ""
  );

  const [filterSection, setFilterSection] = useState(
    appState?.section || ""
  );
  console.log("this is a filter section" , filterSection)

  const getStudentsByIds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/get-student-by-grade-section?gradeId=${filterGrade}&sectionId=${filterSection}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response?.data?.data);
      if (appState?.selectedData?.length > 0) {
        appState?.selectedData?.map((res) => assignSelection(res?.value));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (filterGrade && filterSection) {
      getStudentsByIds();

    }
    else if(!filterGrade && !filterSection) {
      getStudentsByIds();
    }
  }, [filterGrade, filterSection, filterKeyword]);

  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);

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

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((item) => item !== _id) : [...prev, _id]
    );
    const studentDatas = students.find((student) => student._id === _id);
    const studentData = {
      grade: studentDatas?.stageGradeSection?.grade?.grade,
      section: studentDatas?.stageGradeSection?.section?.section,
      value: studentDatas?._id,
      label: `${studentDatas?.firstName} ${studentDatas?.lastName}`,
    };
    if (!studentData) {
      console.error(`Student with ID ${_id} not found.`);
      return;
    }

    setAppState((prev) => {
      const existingData = prev.selectedData || [];
      const isAlreadySelected = existingData.some((item) => item.value === _id);
      const updatedSelectedData = isAlreadySelected
        ? existingData.filter((item) => item.value !== _id)
        : [...existingData, studentData];

      return {
        ...prev,
        selectedData: updatedSelectedData,
      };
    });
  };


  const toggleSelectionAll = () => {
    const allIds = students.map((student) => student._id);

    const isAllSelected = allIds.every((id) => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !allIds.includes(id)));

      setAppState((prev) => ({
        ...prev,
        selectedData: prev.selectedData.filter(
          (item) => !allIds.includes(item.value)
        ),
      }));
    } else {
      const selectedData = students.map((student) => ({
        grade: student?.stageGradeSection?.grade?.grade,
        section: student?.stageGradeSection?.section?.section,
        value: student._id,
        label: `${student?.firstName} ${student?.lastName}`,
      }));

      setSelectedIds((prev) => [
        ...prev,
        ...allIds.filter((id) => !prev.includes(id)),
      ]);
 console.log("this is a app state" , appState)

      setAppState((prev) => ({
        ...prev,
        selectedData: [
          ...prev.selectedData,
          ...selectedData.filter(
            (item) =>
              !prev.selectedData.some(
                (existing) => existing.value === item.value
              )
          ),

        ],
      }));
    }
  };

  const assignSelection = (_id) => {
    setSelectedIds((prev) => (prev.includes(_id) ? [...prev] : [...prev, _id]));
  };

  const selectedData = selectedIds.map((id) => {
    const student = students.find((s) => s?._id === id);
    return {
      grade: student?.stageGradeSection?.grade?.grade,
      section: student?.stageGradeSection?.section?.section,
      value: student?._id,
      label: `${student?.firstName} ${student?.lastName} / ${student?.itsNo}`,
    };
  });

  const handleProceed = () => {
    navigate("/teacher/behaviour/assign/assign-points", {
      state: {
        previousRoute: location.pathname,
        grade: filterGrade,
        section: filterSection,
      },
    });
  };

  const routes = all_routes;
  const navigate = useNavigate();
  const dropdownMenuRef = useRef(null);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const handleDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  const studentId = location?.state?.id;
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [pointType, setPointType] = useState("");

  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [category, setCategory] = useState([]);
  const [assignedPoints, setAssignedPoints] = useState("");
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-assigned-points-by-student-id?studentId=${localStorage.getItem(
          "userId"
        )}&from_date=${
          selectedStartDate
            ? moment(selectedStartDate).format("YYYY-MM-DD")
            : ""
        }&end_date=${
          selectedEndDate ? moment(selectedEndDate).format("YYYY-MM-DD") : ""
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
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (selectedStartDate) {
      if (selectedEndDate) {
        getUsers();
      }
    } else {
      getUsers();
    }
  }, [
    selectedEndDate,
    selectedStartDate,
    academicYearId,
    authState?.startYearId,
    upcomingyear,
  ]);

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
    const dataWithHeader = assignedPoints?.assignedPoints?.map((res) => ({
      "Student Name": `${assignedPoints?.student?.firstName} ${assignedPoints?.student?.lastName}`,
      Grade: assignedPoints?.student?.stageGradeSection?.grade?.grade,
      Section: assignedPoints?.student?.stageGradeSection?.section?.section,
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

    // Use file-saver to save the file
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `My points excel.xlsx`);
  };

  const checkAllSelectedForGradeAndSection = () => {
    if (!filterGrade && !filterSection) {
      console.log("selected id" , selectedIds ,"0-0-0" ,  filterGrade , "0-0-" , filterSection , "-0-0-0-" , students)
      return (students.length > 0 && students.every((student) => {
         return  selectedIds.includes(student._id)
       })) 
    }
    const studentsInCurrentGradeAndSection = students.filter(
      (student) =>
        student.stageGradeSection.grade._id === filterGrade &&
        student.stageGradeSection.section._id === filterSection
    );
    return (
      studentsInCurrentGradeAndSection.length > 0 &&
      studentsInCurrentGradeAndSection.every((student) =>
        selectedIds.includes(student._id)
      )
    );
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">View Points - Class Wise</h3>
            </div>
          </div>

          <div className="d-flex flex-wrap newmwnu gap-2 align-items-center me-2 ">
            <div className="">
              <label className="form-label">Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => {
                  setFilterGrade(e.target.value);
                  setFilterSection("");
                }}
                style={{ width: "126px" }}
                className="form-control form-select"
              >
                <option value="">Select</option>
                {allGrades?.map((res, i) => (
                  <option value={res?._id} key={i}>
                    {" "}
                    {res?.grade}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <label className="form-label">Section</label>
              <select
                placeholder="All Divisions"
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                style={{ width: "126px" }}
                className="form-control form-select"
              >
                <option value="">Select </option>
                {allSections?.map((res, i) => (
                  <option value={res?._id} key={i}>
                    {res?.section}{" "}
                  </option>
                ))}
              </select>
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
                style={{ marginTop: "23px" }}
              >
                Reset
              </Link>
            </div>
          </div>

          <div className=" d-flex justify-content-between mt-5">
            <div className="d-flex gap-2">
              <input
                type="checkbox"
                checked={checkAllSelectedForGradeAndSection()}
                onChange={toggleSelectionAll}
              />
              <label className="ml-1 ">Select All</label>
            </div>
            <p className="m-0 fw-bold">
              {" "}
              Selected :- {appState?.selectedData?.length || 0}{" "}
            </p>
          </div>
        </div>

        <div className="grid-containers mt-4 mobile-div">
          {students?.map((student) => {
            return (
              <>
                {" "}
                <div key={student._id} className="student-box d-flex gap-3   ">
                  <div className=" d-flex align-items-center">
                  <input
                    type="checkbox"
                    id={`student-${student._id}`}
                    className="hidden-checkboxs ml-2"
                    checked={selectedIds.includes(student._id)}
                    onChange={() => toggleSelection(student._id)}

                  />
                  </div>
                
                  
                  <label
                    htmlFor={`student-${student._id}`}
                    className="student-labels d-flex justify-content-between gap-3 "
                    style={{ width: "100%" }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
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
                      className=" d-flex justify-content-between align-items-center gap-1  student-border"
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
                      <div className=" d-flex gap-3 mright-10">
                        <span className="green-box">
                          {student?.pointsCount}
                        </span>
                        {/* <span className="red-box">{student?.remarkCount}</span> */}
                      </div>
                    </div>
                  </label>
                </div>
                
              </>
            );
          })}

        </div>
 
        <div className="grid-container mt-4 desktop-div content">
          {students?.map((student) => {
            return (
              <>
           
                <div key={student._id} className="student-box  ">
                  <input
                    type="checkbox"
                    id={`student-${student._id}`}
                    className="hidden-checkbox"
                    checked={selectedIds.includes(student._id)}
                    onChange={() => toggleSelection(student._id)}
                  />
                  <label
                    htmlFor={`student-${student._id}`}
                    className="student-label d-flex justify-content-between gap-3 "
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
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
                      {/* <h3
                        className="text-start"
                        style={{ fontSize: "14px", fontWeight: 400 }}
                      >
                        {" "}
                        {student?.firstName} {student?.lastName}{" "}
                      </h3> */}
                     <h3
  className="text-start"
  style={{ fontSize: "14px", fontWeight: 400 }}
>
  {`${student?.firstName} ${student?.lastName}`.length > 20
    ? `${student?.firstName} ${student?.lastName}`.slice(0, 20) + " ..."
    : `${student?.firstName} ${student?.lastName}`}
</h3>

                      <div className=" d-flex gap-3 mright-10">
                        <span className="green-box">
                          {student?.pointsCount}
                        </span>
                       
                      </div>
                    </div>
                  </label>
                </div>
              </>
            );
          })}
        </div>


        <div className="text-center my-5">
          <button
            className="btn btn-primary"
            onClick={() => handleProceed(students)}
          >
            Proceed
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewClass;
