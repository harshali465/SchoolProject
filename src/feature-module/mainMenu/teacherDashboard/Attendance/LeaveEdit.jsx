import CommonSelect from "../../../../core/common/commonSelect";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CFormTextarea, CFormInput } from "@coreui/react";
import { Checkbox, notification , Table } from "antd";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { AuthContext } from "../../../helper/AuthState";
const LeaveRequestteacherEdit = () => {
  const location = useLocation();
  const id = location?.state?.id || '';
  const [ allData, setAllData ] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [collecIds, setCollecIds] = useState([]);
    const [data,setData]  = useState([])
  console.log("allData" ,allData)

  const toggleSelectAll = () => {
    setCollecIds(selectAll ? [] : data.map((student) => student.id));
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setCollecIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };
  const columns = [
    {
      title: (
        <input type="checkbox" checked={(data.length === collecIds.length )? true : selectAll} onChange={toggleSelectAll} />
      ),
      render: (_, record) => (
        <input
          type="checkbox"
          checked={collecIds.includes(record.id)}
          onChange={() => handleCheckboxChange(record.id)}
        />
      ),
    },
    {
      title: "Day",
      dataIndex: "day",
    },

    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Subject",
      dataIndex: "subject",
    },
  ];
  const academicYearIddata = localStorage.getItem("academicYearId");

  const [formData, setFormData] = useState({
    reason: "",
    type: "",
    time: "",
    startDate: "",
    endDate: "",
  });
  const [timetableShow, setTimeTableShow] = useState([]);
  console.log("this is a show" , timetableShow)
    const [timeTableData, setTimeTableData] = useState([]);
  const [error, setError] = useState(false);
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("accessToken");
  const [visible, setVisible] = useState(false);
  const [validated, setValidated] = useState(false);

  const [loading, setLoading] = useState(false);
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [startTime, setStartTime] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [eventType, setEventType] = useState('')
console.log("leaveTypeleaveTypeleaveType",leaveType)
console.log("datadatadatdta" , data)
  const transformData = (dataArray) => {
    return dataArray.flatMap(item => {
      // For each timetable record in the current item
      return item.timeTable.flatMap(timeRec => {
        // For each slot in the current timetable record, return the desired object
        return timeRec.slots.map(slot => {
          return {
            day: item.day, 
            time: `${slot.startTime} - ${slot.endTime}`,
            id: slot._id,
            subject: slot.subjectId.subject,
          };
        });
      });
    });
  };
  
  const getTimeTableList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/time-table/teacher/${localStorage.getItem("userId")}?startDate=${startDate ? moment(startDate).format("YYYY-MM-DD") : ''}&endDate=${endDate ? moment(endDate).format("YYYY-MM-DD") : ''}&academicYearId=${
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
      const formattedData = transformData(response?.data?.data);
      console.log("formattedData", formattedData)
      const dbIds = formattedData.map(item => item.id);
      console.log("dbIds", dbIds)

const commonIds = allData.lecture_id.filter(id => dbIds.includes(id));
      console.log("0-0-0-0-", allData)
      console.log("commonIds",commonIds)
setCollecIds(commonIds);
    setData(formattedData)
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };


  const getdata = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/leave-request/${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setAllData(res?.data?.data?.data)
      setLoading(false);
      setEventType(res?.data?.data?.data?.event_type)
      setLeaveType(res?.data?.data?.data?.leave_type);
      setStartTime(res?.data?.data?.data?.early_leave_time)
      const parsedStartDate = moment(
        res?.data?.data?.data?.start_date,
        "DD/MM/YYYY"
      ).toDate();
      const parsedEndDate = moment(
        res?.data?.data?.data?.end_date,
        "DD/MM/YYYY"
      ).toDate();

      if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
        setdateRange([parsedStartDate, parsedEndDate]);
      }
      setReason(res?.data?.data?.data?.reason);

      console.log("thisis a res" , res)
    } catch (error) {
      console.error("Error fetching day type:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdata();
  }, []);


  useEffect(() => {
    if (startDate && endDate , allData) {
      getTimeTableList()
      }
  },[startDate , endDate , allData])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!formData?.startDate || !formData?.endDate || !formData?.time) {
      setError(true);
    }

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setVisible(true);
    }
  };

  const handleFormSubmission = async (e) => {
    // setLoading(true);
 e.preventDefault()
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/leave-request/${id}`,
        {
          requestedBy: localStorage.getItem("userId"),
          leaveType: leaveType,
          startDate: moment(startDate).format("DD/MM/YYYY"),
          endDate: moment(endDate).format("DD/MM/YYYY"),
          reason: reason,
          academicYearId: academicYearIddata,
          lectureId: collecIds,
          eventType:eventType
        },
    
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
     
      notification.success({ message: "success",description:"Edit Leave Successfully" });
      navigate(-1);
    } catch (error) {
      console.error("Error fetching day type:", error.message || error);
      notification.error({ message: "Error Submitting form" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "type" && { time: "" }),
    }));
  };
  const options = [
    { value: "", label: "Leave Type" },
    { value: "full-day", label: "Full Day" },
    { value: "half-day", label: "Half Day" },
  ];
  return (
    <div>
      <>
        <div className="page-wrapper">
          <div className="content">
            <div className="d-md-flex d-block mt-3  ">
              <div className="settings-right-sidebar me-md-3 border-0"></div>
              <div className="attendance-container gap-5 ps-0 border-0 ">
                <form>
                  <div className="d-md-flex">
                    <div className="flex-fill">
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5>Edit Leave Request</h5>
                        </div>
                        <div className="card-body pb-0">
                          <div className="row">

                          <div className="col-md-12">
                              {" "}
                              <div className="mb-3">
                                <label className="form-label">
                                   Event Type
                                </label>
                                <div className="input-group w-100-select">
                                  <input type="text" className="form-control" value={eventType} onChange={(e)=>setEventType(e.target.value)} />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Select Date
                                </label>
                                <div className="input-group w-100-select">
                                  <DatePicker
                                    className="date_input w-100"
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                      setdateRange(update);
                                    }}
                                    required
                                    style={{ width: "100%" }}
                                    isClearable={true}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Select Date Range"
                                    minDate={new Date(Date.now() + 48 * 60 * 60 * 1000)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12">
                              {" "}
                              <div className="mb-3">
                                <label className="form-label">
                                  Select Leave Type
                                </label>
                                <div className="input-group w-100-select">
                                <select
                          className="form-control form-select"

        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
                                </div>
                              </div>
                            </div>

                            {/* <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Early Release Time
                                </label>
                                <div className="input-group">
                                  <CFormInput
                                    type="time"
                                    name="startTime"
                                    value={startTime}
                                    onChange={(date) => {
                                      setStartTime(date.target.value);
                                    }}
                                    className={" w-100 "}
                                  />
                                </div>
                              </div>
                            </div> */}

                            <div className="col-md-12">
                              <div className="mb-3">
                              <label className="form-label">
                                Reason of Leave
                                </label>
                                <div className="input-group">

                                  <CFormTextarea
                                    id="validationCustom01"
                                    
                                    placeholder="Please Enter Reason of Leave"
                                    required
                                    className="form-control"
                                    rows={4}
                                    name="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>


                          <div className="text-center d-flex gap-2 justify-content-center mb-5">
                          <button
                        className="btn btn-light"
                          onClick={() => navigate('/teacher/attendance/leavelisting')}
                        >
                          Back
                        </button>  
                        <button
                              className="btn btn-primary"
                          onClick={(e) => handleFormSubmission(e)}
                        >
                          Save
                        </button>
                      </div>
                        </div>
                      </div>

                    
                    </div>
                  </div>
                </form>

                { leaveType === "half-day" && 
 <div className="d-flex flex-column gap-2">
   <h1 style={{fontSize:"20px"}}>Select Lectures for Leave</h1>

   
                    <div className="d-flex flex-column width-box border gap-5  border-1 rounded p-4">
                   <Table
                     rowKey="_id"
                     columns={columns}
                     className="bordered-table"
                     dataSource={data}
                     pagination={false}
                   />
       
                
                 </div>

 </div>}
              


              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default LeaveRequestteacherEdit;
