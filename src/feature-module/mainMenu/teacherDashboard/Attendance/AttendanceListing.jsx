import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdClose, MdSignalCellularNull } from "react-icons/md";

import { Checkbox, notification, Table, DatePicker } from "antd";
import {
  Modal,
  Box,
  IconButton,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

import { all_routes } from "../../../router/all_routes";
import { TimePicker } from "antd";

import {
  CModal,
  CButton,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import axios from "axios";
import CommonSelect from "../../../../core/common/commonSelect";
import dayjs from "dayjs";
import { AuthContext } from "../../../helper/AuthState";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // getClassAttendanceAPI,
  getGrades,
  getSections,
  getStages,
  getTimeTableList,
  getUsers,
  getWorkingDayId,
  markAttendanceAPI,
} from "../../../../Api/AllApis";
import { CodeSandboxCircleFilled } from "@ant-design/icons";
const AttendanceListingteacher = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
const [update_id , setUpdateId] = useState('')
  const [filterData, setFilterData] = useState([]);
  const [newStudent, setNewStudent] = useState([]);
const [newAssistantTeacher , setNewAssistantTeacher ] = useState([])
  const [filterDateRange, setFilterDateRange] = useState("");
  const [ownAttendance, setownAttendance] = useState(false);
  const [assistantteaches, setassistantteaches] = useState([]);
  const academicYearId = localStorage.getItem("academicYearId");
  const [allStages, setAllStages] = useState([]);
  const [stages, setStages] = useState(null);
  const [grades, setGrades] = useState(null);
  const [section, setSection] = useState(null);
  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [open, setOpen] = useState(true);
  const [selectedClass, setSelectedClass] = useState(false);
  const [token] = useState(localStorage.getItem("accessToken"));
  const { authState } = useContext(AuthContext);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [alluser, setUserList] = useState("");
  const [visible, setVisible] = useState(false);
  const [dateRanges, setDateRanges] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [present, setPresent] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [alloption, setslotoption] = useState([]);
  const [slots, setSlots] = useState("");

  const {
    data: timeTableData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["timeTableList"],
    queryFn: () =>
      getTimeTableList(
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      ),
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {
  //   if (timeTableData) {
  //     setSlots(timeTableData?.timeTable?.[0]?.slots);
  //   }
  // }, [timeTableData]);
  const filterTimeTableData = (data) => {
    if (!data) return null;
    const now = dayjs().format("HH:mm");

    let selectedSlotObj = null;
    let gradeSectionObj = null;
    for(const datas of data){
    
    for (const entry of datas?.timeTable) {
      const slot = entry?.slots?.find((s) => {
        const startTime = dayjs(s?.startTime, "HH:mm");
        const endTime = dayjs(s?.endTime, "HH:mm");
        const currentTime = dayjs(now, "HH:mm");

        return (
          currentTime?.isAfter(startTime) && currentTime?.isBefore(endTime)
        );
      });
    
      if (slot) {
        setSlots(entry?.slots);

        selectedSlotObj = slot;
        gradeSectionObj = {
          gradeId: entry?.gradeId,
          sectionId: entry?.sectionId,
        };
        return {
          workingDaysId: datas?.workingDaysId,
          stageId: datas?.stageId,
          gradeSection: gradeSectionObj,
          currentSlot: selectedSlotObj,
        };
        // break;
      }
    }

  }
    //  if(!selectedSlot){
    //   notification.warning({message:"warning" , description:" Currently, no lectures are assigned to you. Please check today's timetable"})
    //  }
    return {
      workingDaysId: data?.workingDaysId,
      stageId: data?.stageId,
      gradeSection: gradeSectionObj,
      currentSlot: selectedSlotObj,
    };
  };

  useEffect(() => {
    if (timeTableData) {
      const datafiltered = filterTimeTableData(timeTableData);
      console.log("this is a datafirlter" , datafiltered)
      setFilterData(datafiltered);
    }
  }, [timeTableData]);

  const redirectto = () => {
    navigate("/student/attendance/certificates");
  };

  const {
    data: stageData,
    isLoadingstage,
    errorstage,
  } = useQuery({
    queryKey: ["stage"],
    queryFn: () =>
      getStages(
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      ),
    refetchOnWindowFocus: false,
  });

  const {
    data: workingday,
    isLoadingworkingday,
    errorworkingday,
  } = useQuery({
    queryKey: ["workingday", stages],
    queryFn: () =>
      getWorkingDayId(
        stages,
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      ),
    enabled: !!stages,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (workingday) {
      setDateRanges(workingday);
    }
  }, [workingday]);

  const {
    data: grade,
    isLoadinggrade,
    errorgrade,
  } = useQuery({
    queryKey: ["grade", stages],
    queryFn: () =>
      getGrades(
        stages,
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      ),
    enabled: !!stages,
    refetchOnWindowFocus: false,
  });

  const {
    data: sectionData,
    isLoadingsection,
    errorsection,
  } = useQuery({
    queryKey: ["section", grades],
    queryFn: () =>
      getSections(
        stages,
        grades,
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      ),
    enabled: !!grades,
    refetchOnWindowFocus: false,
  });

  const {
    data: userData,
    isLoadinguser,
    erroruser,
  } = useQuery({
    queryKey: ["user", grades, section],
    queryFn: () =>
      getUsers(
        grades,
        section,
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      ),
    enabled: !!grades && !!section,
    refetchOnWindowFocus: false,
  });

  const [classAttendanceData, setclassAttendanceData] = useState([]);
  const getClassAttendanceAPIs = async (queryKey) => {
    console.log("coming inside hte daa ok then", queryKey);
    const {
      page,
      pageSize,
      filterGrade,
      filterSection,
      academicYearId,
      authState,
      token,
    } = queryKey;

    console.log(
      page,
      pageSize,
      filterGrade,
      filterSection,
      academicYearId,
      authState,
      token,
      "coming inside hte daa ok then"
    );
    const response = await axios.get(
      `${
        process.env.REACT_APP_DEV_BASE_URL
      }/api/v1/attendance/class-attendance?date=${moment().format(
        "YYYY-MM-DD"
      )}&teacherId=${localStorage.getItem(
        "userId"
      )}&assistantTeachers=&students=&subjectId=&gradeId=${
        filterGrade || ""
      }&sectionId=${filterSection || ""}&academicYearId=${
        academicYearId == authState?.startYearId
          ? academicYearId
          : authState?.startYearId
      }&page=${page}&limit=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setclassAttendanceData(response.data.data);
  };
  console.log("thisi s a accessteacher filterDatafilterDatafilterDatafilterDatafilterDatafilterData" , filterData)
  const updateAttendance = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.put(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/attendance/class-attendance/${update_id}`,
        {
          teacherId: localStorage.getItem("userId"),
          gradeId: grades,
          sectionId: section,
          assistantTeachers: newAssistantTeacher,
          students: newStudent,
          date: moment().format("YYYY-MM-DD"),

          subjectId: filterData?.currentSlot?.subjectId?._id,
          academicYearId:
            academicYearId === authState?.startYearId
              ? academicYearId
              : authState?.startYearId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      notification.success({ message: "Attendance updated successfully" });
      navigate("/teacher/today/attendance", {
        state: { grade: grades, section: section, stage: stages },
      }
      );
    } catch (error) {
      console.error("Error updating attendance:", error.message || error);
      notification.error({ message: "Error updating attendance" });
    }
  };
  useEffect(() => {
    if (grade && section && userData) {
      getClassAttendanceAPIs({
        page: pagination.current,
        pageSize: pagination.pageSize,
        filterGrade: grades,
        filterSection: section,
        academicYearId,
        authState,
        token,
      });
    }
  }, [grade, section, userData]);

  useEffect(() => {
    if (classAttendanceData?.data) {
      console.log("this is a classAttendanceData" , classAttendanceData)
      const filteredData = classAttendanceData?.data?.filter((record) => {
        const recordTimeLabel = `${record.startTime} - ${record.endTime}`;
        return recordTimeLabel === selectedSlot.label;
      });
console.log("this is a filterData" , filterData)
      if (filteredData?.[0]?._id) {
        setUpdateId(filteredData?.[0]?._id);
        setPresent(false);
        if (filteredData?.[0]?.assistantTeachers) {
          const Id = filteredData?.[0]?.assistantTeachers?.map((data) => {
            return data?.asstTeacherId?._id;
          });
          const assistentTeacherId = Id?.map((data) => {
            return { asstTeacherId: data };
          });
          setassistantteaches(assistentTeacherId);
        }

        if (filteredData?.[0]?.students) {
          setownAttendance(true);

          const dataWithSelection =
            userData &&
            userData?.map((item) => {
              const selectedStudent = filteredData?.[0]?.students?.some(
                (student) => student?.studentId?._id === item._id
              );
              return {
                ...item,
                selected: selectedStudent,
              };
            });
          console.log(
            "this is data witht selection ----------------------",
            dataWithSelection
          );
          setUserList(dataWithSelection);
        }
      }
    }
  }, [classAttendanceData]);

  const mutation = useMutation({
    mutationFn: markAttendanceAPI,
    onSuccess: () => {
      notification.success({
        message: "Success",
        description: "Attendance Marked Successfully",
      });

      queryClient.invalidateQueries(["attendanceList"]);
      navigate("/teacher/today/attendance", {
        state: { grade: grades, section: section, stage: stages },
      });
    },
    onError: () => {
      notification.error({
        message: "Error",
        description: "Failed to assign",
      });
    },
  });

  const handleMarkClassAttendance = (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      notification.warning({
        message: "Warning",
        description: "Please select the slot for marking the attendance!",
      });
      return;
    }
    if (!ownAttendance) {
      notification.warning({
        message: "Warning",
        description: "Please mark your own attendance first!",
      });
      return;
    }

    const attendanceData = {
      teacherId: ownAttendance && localStorage.getItem("userId"),
      gradeId: grades,
      sectionId: section,
      assistantTeachers: assistantteaches,
      students: alluser
        .filter(
          (data) => data.selected === true && data.leaveRequests.length === 0
        )
        .map((data) => ({ studentId: data._id })),
      date: moment().format("YYYY-MM-DD"),
      startTime: filterData ? filterData?.currentSlot?.startTime : "",
      endTime: filterData ? filterData?.currentSlot?.endTime : "",
      subjectId: filterData?.currentSlot?.subjectId?._id,
      academicYearId:
        academicYearId === authState?.startYearId
          ? academicYearId
          : authState?.startYearId,
      // token: token,
    };

    mutation.mutate(attendanceData);
  };

  useEffect(() => {
    if (userData) {
      setUserList(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (sectionData) {
      setAllSections(sectionData);
    }
  }, [sectionData]);

  useEffect(() => {
    if (grade) {
      setAllGrades(grade);
    }
  }, [grade]);

  useEffect(() => {
    if (stageData) {
      setAllStages(stageData);
    }
  }, [stageData]);

  useEffect(() => {
    if (slots) {
      const slotOptions = slots.map((slot) => ({
        value: slot._id,
        label: `${slot.startTime} - ${slot.endTime}`,
        subject: slot.subjectId,
        asstTeacherId1: slot?.asstTeacherId1 ? slot?.asstTeacherId1 : null,
        asstTeacherId2: slot?.asstTeacherId2 ? slot?.asstTeacherId2 : null,
      }));

      setslotoption(slotOptions);
    }
  }, [slots]);
  useEffect(() => {
    if (selectedSlot) setSelectedClass(true);
  }, [selectedSlot]);

  const handleMarkAttendance = (data) => {
    setNewAssistantTeacher([...newAssistantTeacher,  { asstTeacherId: data._id }])
    setassistantteaches([...assistantteaches, { asstTeacherId: data._id }]);
    setVisible(false);
  };
  const handleSelect = (id) => {
    const havealready = newStudent?.some((data) => {
      return data?.studentId === id;
    });
    if(havealready) {
        const newStudents = newStudent?.filter((data) => data?.studentId!== id);
        setNewStudent(newStudents);
    } else {
      setNewStudent([...newStudent, { studentId: id }]);

    }
  

    setUserList((prevData) =>
      prevData.map((record) =>
        record._id === id ? { ...record, selected: !record.selected } : record
      )
    );
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "index",
      key: "index",
      width: 0,
      render: (_, __, index) => index + 1, 
    },
    {
      title: "Student Name",
      width: 100,
      render: (_, render) => render?.firstName,
    },
    {
      title: "Check",
      dataIndex: "selected",
      width: 50,
      render: (_, record) => (
        <Checkbox
          disabled={record?.leaveRequests.length !== 0}
          checked={record.selected}
          onChange={() => handleSelect(record?._id)}
        />
      ),
    },
  ];

  const [assistant, setAssistant] = useState("");
  const hasRun = useRef(false); // Tracks if the effect has run

  const [inputValue, setInputValue] = useState("");

  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (filterData) {
      setStages(filterData?.stageId?._id);
      setGrades(filterData?.gradeSection?.gradeId?._id);
      setSection(filterData?.gradeSection?.sectionId?._id);
      setFilterDateRange(filterData?.workingDaysId?._id);
      setSelectedSlot({
        value: filterData?.currentSlot?._id,
        label: `${filterData?.currentSlot?.startTime} - ${filterData?.currentSlot?.endTime}`,
      });
      setInputValue(filterData?.currentSlot?.subjectId?.subject);
      setFilter(filterData?.currentSlot);
    }
  }, [filterData]);

 

  console.log("thia is auser list ok then ", alluser);
  return (
    <div>
      <>
        <CModal
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">
              Mark Attendance
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="pb-3">
            Are you sure you want to mark the attendance as present?
          </CModalBody>
          <CModalFooter className="pl-0">
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton
              color="primary"
              className="ms-2"
              onClick={() => {
                if (assistant === "Teacher") {
                  setownAttendance(true);
                  setVisible(false);
                } else {
                  handleMarkAttendance(assistant);
                  setVisible(false);
                }
              }}
            >
              Yes!
            </CButton>
          </CModalFooter>
        </CModal>

        <div className="page-wrapper">
          <div className="content">
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="text-dark" style={{ fontSize: "x-large" }}>
                  Mark Attendance For Current Lecture
                </h3>
              </div>
              <div className="button-box">
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <div className="mb-2 big-button">
                    <Link
                      className="btn btn-primary big-button"
                      to={all_routes.teacher.TodayAttendance}
                    >
                      <i class="ti ti-calendar-search me-2"></i>
                      View Today Attendance
                    </Link>
                  </div>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <div className="mb-2 big-button">
                    <Link
                      className="btn btn-primary big-button "
                      to={all_routes.teacher.UpdateTodayAttendance}
                    >
                      <i class="ti ti-edit me-2"></i>
                      Update past Attendance
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="attendance-box">
              <div className="d-flex flex-column  width-res">
                <div
                  className="d-flex justify-content-between mb-3
"
                >
                  <div className="d-flex align-items-center">
                    <button
                      className={`btn ${
                        ownAttendance ? "btn-success" : "btn-success-light"
                      }  big-button mb-2`}
                      disabled={ownAttendance}
                      onClick={() => {
                        setVisible(true);
                        setAssistant("Teacher");
                      }}
                    >
                      Mark Own Attendance
                    </button>
                  </div>
                  {console.log("this is tehe filetr data ok" , filterData)}
                  {filterData &&
                    (filterData?.currentSlot?.asstTeacherId1 ||
                      filterData?.currentSlot?.asstTeacherId2) && (
                      <div
                        className="card p-2 d-flex flex-row align-items-center gap-2 justify-content-center  desktop-show"
                        style={{ marginBottom: "0px" }}
                      >
                        <h5 className="text-center">Assistent teacher</h5>
                        <div className="d-flex gap-2 justify-content-between align-items-center px-3">
                          <span className="">
                            {filterData?.currentSlot?.asstTeacherId1?.firstName}{" "}
                            {filterData?.currentSlot?.asstTeacherId1?.lastName}
                          </span>

                          <button
                            className={`btn ${
                              assistantteaches?.length > 0 &&
                              filterData?.currentSlot?.asstTeacherId1?._id &&
                              assistantteaches?.some(
                                (data) =>
                                  data?.asstTeacherId ===
                                  filterData?.currentSlot?.asstTeacherId1?._id
                              )
                                ? "btn-success"
                                : "btn-success-light"
                            }`}
                            disabled={
                              assistantteaches?.length > 0 &&
                              filterData?.currentSlot?.asstTeacherId1?._id &&
                              assistantteaches?.some(
                                (data) =>
                                  data?.asstTeacherId ===
                                  filterData?.currentSlot?.asstTeacherId1?._id
                              )
                            }
                            onClick={() => {
                              setVisible(true);
                              setAssistant(
                                filterData?.currentSlot?.asstTeacherId1
                              );
                            }}
                          >
                            Mark present
                          </button>
                        </div>
                        {filterData &&
                          filterData?.currentSlot?.asstTeacherId2 && (
                            <div className="d-flex justify-content-between gap-2 align-items-center px-3">
                              <span className="">
                                {
                                  filterData?.currentSlot?.asstTeacherId2
                                    ?.firstName
                                }{" "}
                                {
                                  filterData?.currentSlot?.asstTeacherId2
                                    ?.lastName
                                }
                              </span>

                              <button
                                className={`btn ${
                                  assistantteaches?.length > 0 &&
                                  filterData?.currentSlot?.asstTeacherId2
                                    ?._id &&
                                  assistantteaches?.some(
                                    (data) =>
                                      data?.asstTeacherId ===
                                      filterData?.currentSlot?.asstTeacherId2
                                        ?._id
                                  )
                                    ? "btn-success"
                                    : "btn-success-light"
                                }`}
                                disabled={
                                  assistantteaches?.length > 0 &&
                                  filterData?.currentSlot?.asstTeacherId2
                                    ?._id &&
                                  assistantteaches?.some(
                                    (data) =>
                                      data?.asstTeacherId ===
                                      filterData?.currentSlot?.asstTeacherId2
                                        ?._id
                                  )
                                }
                                onClick={() => {
                                  setVisible(true);
                                  setAssistant(
                                    filterData?.currentSlot?.asstTeacherId2
                                  );
                                }}
                              >
                                Mark present
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                </div>
                <div className="card p-3 desktop-show">
                  <div
                    className="d-flex gap-2 justify-content-between"
                    style={{ flexWrap: "wrap" }}
                  >
                    <div className="mb-3 flex-fills"
                    >
                      
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

                      <CommonSelect
                        className="select"
                        options={allStages?.map((cat) => ({
                          value: cat._id,
                          label: cat.stage,
                        }))}
                        value={
                          stages
                            ? {
                                value: stages,
                                label: allStages.find(
                                  (cat) => cat._id === stages
                                )?.stage,
                              }
                            : null
                        }
                        onChange={(e) => {
                          setStages(e ? e.value : null);
                          getGrades(e.value);
                        }}
                        disabled={true}
                      />
                    </div>

                    <div className="mb-3 flex-fills ">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Grade
                      </label>

                      <CommonSelect
                         disabled={true}
                        className="select"
                        options={allGrades?.map((cat) => ({
                          value: cat._id,
                          label: cat.grade,
                        }))}
                        value={
                          grades
                            ? {
                                value: grades,
                                label: allGrades.find(
                                  (cat) => cat._id === grades
                                )?.grade,
                              }
                            : null
                        }
                        onChange={(e) => {
                          setGrades(e ? e.value : null);
                          getSections(e.value);
                        }}
                      />
                    </div>
                    <div className="mb-3 flex-fills ">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Section
                      </label>

                      <CommonSelect
                         disabled={true}
                        className="select"
                        options={allSections?.map((cat) => ({
                          value: cat?._id,
                          label: cat?.section,
                        }))}
                        value={
                          section
                            ? {
                                value: section,
                                label: allSections?.find(
                                  (cat) => cat?._id === section
                                )?.section,
                              }
                            : null
                        }
                        onChange={(e) => {
                          setSection(e?.value);
                        }}
                      />
                    </div>

                    <div className="mb-3  flex-fills">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Working Day
                      </label>

                      <select
                        disabled
                        value={filterDateRange}
                        onChange={(e) => {
                          setFilterDateRange(e?.target?.value);
                        }}
                        className="form-control form-select"
                      >
                        <option value="">Working Day Range</option>
                        {dateRanges?.map((res, i) => (
                          <option value={res?._id} key={i}>
                            {moment(res?.start_date)?.format("DD-MM-YYYY")} -{" "}
                            {moment(res?.end_date)?.format("DD-MM-YYYY")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3   flex-fills">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Slot
                      </label>
                      {console.log(
                        "this is a selected slot",
                        selectedSlot,
                        "this is the slot option",
                        alloption
                      )}
                      <CommonSelect
                        className="select"
                        options={alloption}
                        value={
                          selectedSlot
                            ? {
                                value: selectedSlot?.value,
                                label:
                                  alloption?.find(
                                    (opt) => opt?.value === selectedSlot?.value
                                  )?.label || "",
                              }
                            : null
                        }
                        onChange={(e) => {
                          setSelectedSlot(e ? e : null);
                          setInputValue(e.subject.subject);
                        }}
                        disabled={true}
                      />
                    </div>
                    <div className="mb-3  flex-fills">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Date
                      </label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format={{
                          format: "DD-MM-YYYY",
                          type: "mask",
                        }}
                        disabled
                        value={moment()}
                        placeholder="Select Date"
                      />
                    </div>
                    <div className="mb-3 flex-fills">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        className="text-center input"
                        style={{
                          width:"100%",
                          borderRadius: "5px",
                          border: "1px solid #d9d9d9",
                          padding: "8px 0px",
                        }}
                        value={inputValue}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              {filterData &&
                (filterData?.currentSlot?.asstTeacherId1 ||
                  filterData?.currentSlot?.asstTeacherId2) && (
                  <div className="card p-2 d-flex flex-column gap-2 justify-content-center mobile-show">
                    <h5 className="text-center mb-1">Assistent teacher</h5>
                    <div className="d-flex gap-2 justify-content-between align-items-center px-3">
                      <span className="">
                        {filterData?.currentSlot?.asstTeacherId1?.firstName}{" "}
                        {filterData?.currentSlot?.asstTeacherId1?.lastName}
                      </span>

                      <button
                        className={`btn ${
                          assistantteaches?.length > 0 &&
                          filterData?.currentSlot?.asstTeacherId1?._id &&
                          assistantteaches?.some(
                            (data) =>
                              data?.asstTeacherId ===
                              filterData?.currentSlot?.asstTeacherId1?._id
                          )
                            ? "btn-success"
                            : "btn-success-light"
                        }`}
                        disabled={
                          assistantteaches?.length > 0 &&
                          filterData?.currentSlot?.asstTeacherId1?._id &&
                          assistantteaches?.some(
                            (data) =>
                              data?.asstTeacherId ===
                              filterData?.currentSlot?.asstTeacherId1?._id
                          )
                        }
                        onClick={() => {
                          setVisible(true);
                          setAssistant(filterData?.currentSlot?.asstTeacherId1);
                        }}
                      >
                        Mark present
                      </button>
                    </div>
                    {filterData && filterData?.currentSlot?.asstTeacherId2 && (
                      <div className="d-flex justify-content-between gap-2 align-items-center px-3">
                        <span className="">
                          {filterData?.currentSlot?.asstTeacherId2?.firstName}{" "}
                          {filterData?.currentSlot?.asstTeacherId2?.lastName}
                        </span>

                        <button
                          className={`btn ${
                            assistantteaches?.length > 0 &&
                            filterData?.currentSlot?.asstTeacherId2?._id &&
                            assistantteaches.some(
                              (data) =>
                                data?.asstTeacherId ===
                                filterData?.currentSlot?.asstTeacherId2?._id
                            )
                              ? "btn-success"
                              : "btn-success-light"
                          }`}
                          disabled={
                            assistantteaches?.length > 0 &&
                            filterData?.currentSlot?.asstTeacherId2?._id &&
                            assistantteaches.some(
                              (data) =>
                                data?.asstTeacherId ===
                                filterData?.currentSlot?.asstTeacherId2?._id
                            )
                          }
                          onClick={() => {
                            setVisible(true);
                            setAssistant(
                              filterData?.currentSlot?.asstTeacherId2
                            );
                          }}
                        >
                          Mark present
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </div>

            <div className="card p-3 mobile-show">
              <div className="mb-3 flex-fill flex-1">
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

                <CommonSelect
                  className="select"
                  options={allStages?.map((cat) => ({
                    value: cat._id,
                    label: cat.stage,
                  }))}
                  value={
                    stages
                      ? {
                          value: stages,
                          label: allStages.find((cat) => cat._id === stages)
                            ?.stage,
                        }
                      : null
                  }
                  onChange={(e) => {
                    setStages(e ? e.value : null);
                    setAllGrades([]);
                    getGrades(e.value);
                  }}
                />
              </div>

              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label  font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Grade
                </label>

                <CommonSelect
                  className="select"
                  options={allGrades?.map((cat) => ({
                    value: cat._id,
                    label: cat.grade,
                  }))}
                  value={
                    grades
                      ? {
                          value: grades,
                          label: allGrades.find((cat) => cat._id === grades)
                            ?.grade,
                        }
                      : null
                  }
                  onChange={(e) => {
                    setGrades(e ? e.value : null);
                    setAllSections([]);
                    getSections(e.value);
                  }}
                />
              </div>
              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label  font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Section
                </label>

                <CommonSelect
                  className="select"
                  options={allSections?.map((cat) => ({
                    value: cat._id,
                    label: cat.section,
                  }))}
                  value={
                    section
                      ? {
                          value: section,
                          label: allSections.find((cat) => cat._id === section)
                            ?.section,
                        }
                      : null
                  }
                  onChange={(e) => setSection(e.value)}
                />
              </div>

              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label  font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Working Day
                </label>

                <CommonSelect
                  className="select"
                  options={
                    dateRanges?.map((res) => ({
                      value: res?._id,
                      label: `${moment(res.start_date).format(
                        "DD-MM-YYYY"
                      )} - ${moment(res.end_date).format("DD-MM-YYYY")}`,
                    })) || []
                  }
                  value={
                    filterDateRange
                      ? {
                          value: filterDateRange,
                          label: dateRanges.find(
                            (res) => res._id === filterDateRange
                          )
                            ? `${moment(
                                dateRanges.find(
                                  (res) => res._id === filterDateRange
                                )?.start_date
                              ).format("DD-MM-YYYY")} - ${moment(
                                dateRanges.find(
                                  (res) => res._id === filterDateRange
                                )?.end_date
                              ).format("DD-MM-YYYY")}`
                            : "",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFilterDateRange(
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                />
              </div>

              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label  font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Slot
                </label>

                <CommonSelect
                  className="select"
                  options={alloption}
                  value={
                    selectedSlot
                      ? {
                          value: selectedSlot.value,
                          label:
                            alloption.find(
                              (opt) => opt.value === selectedSlot.value
                            )?.label || "",
                        }
                      : null
                  }
                  onChange={(e) => {
                    setSelectedSlot(e ? e : null);
                    setInputValue(e.subject.subject);
                  }}
                  disabled={true}
                />
              </div>

              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label  font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Date
                </label>
                <DatePicker
                  className="form-control datetimepicker"
                  format={{
                    format: "DD-MM-YYYY",
                    type: "mask",
                  }}
                  disabled
                  value={moment()}
                  placeholder="Select Date"
                />
              </div>
              <div className="mb-3 flex-fill flex-1">
                <label
                  className="form-label  font-size-seperate"
                  style={{
                    display: "block",
                    fontSize: "13px !important",
                    textAlign: "start",
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  className="text-center input"
                  style={{
                    width:"100%",
                    borderRadius: "5px",
                    border: "1px solid #d9d9d9",
                    padding: "8px 0px",
                  }}
                  value={inputValue}
                  disabled
                />

                {/* <button
                  className="btn btn-light"
                  style={{ marginLeft: "5px" }}
                  onClick={() => {
                    setStages({ value: "", label: "" });
                    setGrades({ value: "", label: "" });
                    setSection({ value: "", label: "" });
                    setDateRanges({ value: "", label: "" });

                    setInputValue("");
                    setSelectedSlot([]);
                    setAllGrades([]);
                    setAllSections([]);
                    setslotoption([]);
                  }}
                >
                  Reset
                </button> */}
              </div>
            </div>

            <div className="card mt-5">
              <Table
                rowKey="_id"
                columns={columns}
                width={300}
                className="bordered-table width-box"
                dataSource={alluser}
                pagination={false}
              />
            </div>

            <div className="d-flex justify-content-center mb-5">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  if (!present) {
                    updateAttendance(e);
                  } else {
                    handleMarkClassAttendance(e);
                  }
                }}
                disabled={!filterData?.gradeSection}
              >
                Present
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default AttendanceListingteacher;
