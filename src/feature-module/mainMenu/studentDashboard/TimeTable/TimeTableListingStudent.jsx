

import { FaTimes } from 'react-icons/fa'; // Import cross icon (FaTimes) from React Icons

import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import maleGenericimage from "../../../../image/images/malegeneric.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import { all_routes } from "../../../router/all_routes";
import { AuthContext } from "../../../helper/AuthState";
import { Preloader } from "../../../../core/common/loader";
import dayjs from 'dayjs';

const TimeTableListingStudent = () => {
  const routes = all_routes;
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

  const [dateRange, setdateRange] = useState([null, null]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dayOfWeek, setDayOfWeek] = useState(dayjs().format('dddd'));
  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [startDate, endDate] = dateRange;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);

  const [timeTableData, setTimeTableData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleClear = () => {
    setSelectedDate(null); 
    setDayOfWeek("");

  };
  const token = localStorage.getItem("accessToken");
  const [timetableShow, setTimeTableShow] = useState([]);
  function extractTimetableData(dataArray) {
    let extractedData = [];
    dataArray.forEach((item) => {
      const day = item.day;
  
      if (Array.isArray(item.timeTable)) {
        item.timeTable.forEach((timetable) => {
          const grade = timetable.gradeId?.grade || "N/A";
          const section = timetable.sectionId?.section || "N/A";
          const classTeacher = `${timetable?.classTeacherId?.firstName || ""} ${timetable?.classTeacherId?.lastName || ""}`.trim();
          const classTeacherPhoto = timetable?.classTeacherId?.photo || "";
  
          if (Array.isArray(timetable.slots)) {
            timetable.slots.forEach((slot) => {
              extractedData.push({
                Day: day,
                Grade: grade,
                Section: section,
                StartTime: slot.startTime || "N/A",
                EndTime: slot.endTime || "N/A",
                SubjectName: slot.subjectId?.subject || "No Subject",
                ClassTeacher: slot?.mainTeacherId ? `${slot.mainTeacherId.firstName || ""} ${slot.mainTeacherId.lastName || ""}`.trim() || "No Teacher"
                : "No Teacher",
                ClassTeacherPhoto: slot?.mainTeacherId?.photo,
                AssistantTeacher: slot.asstTeacherId1
                  ? `${slot.asstTeacherId1.firstName} ${slot.asstTeacherId1.lastName}`
                  : "No Assistant Teacher",
              });
            });
          }
        });
      }
    });
  
   
    

    const updatedData = extractedData.map(item => {
      const match = dataArray?.[0]?.additionals?.find(add => add.start_time === item.StartTime && add.end_time === item.EndTime);
  
      if (match) {
          return { ...item,additionalDetails: match };
      }
      
      return item;
  });



console.log("-----------------------------------" , extractedData)
    setTimeTableData(updatedData);
    return extractedData;
  }
  useEffect(() => {
    if (timeTableData.length > 0) {
      const groupedData = timeTableData.reduce((acc, curr) => {
        if (!acc[curr.Day]) {
          acc[curr.Day] = [];
        }
        acc[curr.Day].push(curr);
        return acc;
      }, {});
    console.log("0-0-0-0--" , groupedData)
      const result = Object.keys(groupedData).map(day => ({
        Day: day,
        Schedule: groupedData[day]
      }));

   console.log("this is a timetable data" , timeTableData)

      setTimeTableShow(result);
      setLoading(false);
    }
    else {
      setTimeTableShow([]);
      setLoading(false);
    }
  }, [timeTableData]);
  

  useEffect(() => {
    const userInhead = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGrade(res?.data?.data?.stageGradeSectionData?.grade?._id);
        setSection(res?.data?.data?.stageGradeSectionData?.section?._id);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    userInhead();
  }, []);


  // &date=${selectedDate ?  moment(selectedDate).format("DD-MM-YYYY") : ''}


  useEffect(() => {
     if(timetableShow){
        
     }
  },[timetableShow])

  const getTimeTableList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/time-table/grade-section/${grade}/${section}?day=${dayOfWeek || ''}&date=${selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : ''}&academicYearId=${
          academicYearId === authState?.startYearId ? academicYearId : authState?.startYearId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if (response?.data?.data) {
        extractTimetableData(response?.data?.data);
      }
      else { 
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (grade && section) {
      getTimeTableList();
    }
  }, [
    grade,
    section,
    dayOfWeek,
    academicYearId,
    authState?.startYearId,
    upcomingyear,
  ]);

  const handleDateChange = (date) => {
    if (date) {
      console.log("date is here" , date)
      setSelectedDate(date);
      const dataSource = new Date(date);
const dayOfWeek = dayjs(dataSource).format("dddd");
      setDayOfWeek(dayOfWeek);
    } else {
      setSelectedDate(null);
      setDayOfWeek("");
    }
  };
  const [pointsList, setPointsList] = useState([]);
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = React.useState(null);

  const [selectAll, setSelectAll] = useState(false);
  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];
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

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const columns = [
    {
      title: "Sr No",
      dataIndex: "serialNo",
      key: "serialNo",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Start Time",
      dataIndex: "StartTime",
      key: "StartTime",
    },
    {
      title: "End Time",
      dataIndex: "EndTime",
      key: "EndTime",
    },
    {
      title: "Subject",
      dataIndex: "SubjectName",
      key: "SubjectName",
    },
    {
      title: "Teacher",
      dataIndex: "ClassTeacher",
      key: "ClassTeacher",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            crossOrigin={process.env.REACT_APP_DEV_BASE_URL}
            src={
              record.ClassTeacherPhoto
                ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${record.ClassTeacherPhoto}`
                : maleGenericimage
            }
            alt="no photo"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
          <span>{record.ClassTeacher}</span>
        </div>
      ),
    },
  ];

  const bgColors = [
    "bg-transparent-primary",
    "bg-transparent-success",
    "bg-transparent-pending",
    "bg-transparent-info",
    "bg-transparent-light",
    "bg-transparent-warning",
    "bg-transparent-danger ",
  ];
console.log("thisis a table show ok then" , timetableShow)
  return (
    <>
      {/* <Preloader/> */}
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex custom-responsive align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1" style={{ fontSize: "x-large" }}>
                Time Table
              </h3>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap"></div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">List</h4>

              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative w-100-responsive">
                  <DatePicker
                     selected={selectedDate ? new Date(selectedDate) : moment().format("DD-MM-YYYY").toDate()}
                     
                                          dateFormat="dd/MM/yyyy"
                    onChange={handleDateChange}
                    // disabled
                    className="select"
                    // allowClear={true}  

                    // import DatePicker from "react-datepicker";
                    // import "react-datepicker/dist/react-datepicker.css";
                    // isClearable={true}
                    
                  />
                    {/* {selectedDate && (
        <FaTimes
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            cursor: 'pointer',
            fontSize: '16px',
            zIndex: 1,
            color: 'rgba(0, 0, 0, 0.45)', 
          }}
        />
      )} */}
                </div>

                <div className="input-icon-start mb-3 me-2 position-relative w-100-responsive">
                  <input
                    value={dayOfWeek}
         className='input-day'
                       readOnly
                    placeholder="Selected Day of the Week"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0 pb-3">
              {loading ? (
                <Preloader />
              ) : (
                <div className="card-body pb-0">
                  <div className="d-flex flex-nowrap overflow-auto">
                    {timetableShow &&
                        timetableShow.length > 0  
                      ? 
                      timetableShow.map((timetable, index) => {
                        return (
                          <div
                            key={index}
                            className="d-flex flex-column me-4 flex-fill"
                          >
                            <div className="mb-3">
                              <h6>{timetable?.Day}</h6>
                            </div>

                            {timetable?.Schedule.map((data, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`${
                                    bgColors[index % bgColors.length]
                                  } rounded p-3 mb-4`}
                                >
                                  <p className="d-flex align-items-center text-nowrap mb-1">
                                    <i className="ti ti-clock me-1" />
                                    {data?.StartTime} - {data?.EndTime}
                                  </p>
                                  <p className="text-dark">
                                  {data?.additionalDetails ? 'Additional Period' :   'Subject'} : { data?.additionalDetails ? data?.additionalDetails?.title : data?.SubjectName}
                                  </p>
                                {   !data?.additionalDetails && <div className="bg-white rounded p-1 mt-3" style={{minWidth:"max-content"}}>
                                    <Link className="text-muted d-flex align-items-center gap-3">
                                      <img
                                        crossOrigin={
                                          process.env.REACT_APP_DEV_BASE_URL
                                        }
                                        src={
                                          data?.ClassTeacherPhoto
                                            ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${data?.ClassTeacherPhoto}`
                                            : maleGenericimage
                                        }
                                        alt="no photo"
                                        style={{
                                          width: "35px",
                                          height: "35px",
                                          borderRadius: "20%",
                                        }}
                                      />
                                      {data?.ClassTeacher}
                                    </Link>
                                  </div>}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }) : <>
                          <h3 className='p-3'>No timeTable for this date</h3>
                        </>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTableListingStudent;
