import CommonSelect from "../../../../core/common/commonSelect";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CFormTextarea, CFormInput } from "@coreui/react";
import { notification,Table } from "antd";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { AuthContext } from "../../../helper/AuthState";
const ViewLeaveT = () => {  const [formData, setFormData] = useState({
    reason: "",
    type: "",
    time: "",
    startDate: "",
    endDate: "",
  });
    const { authState } = useContext(AuthContext);
  
  const location = useLocation();
  const id = location?.state?.id || '';
  const [error, setError] = useState(false);
  const [reason, setReason] = useState("");
  const [visible, setVisible] = useState(false);
  const [validated, setValidated] = useState(false);
  const [data,setData]  = useState([])
  const [ allData, setAllData ] = useState([])
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const [loading, setLoading] = useState(false);
  const [collecIds, setCollecIds] = useState([]);

  const navigate = useNavigate();
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
 const [eventType , setEventType] = useState('')
  const [date, setDate] = useState("");
  const [selectAll, setSelectAll] = useState(false);


const toggleSelectAll = () => {
  setCollecIds(selectAll ? [] : data.map((student) => student.id));
  setSelectAll(!selectAll);
};

  const [startTime, setStartTime] = useState("");
  const [leaveType, setLeaveType] = useState("");
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
        <input type="checkbox" checked={(data.length === collecIds?.length )? true : selectAll} disabled onChange={toggleSelectAll} />
      ),
      render: (_, record) => (
        <input
        disabled
          type="checkbox"
          checked={collecIds?.includes(record.id)}
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
  const transformData = (dataArray) => {
    console.log("dataArraydataArraydataArray",dataArray)
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
  const handleFormSubmission = async (e) => {
      e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/leave-request/${id}`,
        {
          requestedBy: localStorage.getItem("userId"),
          leaveType: leaveType, 
          startDate: moment(startDate).format("DD/MM/YYYY"),
          endDate: moment(endDate).format("DD/MM/YYYY"),
        
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setLoading(false);
      setVisible(false);
      notification.success({ message: "Leave Request Update Successfully" });
      navigate(-1);
    } catch (error) {
      console.error("Error fetching day type:", error.message || error);
      notification.error({ message: "Error Submitting form" });
    } finally {
      setLoading(false);
    }
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
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const formattedData = transformData(response?.data?.data);
      console.log("formattedData", formattedData)
      const dbIds = formattedData.map(item => item.id);
      console.log("dbIds", dbIds)

const commonIds = allData?.lecture_id?.filter(id => dbIds.includes(id));
      console.log("0-0-0-0-", allData)
      console.log("commonIds",commonIds)
setCollecIds(commonIds);
    setData(formattedData)
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (startDate && endDate , allData) {
      getTimeTableList()
      }
  },[startDate , endDate , allData])
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
      setLoading(false);
      setAllData(res?.data?.data?.data)

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
    if (date?.startDate && date?.endDate) {
      const parsedStartDate = new Date(date.startDate);
      const parsedEndDate = new Date(date.endDate);

      if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
        setdateRange([parsedStartDate, parsedEndDate]);
      } else {
        console.error("Invalid date format in startDate or endDate");
      }
    }
  }, [date]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "type" && { time: "" }),
    }));
  };
  return (
    <div>
      <>
        <div className="page-wrapper">
          <div className="content">
            <div className="d-md-flex d-block mt-3 change-password ">
              <div className="settings-right-sidebar me-md-3 border-0"></div>
              <div className="flex-fill ps-0 border-0">
                <form>
                  <div className="d-md-flex">
                    <div className="flex-fill">
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5>View Leave Request</h5>
                        </div>
                        <div className="card-body pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                   Date
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
                                                                      readOnly
                                    disabled={true}
                                    required
                                    style={{ width: "100%" }}
                                    isClearable={true}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Select Date Range"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12">
                              {" "}
                              <div className="mb-3">
                                <label className="form-label">
                                   Leave Type
                                </label>
                                <div className="input-group w-100-select">
                                <input  className="form-control" type="text"  disabled value={leaveType
  ? leaveType
      .replace("-", " ") // replaces dash with space
      .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalizes first letter of each word
  : ""}
 />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Event Type
                                </label>
                                <div className="input-group">
                                                                  <CFormInput
                                                                  readOnly
                                                                      disabled={true}
                                    name="startTime"
                                    value={eventType}
                                 
                                    className={" w-100 "}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                              <label className="form-label">
                                Reason of Leave
                                </label>
                                <div className="input-group">

                                                                  <CFormTextarea
                                                                  readOnly
                                                                      disabled={true}
                                    id="validationCustom01"
                                    
                                    placeholder="Please Enter Reason of Leave"
                                    required
                                    className="form-control"
                                    rows={4}
                                    name="reason"
                                    value={reason}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>


                        
                        </div>


                        <div className="card-footer d-flex justify-content-center">
                          <button className="btn btn-light" onClick={()=>navigate('/teacher/attendance/leavelisting')}>Back</button>
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
                {console.log("datadatadata" , data)}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default ViewLeaveT;
