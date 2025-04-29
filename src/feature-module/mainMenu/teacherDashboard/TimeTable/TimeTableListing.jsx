import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import maleGenericimage from "../../../../image/images/malegeneric.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommonSelect from "../../../../core/common/commonSelect";
import axios from "axios";
import { all_routes } from "../../../router/all_routes";
import { AuthContext } from "../../../helper/AuthState";
import moment from "moment";
import dayjs from "dayjs";
const TimeTableListing = () => {
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
  const [search, setSearch] = useState("");
  const [sortBy, setSoryBy] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [dayOfWeek, setDayOfWeek] = useState(dayjs().format("dddd"));
  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [startDate, endDate] = dateRange;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
  const [timetableShow, setTimeTableShow] = useState([]);

  const [timeTableData, setTimeTableData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const token = localStorage.getItem("accessToken");
  function extractTimetableData(dataArray) {
    const groupedTimeTable = {};

    dataArray.forEach((dataObj) => {
      const currentDay = dataObj.day;

      dataObj.timeTable.forEach((entry) => {
        const grade = entry.gradeId.grade;
        const section = entry.sectionId.section;
        const key = `${grade}-${section}`;

        if (!groupedTimeTable[key]) {
          groupedTimeTable[key] = { days: {} };
        }

        if (!groupedTimeTable[key].days[currentDay]) {
          groupedTimeTable[key].days[currentDay] = [];
        }

        const entryWithDay = { ...entry, day: currentDay };

        groupedTimeTable[key].days[currentDay].push(entryWithDay);
      });
    });
    
    const resultArray = Object.entries(groupedTimeTable).flatMap(([gradeSection, days]) => 
      Object.entries(days).map(([day, entries]) => ({
        gradeSection,
        day,
        entries
      }))
    );
    
    setTimeTableShow(resultArray);
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

      const result = Object.keys(groupedData).map((day) => ({
        Day: day,
        Schedule: groupedData[day],
      }));

      setTimeTableShow(result);
      setLoading(false);
    }
   
      setLoading(false);
    
  }, [timeTableData]);
  const getTimeTableList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/time-table/teacher/${localStorage.getItem("userId")}?day=${
          dayOfWeek ? dayOfWeek : ""
        }&date=${selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : ''}&gradeId=${filterGrade ? filterGrade : ""}&sectionId=${
          filterSection ? filterSection : ""
        }&academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedData = extractTimetableData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // getUsers();
    getTimeTableList();
  }, [
    filterGrade,
    filterSection,
    dayOfWeek,
    academicYearId,
    authState?.startYearId,
    upcomingyear,
  ]);
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
      render: (text, record, index) => index + 1, // Auto-increment serial number
    },
    {
      title: "Day",
      dataIndex: "Day",
      key: "Day",
    },
    {
      title: "Grade",
      dataIndex: "Grade",
      key: "Grade",
    },
    {
      title: "Section",
      dataIndex: "Section",
      key: "Section",
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
  ];
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
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      const dataSource = new Date(date);
const dayOfWeek = dayjs(dataSource).format("dddd");
      setDayOfWeek(dayOfWeek);
    } else {
      setSelectedDate(null);
      setDayOfWeek("");
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

  const bgColors = [
    "bg-transparent-primary",
    "bg-transparent-success",
    "bg-transparent-pending",
    "bg-transparent-info",
    "bg-transparent-light",
    "bg-transparent-warning",
    "bg-transparent-danger ",
  ];
  const handleClear = () => {
    setSelectedDate(null); 
    setDayOfWeek("");

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
                Time Table
              </h3>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap"></div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative w-100-responsive">
                  <DatePicker
                      selected={selectedDate ? new Date(selectedDate) : moment().format("DD-MM-YYYY").toDate()}

                     dateFormat="dd/MM/yyyy"
                    onChange={handleDateChange}
                    className="select"
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
                <div className="input-icon-start mb-3  me-2 position-relative w-100-responsive ">
                  <input
                    value={dayOfWeek}
                    readOnly
                    className="input-day"
                    placeholder="Selected Day of the Week"
                    disabled
                  />
                </div>
                <div className="input-icon-start mb-3 me-2 position-relative w-100-responsive">
                  <CommonSelect
                    className="select"
                    options={[
                      { value: "", label: "Select a Grade" },
                      ...allGrades.map((grade) => ({
                        value: grade._id,
                        label: grade.grade,
                      })),
                    ]}
                    value={
                      filterGrade
                        ? {
                            value: filterGrade,
                            label: allGrades.find(
                              (grade) => grade._id === filterGrade
                            )?.grade,
                          }
                        : { value: "", label: "Select a Grade" }
                    }
                    onChange={(e) => {
                      setFilterGrade(e ? e.value : "");
                      setFilterSection("");
                    }}
                    isDisabled={!selectedDay}
                  />
                </div>
                <div className="input-icon-start mb-3 me-2 position-relative w-100-responsive">
                  <CommonSelect
                    className="select"
                    options={[
                      { value: "", label: "Select a Section" },
                      ...allSections.map((section) => ({
                        value: section._id,
                        label: section.section,
                      })),
                    ]}
                    value={
                      filterSection
                        ? {
                            value: filterSection,
                            label: allSections.find(
                              (section) => section._id === filterSection
                            )?.section,
                          }
                        : { value: "", label: "Select a Section" }
                    }
                    onChange={(e) => setFilterSection(e ? e.value : "")}
                    isDisabled={!filterGrade} // Disable if no grade is selected
                  />
                </div>
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    onClick={() => {
                      setSelectedDay(""); 
                      setFilterGrade(""); 
                      setFilterSection(""); 
                    }}
                  >
                    Reset
                  </Link>
                </div>
              </div>
            </div>
            {/* <div className="card-body p-0 pb-3">
            <Table
              rowKey="_id"
              columns={columns}
              className="bordered-table"
              dataSource={timeTableData}
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
          </div> */}

            <div className="card-body p-0 pb-3">
              

               
      {
                timetableShow && timetableShow.length > 0   ?  timetableShow.map((data , index) => {
                  return <div className="card-body pb-0" key={index}>
                    <h1 className="text-center  bg-transparent-info" style={{
                         borderRadius:"5px",
                      padding: "10px",
                         fontSize:"18px"
                    }}>{data?.gradeSection}</h1>
             <div className="d-flex flex-nowrap overflow-auto mt-5">
               {
                        Object.entries(data.entries)?.map(([day, entries]) => {
                          return (
                            <div
                              key={index}
                              className="d-flex flex-column me-4 flex-fill"
                            >
                              <div className="mb-3">
                                <h6>{day ? day : ''}</h6>
                              </div>
                              {entries?.[0]?.slots?.map((data, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={`${
                                      bgColors[index % bgColors.length]
                                    } rounded p-3 mb-4`}
                                  >
                                    <p className="d-flex align-items-center text-nowrap mb-1">
                                      <i className="ti ti-clock me-1" />
                                      {data?.startTime} - {data?.endTime}
                                    </p>
                                    <p className="text-dark">
                                      Subject : {data?.subjectId?.subject }
                                    </p>
                                    <div className="bg-white rounded p-1 mt-3" style={{minWidth:"max-content"}}>
                                      <Link className="text-muted d-flex align-items-center gap-3">
                                        <img
                                          crossOrigin={
                                            process.env.REACT_APP_DEV_BASE_URL
                                          }
                                          src={
                                            data?.mainTeacherId?.photo
                                              ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${data?.mainTeacherId?.photo}`
                                              : maleGenericimage
                                          }
                                          alt="no photo"
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "20%",
                                          }}
                                        />
                                        {data?.mainTeacherId?.firstName } {data?.mainTeacherId?.lastName }
                                      </Link>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                           

                        })  
           
                      }
             </div>
           </div>
         }) :   <h3 className="p-3">No timeTable for this date</h3>
      }





          
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TimeTableListing;
