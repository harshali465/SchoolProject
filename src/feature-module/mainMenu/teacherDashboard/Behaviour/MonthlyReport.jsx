

import  { useRef } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'
import PredefinedDateRanges from '../../../../core/common/datePicker'
import { allClass, allSection, gender, names, status } from '../../../../core/common/selectoption/selectoption'
// import CommonSelect from '../../../../core/common/commonSelect'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { CContainer } from "@coreui/react";
// import { RotatingLines } from "react-loader-spinner";


import maleGenericimage from "../../../../image/images/malegeneric.png";

import moment from "moment";
import * as XLSX from "xlsx";

import { saveAs } from "file-saver";
import CommonSelect from '../../../../core//common/commonSelect'
import TooltipOption from '../../../../core/common/tooltipOption'
import { useForkRef } from '@mui/material'

const MonthlyReport = () => {
    const routes = all_routes
    const dropdownMenuRef = useRef(null);
  const [selectedStartDate, setSelectedStartDate] = useState(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState(null);
    const handleApplyClick = () => {
      if (dropdownMenuRef.current) {
        dropdownMenuRef.current.classList.remove('show');
      }
    };
    const location = useLocation();
    const date = location?.state;
     const [loading, setLoading] = useState(false);
    // const [dateRange, setdateRange] = useState([date.startDate, date.endDate]);
    const [dateRange, setdateRange] = useState([null, null]);
  
    const [startDate, endDate] = dateRange;
    const [assignedPoints, setAssignedPoints] = useState("");
    const [pointType, setPointType] = useState("");
    const [data, setData] = useState("");
    useEffect(() => {
        if (date?.startDate && date?.endDate) {
          const parsedStartDate = new Date(date.startDate);
          const parsedEndDate = new Date(date.endDate);
      
          if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
            setSelectedStartDate(parsedStartDate); 
            setSelectedEndDate(parsedEndDate); 
          } else {
            console.error("Invalid date format in startDate or endDate");
          }
        }
      }, [date]);
      
     const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_DEV_BASE_URL
          }/api/v1/behaviorpoint/get-assigned-points-by-student-id?studentId=${localStorage.getItem(
            "userId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response?.data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error);
      }
    };
  
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_DEV_BASE_URL
          }/api/v1/behaviorpoint/get-points-assign-to-user?studentId=${localStorage.getItem(
            "userId"
          )}&from_date=${
            selectedStartDate ? moment(selectedStartDate).format("YYYY-MM-DD") : ""
          }&end_date=${
            selectedEndDate ? moment(selectedEndDate).format("YYYY-MM-DD") : ""
          }&point_type=${pointType}`,
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
        }
        else
      getUsers();
    }, [pointType, selectedStartDate  , selectedEndDate]);
    useEffect(() => {
      getData();
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
      const dataWithHeader = assignedPoints?.docs?.map((res) => ({
        "Student Name": `${data?.student?.firstName} ${data?.student?.lastName}`,
        Grade: data?.student?.stageGradeSection?.grade?.grade,
        Section: data?.student?.stageGradeSection?.section?.section,
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
      saveAs(
        dataBlob,
        `Monthly report excel.xlsx`
      );
    };

    const handleDateChange = (start, end) => {
        setSelectedStartDate(start);
        setSelectedEndDate(end);
      };
  
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* Page Header */}
      <div className="d-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Monthly Report View</h3>
         
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
                 <Link to="#" onClick={() => exportToExcel()} className="dropdown-item rounded-1">
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
      <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
      <div className="d-flex newmwnu mb-3 me-2 justify-content-between">
            <div className="filters d-flex gap-4 flex-wrap">
              <h5 className="" style={{fontWeight:400 , fontSize:"15px"}}>
                Student Name :&nbsp;{" "}
                <span  style={{fontWeight:400 , fontSize:"15px"}}>
                  {data?.student?.firstName} {data?.student?.lastName}{" "}
                </span>
              </h5>
              <h5  style={{fontWeight:400 , fontSize:"15px"}}>
                Grade :&nbsp;{" "}
                <span  style={{fontWeight:400 , fontSize:"15px"}}>
                  {data?.student?.stageGradeSection?.grade?.grade}{" "}
                </span>
              </h5>{" "}
              <h5  style={{fontWeight:400 , fontSize:"15px"}}>
                Section :&nbsp;{" "}
                <span style={{fontWeight:400 , fontSize:"15px"}}>
                  {data?.student?.stageGradeSection?.section?.section}
                </span>
              </h5>
              <h5  style={{fontWeight:400 , fontSize:"15px"}}>
                {" "}
                Total Awards Point :&nbsp;
                <span className="text-blue"  style={{fontWeight:400 , fontSize:"15px"}}>{data?.totalPositivePoints}</span>
              </h5>
            </div>
          </div>
        <div className="d-flex align-items-center flex-wrap">
          <div className="input-icon-start mb-3 me-2 position-relative">
          <PredefinedDateRanges
                    onDateChange={handleDateChange}
                    initialStartDate={selectedStartDate}
                    initialEndDate={selectedEndDate}
                  />
          </div>
          <div className="input-icon-start mb-3 me-2 position-relative">
                           <Link to="#" className="btn btn-light me-3" onClick={() => {
                              setSelectedStartDate(null);
                             setSelectedEndDate(null);
                         
                           }}>
                             Reset
                           </Link>
                         </div>
          {/* <div className="mb-3"> */}
                      
          {/* <CommonSelect
  className="select"
  options={teacherType && teacherType.map((teacher) => ({
    value: teacher._id,  
    label: teacher.type,  
  }))}
  value={teacherType.find(teacher => teacher.type === formData.teacherType) || null} 
  onChange={(e) => {
    handleInputChange("teacherType", e ? e.value : "");
  }}
/> */}

                      {/* </div> */}
        </div>
                  </div>
               
      {/* /Filter */}
      <div className="row">
                      {assignedPoints?.docs?.map((student) => {
          return  <div   key={student.id} className="col-xxl-3 col-xl-4 col-md-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <Link className="link-primary">
              {student?.assigned_by?.role}
              </Link>
              <div className="d-flex align-items-center">
                <span style={{fontSize:"18px" , padding:"5px 20px"}} className="badge badge-soft-success d-inline-flex align-items-center ">
                  {/* <i className="ti ti-circle-filled fs-5 me-1" /> */}
                  {student?.category_id?.point ?? 0}
                </span>
              
              </div>
            </div>
            <div className="card-body">
              <div className="bg-light-300 rounded-2 p-3 mb-3">
                <div className="d-flex align-items-center">
                  <Link
                    // to={routes.studentDetail}
                    className="avatar avatar-lg flex-shrink-0"
                  >
                    {/* <ImageWithBasePath
                      src="assets/img/students/student-01.jpg"
                      className="img-fluid rounded-circle"
                      alt="img"
                    /> */}
                                    <img
                  crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                  src={maleGenericimage}
                  alt={student.name}
                  className="img-fluid rounded-circle"
                />
                  </Link>
                  <div className="ms-2">
                    <h5 className="mb-0">
                      <Link >{student?.assigned_by?.firstName}{" "}
                      {student?.assigned_by?.lastName}</Link>
                    </h5>
                    
                  </div>
                </div>
              </div>
                      <div className="d-flex align-items-center justify-content-between gx-2">
                      <div>
                  <p className="mb-0">Category</p>
                  <p className="text-dark">{student?.category_id?.category_name}</p>
                </div>
                <div>
                  <p className="mb-0"> Remark By</p>
                  <p className="text-dark"> {student?.assigned_by?.role}{" "}
                 </p>
                </div>
                
                <div>
                  <p className="mb-0">Date</p>
                  {moment(student.createdAt).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between" style={{padding:"10px"}}>
              <div className="d-flex align-items-center">
              <p className="mb-0"> Remark Reason :  </p>
              <p className="text-dark">{student.remark}</p>
              </div>
             
            </div>
          </div>
        </div>
      })}
       
      
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default MonthlyReport