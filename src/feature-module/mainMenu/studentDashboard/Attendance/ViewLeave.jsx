import CommonSelect from "../../../../core/common/commonSelect";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CFormTextarea, CFormInput } from "@coreui/react";
import { notification } from "antd";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
const ViewLeave = () => {  const [formData, setFormData] = useState({
    reason: "",
    type: "",
    time: "",
    startDate: "",
    endDate: "",
  });
  const location = useLocation();
  const id = location?.state?.id || '';
  const [error, setError] = useState(false);
  const [reason, setReason] = useState("");
  const [visible, setVisible] = useState(false);
  const [validated, setValidated] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [date, setDate] = useState("");

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

                         {   leaveType === 'early-release' &&      <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Early Release Time
                                </label>
                                <div className="input-group">
                                                                  <CFormInput
                                                                  readOnly
                                                                      disabled={true}
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
                            </div>}

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
                                    onChange={(e) => setReason(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>


                          <div className="text-center mb-5">
                          <button
                        className="btn btn-light"
                          onClick={() => navigate('/attendance/leavelisting')}
                        >
                          Back
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

export default ViewLeave;
