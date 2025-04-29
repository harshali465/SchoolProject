import { useContext, useEffect, useState } from "react";
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
  Tooltip,
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
const AttendanceListingteacherEdit = () => {
  const [isUpdate, setIsUpdate] = useState(true);
  const location = useLocation();
  const dataforlecture = location?.state?.state;
  console.log("dataforlecture", dataforlecture);
  const [filterDateRange, setFilterDateRange] = useState("");
  const [ownAttendance, setownAttendance] = useState(false);
  const [assistantteaches, setassistantteaches] = useState([]);
console.log("this is a assistance teacher" , assistantteaches)
  console.log("this is assistent teacher", assistantteaches);
  const academicYearId = localStorage.getItem("academicYearId");
  const [allStages, setAllStages] = useState([]);
  const [stages, setStages] = useState("");
  const [grades, setGrades] = useState("");
  const [section, setSection] = useState("");
  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [open, setOpen] = useState(true);
  const [selectedClass, setSelectedClass] = useState(false);
  const [token] = useState(localStorage.getItem("accessToken"));
  const { authState } = useContext(AuthContext);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [alluser, setUserList] = useState("");
  const [visible, setVisible] = useState(false);
  const [newStudent, setNewStudent] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [alloption, setslotoption] = useState([]);
  const [slots, setSlots] = useState("");
const [shouldUpdate , setShoudUpdate] = useState(false)
  const attendanceDate = moment(dataforlecture?.date);
  const isBefore72Hours = moment().diff(attendanceDate, "hours") > 72;

  const handleClick = (e) => {
    if (dataforlecture?._id) {
      if (!shouldUpdate) {
        notification.warning({
          message: "Warning",
          description:
            "Please update at least one student's attendance before proceeding.",
        });
        return;
      }
      updateAttendance(e);
    } else {
      markAttendance(e);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/stage-grade-section/get-student-by-grade-section?gradeId=${
          dataforlecture?.gradeId ? dataforlecture?.gradeId : ""
        }&sectionId=${
          dataforlecture?.sectionId ? dataforlecture?.sectionId : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const selectedIds = dataforlecture.students.map(
        (item) => item.studentId._id
      );
      let dataWithSelection;
      if (!dataforlecture?._id) {
        dataWithSelection = response?.data?.data.map((item) => ({
          ...item,
          selected: true,
        }));
      } else {
        dataWithSelection = response?.data?.data.map((item) => ({
          ...item,
          selected: selectedIds.includes(item._id),
        }));
      }
      setUserList(dataWithSelection);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    }
  };

  const getTimeTableList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/time-table/teacher/${localStorage.getItem(
          "userId"
        )}?workingDaysId=${filterDateRange}&day=${dayjs().format(
          "dddd"
        )}&date=${dayjs().format("YYYY-MM-DD")}&gradeId=${
          grades ? grades : ""
        }&sectionId=${section ? section : ""}&academicYearId=${
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

      setSlots(response?.data?.data?.[0]?.timeTable?.[0]?.slots);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slots) {
      const slotOptions = slots.map((slot) => ({
        value: slot._id,
        label: `${slot.startTime} - ${slot.endTime}`,
        subject: slot.subjectId,
        assistantTeacher1: slot?.asstTeacherId1 ? slot?.asstTeacherId1 : null,
        assistantTeacher2: slot?.asstTeacherId2 ? slot?.asstTeacherId2 : null,
      }));

      setslotoption(slotOptions);
    }
  }, [slots]);
  useEffect(() => {
    if (selectedSlot) setSelectedClass(true);
  }, [selectedSlot]);
  useEffect(() => {
    if (dataforlecture) {
      // getTimeTableList();
      getUsers();
    }
  }, [dataforlecture]);
  const updateAttendance = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/attendance/class-attendance/${
          dataforlecture?._id ? dataforlecture?._id : ""
        }`,
        {
          // asstTeacherId
          teacherId: localStorage.getItem("userId"),
          gradeId: dataforlecture?.gradeId,
          sectionId: dataforlecture?.sectionId,
          assistantTeachers: assistantteaches?.selected  ? assistantteaches?.selected?.map((data)=>{return {asstTeacherId:data} }) : [],
          students: newStudent,
          date: moment().format("YYYY-MM-DD"),

          subjectId: dataforlecture?.subjectId,
          academicYearId:
            academicYearId == authState?.startYearId
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
      navigate(
        location?.state?.page === "today"
          ? "/teacher/today/attendance"
          : "/teacher/update/today/attendance",
        {
          state: {
            grade: location?.state?.grade ? location?.state?.grade : "",
            section: location?.state?.section ? location?.state?.section : "",
            stage: location?.state?.stage ? location?.state?.stage : "",
            workingDayid: location?.state?.workingDay ?  location?.state?.workingDay  : '',
            date:  location?.state?.date ? location?.state?.date : '' 
          },
        }
      );
    } catch (error) {
      console.error("Error updating attendance:", error.message || error);
      notification.error({ message: "Error updating attendance" });
    }
  };

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

  useEffect(() => {
    if (dataforlecture) {
      setassistantteaches({ allData: dataforlecture?.assistantTeachers });
    }
  }, [dataforlecture]);

  const getSections = async (sid, id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage/${stages}/grade/${sid}/section`,
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

  const handleMarkAttendance = (data) => {
    setassistantteaches({
      ...assistantteaches,
      selected: [...(assistantteaches.selected || []), data._id],
    });
    setVisible(false);
  };

  const handleSelect = (id) => {
    setNewStudent([...newStudent, { studentId: id }]);
    setShoudUpdate(true)
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
      render: (_, __, index) => index + 1, // Calculates serial number
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
          disabled={record?.leaveRequests?.length !== 0}
          checked={record.selected}
          onChange={() => handleSelect(record?._id)}
        />
      ),
    },
  ];

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const handleClassSelect = () => {
    // if (selectedClass) {
    setOpen(false); // Close modal when class is selected
    // }
  };
  const [assistant, setAssistant] = useState("");

  const markAttendance = async (e) => {
    e.preventDefault();

    if (!ownAttendance) {
      notification.warning({
        message: "warning",
        description: "Plese mark your own attendance first ! ",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/class-attendance`,

        {
          // workingDayId:location?.state?.workingDay ? location?.state?.workingDay : '' ,
          teacherId: localStorage.getItem("userId"),
          gradeId: dataforlecture?.gradeId,
          sectionId: dataforlecture?.sectionId,
          assistantTeachers: assistantteaches.selected?.map((data) => ({
            asstTeacherId: data
          }))
          ,
          students: alluser
            .filter(
              (data) =>
                data.selected === true && data.leaveRequests.length === 0
            )
            .map((data) => ({ studentId: data._id })),
          date: moment().format("YYYY-MM-DD"),
          startTime: dataforlecture?.startTime,
          endTime: dataforlecture?.endTime,
          subjectId: dataforlecture?.subjectId,
          academicYearId:
            academicYearId == authState?.startYearId
              ? academicYearId
              : authState?.startYearId,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notification.success({
        message: "sucess",
        description: " Attendance Marked  Successfully",
      });
      navigate(
        location?.state?.page === "today"
          ? "/teacher/today/attendance"
          : "/teacher/update/today/attendance",
        {
          state: {
            grade: location?.state?.grade ? location?.state?.grade : "",
            section: location?.state?.section ? location?.state?.section : "",
            stage: location?.state?.stage ? location?.state?.stage : "",
            workingDayid: location?.state?.workingDay ?  location?.state?.workingDay  : '',
            date:  location?.state?.date ? location?.state?.date : '' 
          },
        }
      );
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to assign ",
      });
    }
  };


  const [inputValue, setInputValue] = useState("");
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
                  setShoudUpdate(true)
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
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="text-dark" style={{ fontSize: "x-large" }}>
                  Mark Attendance For Current Lecture
                </h3>
              </div>
            </div>
            <div className="attendance-box">
              <div className="d-flex flex-column  width-res">
                <div
                  className="d-flex gap-5 mb-3 justify-content-between
"
                >
                  <div
                    className="d-flex align-items-center"
                    // style={{ width: "100%" }}
                  >
                    <button
                      className={`btn ${
                        dataforlecture?.teacherTag || ownAttendance
                          ? " btn-success "
                          : "btn-success-light "
                      } btn-success big-button mb-2`}
                      disabled={ownAttendance || dataforlecture?.teacherTag}
                      onClick={() => {
                        setVisible(true);
                        setAssistant("Teacher");
                      }}
                    >
                      Mark Own Attendance
                    </button>
                  </div>

                  {dataforlecture?.assistantTeachers && dataforlecture?.assistantTeachers?.length > 0 ?  dataforlecture?.assistantTeachers?.[0]?.firstName ?  (
                    <div
                      className="card p-2 d-flex flex-row align-items-center gap-2 justify-content-center  desktop-show"
                      style={{ marginBottom: "0px" }}
                    >
                      <h5 className="text-center">Assistent teacher</h5>

                      <div className="d-flex gap-2 justify-content-between align-items-center px-3">
                        <span className="">
                          {dataforlecture?.assistantTeachers?.[0]?.firstName}
                          {dataforlecture?.assistantTeachers?.[0]?.lastName}
                        </span>
                       
                        <button
                          className={`btn ${
                            Array.isArray(assistantteaches?.selected) &&
                            assistantteaches.selected.includes(
                              dataforlecture?.assistantTeachers?.[0]?._id
                            )
                              ? "btn-success"
                              : "btn-success-light"
                          }`}
                          disabled={
                            Array.isArray(assistantteaches?.selected) &&
                            assistantteaches.selected.includes(
                              dataforlecture?.assistantTeachers?.[0]?._id
                            )
                          }
                          onClick={() => {
                            setVisible(true);
                            setAssistant(
                              dataforlecture?.assistantTeachers?.[0]
                            );
                          }}
                        >
                          Mark present
                        </button>
                      </div>
                      {dataforlecture?.assistantTeachers?.length > 0 &&
                        dataforlecture?.assistantTeachers?.[1] && (
                          <div className="d-flex justify-content-between gap-2 align-items-center px-3">
                            <span className="">
                              {
                                dataforlecture?.assistantTeachers?.[1]
                                  ?.firstName
                              }{" "}
                              {dataforlecture?.assistantTeachers?.[1]?.lastName}
                            </span>
                         

                            <button
                              className={`btn ${
                                Array.isArray(assistantteaches?.selected) &&
                                assistantteaches?.selected.includes(
                                  dataforlecture?.assistantTeachers?.[1]?._id
                                )
                                  ? "btn-success"
                                  : "btn-success-light"
                              }`}
                              disabled={
                                Array.isArray(assistantteaches?.selected) &&
                                assistantteaches?.selected.includes(
                                  dataforlecture?.assistantTeachers?.[1]?._id
                                )
                              }
                              onClick={() => {
                                setVisible(true);
                                setAssistant(
                                  dataforlecture?.assistantTeachers?.[1]
                                );
                              }}
                            >
                              Mark present
                            </button>
                          </div>
                        )}
                    </div>
                  ) : 
                   
                    







                  (
                    <div
                      className="card p-2 d-flex flex-row align-items-center gap-2 justify-content-center  desktop-show"
                      style={{ marginBottom: "0px" }}
                    >
                      <h5 className="text-center">Assistent teacher</h5>

                      <div className="d-flex gap-2 justify-content-between align-items-center px-3">
                        <span className="">
                          {dataforlecture?.assistantTeachers?.[0]?.asstTeacherId?.firstName}
                          {dataforlecture?.assistantTeachers?.[0]?.asstTeacherId?.lastName}
                        </span>
                    

                        <button
                          className={`btn btn-success
                             
                          }`}
                          disabled={true }
                          onClick={() => {
                            setVisible(true);
                            setAssistant(
                              dataforlecture?.assistantTeachers?.[0]
                            );
                          }}
                        >
                          Mark present
                        </button>
                      </div>
                      {dataforlecture?.assistantTeachers?.length > 0 &&
                        dataforlecture?.assistantTeachers?.asstTeacherId?.[1] && (
                          <div className="d-flex justify-content-between gap-2 align-items-center px-3">
                            <span className="">
                              {
                                dataforlecture?.assistantTeachers?.asstTeacherId?.[1]
                                  ?.firstName
                              }{" "}
                              {dataforlecture?.assistantTeachers?.[1]?.asstTeacherId?.lastName}
                            </span>
                          
                            <button
                              className={`btn btn-success                               
                              `}
                              disabled={true}
                              onClick={() => {
                                setVisible(true);
                                setAssistant(
                                  dataforlecture?.assistantTeachers?.[1]
                                );
                              }}
                            >
                              Mark present
                            </button>
                          </div>
                        )}
                    </div>
                  ) 




:null







                    
                  }
                </div>

                <div className="card p-3 desktop-show">
                  <div className="d-flex gap-2 justify-content-between">
                    <div className="flex-fill flex-1">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Slot : {dataforlecture?.startTime} -{" "}
                        {dataforlecture?.endTime}
                      </label>
                    </div>

                    <div className=" flex-fill flex-1">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Date : {dataforlecture?.date}
                      </label>
                    </div>
                    <div className=" flex-fill flex-1">
                      <label
                        className="form-label  font-size-seperate"
                        style={{
                          display: "block",
                          fontSize: "13px !important",
                          textAlign: "start",
                        }}
                      >
                        Subject : {dataforlecture?.subject}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
             
              {dataforlecture?.assistantTeachers && dataforlecture?.assistantTeachers?.length > 0 ?  dataforlecture?.assistantTeachers?.[0]?.firstName ?  (
                    <div
                      className="card p-2 d-flex flex-column align-items-center gap-2 justify-content-center  mobile-show"
                      style={{ marginBottom: "0px" }}
                    >
                      <h5 className="text-center">Assistent teacher</h5>

                      <div className="d-flex gap-2 justify-content-between align-items-center px-3"  style={{width:"100%"}}>
                        <span className="">
                          {dataforlecture?.assistantTeachers?.[0]?.firstName}
                          {dataforlecture?.assistantTeachers?.[0]?.lastName}
                        </span>
                      

                        <button
                          className={`btn ${
                            Array.isArray(assistantteaches?.selected) &&
                            assistantteaches.selected.includes(
                              dataforlecture?.assistantTeachers?.[0]?._id
                            )
                              ? "btn-success"
                              : "btn-success-light"
                          }`}
                          disabled={
                            Array.isArray(assistantteaches?.selected) &&
                            assistantteaches.selected.includes(
                              dataforlecture?.assistantTeachers?.[0]?._id
                            )
                          }
                          onClick={() => {
                            setVisible(true);
                            setAssistant(
                              dataforlecture?.assistantTeachers?.[0]
                            );
                          }}
                        >
                          Mark present
                        </button>
                      </div>
                      {dataforlecture?.assistantTeachers?.length > 0 &&
                        dataforlecture?.assistantTeachers?.[1] && (
                          <div className="d-flex justify-content-between gap-2 align-items-center px-3" style={{width:"100%"}}>
                            <span className="">
                              {
                                dataforlecture?.assistantTeachers?.[1]
                                  ?.firstName
                              }{" "}
                              {dataforlecture?.assistantTeachers?.[1]?.lastName}
                            </span>
                           

                            <button
                              className={`btn ${
                                Array.isArray(assistantteaches?.selected) &&
                                assistantteaches?.selected.includes(
                                  dataforlecture?.assistantTeachers?.[1]?._id
                                )
                                  ? "btn-success"
                                  : "btn-success-light"
                              }`}
                              disabled={
                                Array.isArray(assistantteaches?.selected) &&
                                assistantteaches?.selected.includes(
                                  dataforlecture?.assistantTeachers?.[1]?._id
                                )
                              }
                              onClick={() => {
                                setVisible(true);
                                setAssistant(
                                  dataforlecture?.assistantTeachers?.[1]
                                );
                              }}
                            >
                              Mark present
                            </button>
                          </div>
                        )}
                    </div>
                  ) : 
                   
                    







                  (
                    <div
                      className="card p-2 d-flex flex-column align-items-center gap-2 justify-content-center  mobile-show"
                      style={{ marginBottom: "0px" }}
                    >
                      <h5 className="text-center">Assistent teacher</h5>

                      <div className="d-flex  justify-content-between align-items-center px-3" style={{width:"100%"}}>
                        <span className="">
                          {dataforlecture?.assistantTeachers?.[0]?.asstTeacherId?.firstName}
                          {dataforlecture?.assistantTeachers?.[0]?.asstTeacherId?.lastName}
                        </span>
                  

                        <button
                          className={`btn btn-success
                             
                          }`}
                          disabled={true }
                          onClick={() => {
                            setVisible(true);
                            setAssistant(
                              dataforlecture?.assistantTeachers?.[0]
                            );
                          }}
                        >
                          Mark present
                        </button>
                      </div>
                      {dataforlecture?.assistantTeachers?.length > 0 &&
                        dataforlecture?.assistantTeachers?.asstTeacherId?.[1] && (
                          <div className="d-flex justify-content-between gap-2 align-items-center px-3" style={{width:"100%"}}>
                            <span className="">
                              {
                                dataforlecture?.assistantTeachers?.asstTeacherId?.[1]
                                  ?.firstName
                              }{" "}
                              {dataforlecture?.assistantTeachers?.[1]?.asstTeacherId?.lastName}
                            </span>
                         
                            <button
                              className={`btn btn-success                               
                              `}
                              disabled={true}
                              onClick={() => {
                                setVisible(true);
                                setAssistant(
                                  dataforlecture?.assistantTeachers?.[1]
                                );
                              }}
                            >
                              Mark present
                            </button>
                          </div>
                        )}
                    </div>
                  ) 
:null











                    
                  }
            </div>

            <div className="card p-3 mobile-show d-flex flex-column justify-content-center">
              <div className="mb-3 flex-fill flex-1 text-center">
                <label
                  className="form-label "
                  style={{
                    display: "block",
                    fontSize: "17px !important",
                  }}
                >
                  Start Time : {dataforlecture?.startTime}
                </label>
              </div>

              <div className="mb-3 flex-fill flex-1 text-center">
                <label
                  className="form-label "
                  style={{
                    display: "block",
                    fontSize: "17px !important",
                  }}
                >
                  End Time : {dataforlecture?.endTime}
                </label>
              </div>

              <div className=" mb-3 flex-fill flex-1 text-center">
                <label
                  className="form-label  "
                  style={{
                    display: "block",
                    fontSize: "17px !important",
                  }}
                >
                  Date : {dataforlecture?.date}
                </label>
              </div>
              <div className="mb-3 flex-fill flex-1 text-center">
                <label
                  className="form-label "
                  style={{
                    display: "block",
                    fontSize: "17px !important",
                  }}
                >
                  Subject : {dataforlecture?.subject}
                </label>
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
            <div className="d-flex justify-content-center mb-5 gap-2">
              <button
                className="btn btn-light"
                onClick={(e) =>
                  navigate(
                    location?.state?.page === "today"
                      ? "/teacher/today/attendance"
                      : "/teacher/update/today/attendance",
                    {
                      state: {
                        grade: location?.state?.grade ? location?.state?.grade : "",
                        section: location?.state?.section ? location?.state?.section : "",
                        stage: location?.state?.stage ? location?.state?.stage : "",
                        workingDayid: location?.state?.workingDay ?  location?.state?.workingDay  : '',
                        date:  location?.state?.date ? location?.state?.date : '' 
                      },
                    }
                  )
                }
              >
                Back
              </button>

              <Tooltip
                title={
                  isBefore72Hours
                    ? "You can't update attendance older than 72 hours."
                    : ""
                }
                placement="top"
              >
                {console.log(
                  "thsiis new student",
                  newStudent,
                  "this is with not",
                  newStudent.length,
                  "datafor",
                  dataforlecture?._id,
                  "isBefore72Hours",
                  isBefore72Hours
                )}
                <span>
                  <button
                    className="btn btn-primary"
                    onClick={handleClick}
                    disabled={isBefore72Hours}
                  >
                    Present
                  </button>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default AttendanceListingteacherEdit;
