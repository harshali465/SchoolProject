import CommonSelect from "../../../../core/common/commonSelect";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CFormTextarea, CFormInput } from "@coreui/react";
import { notification } from "antd";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    reason: "",
    type: "",
    time: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState(false);
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("accessToken");
  const [visible, setVisible] = useState(false);
  const [validated, setValidated] = useState(false);
  const academicYearIddata = localStorage.getItem("academicYearId");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

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

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      return notification.error({ message: "Please select a date range" });
    }
    if (!leaveType) {
      return notification.error({ message: "Please select a leave type" });
    }
  
    if (leaveType === "early-release" && !startTime) {
      return notification.error({
        message: "Please add the early release time",
      });
    }
    
   
  
    if (!reason || reason.trim() === "") {
      return notification.error({ message: "Please enter a reason for leave" });
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/leave-request`,
        {
          requestedBy: localStorage.getItem("userId"),
          leaveType: leaveType,
          startDate: moment(startDate).format("DD/MM/YYYY"),
          endDate: moment(endDate).format("DD/MM/YYYY"),
          earlyLeaveTime: startTime,
          reason: reason,
          academicYearId: academicYearIddata,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setLoading(false);
      setVisible(false);
        console.log("response is this" , res)
        if(res?.data?.status === "error") {
          notification.error({ message:"error",description: res?.data?.message });
          return;
        }
      notification.success({ message: "success" , description:"Request a Leave Successfully" });
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
    // { value: "half-day", label: "Half Day" },
    { value: "early-release", label: "Early Release" },
  ];
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
                          <h5>Create New Leave Request</h5>
                        </div>
                        <div className="card-body pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Select Date<span className="text-red">*</span>
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
                                  Select Leave Type<span className="text-red">*</span>
                                </label>
                                <div className="input-group w-100-select">
                                  {/* <CommonSelect
                                    
                                    className="select"
                                    options={[
                                      { value: "", label: "Leave Type" },
                                      { value: "full-day", label: "Full Day" },
                                      { value: "half-day", label: "Half Day" },
                                      {
                                        value: "early-release",
                                        label: "Early Release",
                                      },
                                    ]}
                                    value={
                                      leaveType
                                        ? {
                                            value: leaveType,
                                            label: leaveType.replace("-", " "),
                                          }
                                        : { value: "", label: "Leave Type" }
                                    }
                                    onChange={(e) =>
                                      setLeaveType(e ? e.value : "")
                                    }
                                 
                                  /> */}

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
                            {
                              leaveType === 'early-release' &&<div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Early Release Time<span className="text-red">*</span>
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
                            </div>

}
                            
                            <div className="col-md-12">
                              <div className="mb-3">
                              <label className="form-label">
                                Reason of Leave <span className="text-red">*</span>
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
                          onClick={() => navigate(-1)}
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
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default LeaveRequest;
