import React, { useContext, useEffect, useRef, useState } from "react";
import { teacherAttendance } from "../../../../core/data/json/teacher_attendance";
import { TableData } from "../../../../core/data/interface";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { notification, Table } from 'antd';
import { Modal, Box, Typography, Button } from "@mui/material";

import CommonSelect from "../../../../core/common/commonSelect";
import {
  attendance,
  studentclass,
  studentName,
  teacherId,
} from "../../../../core/common/selectoption/selectoption";
import TooltipOption from "../../../../core/common/tooltipOption";
import { all_routes } from "../../../router/all_routes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import { AuthContext } from "../../../helper/AuthState";
const LeaveListing = () => {
    const token = localStorage.getItem("accessToken");
  const { authState } = useContext(AuthContext);
  const upcomingyear = localStorage.getItem("upcomingyear");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleWithdraw = () => {
    console.log("Withdraw request submitted");
    handleClose();
  };
  const academicYearId = localStorage.getItem("academicYearId");
  const routes = all_routes;
  const data = teacherAttendance;
  const [leaveType, setLeaveType] = useState("");
    const [leaveList, setleaveList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [collecIds, setCollecIds] = useState([]);
    const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedOptions, setSelectedOptions] = useState(
    data.map(() => "Present") // Default to 'Present' for each row
  );
  const dropdownMenuRef = useRef(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const getLeaveRequest = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/attendance/leave-request/user/${localStorage.getItem(
          "userId"
        )}?leaveType=${leaveType}&status=${filterStatus}&startDate=${
          startDate ? moment(startDate).format("YYYY-MM-DD") : ""
        }&endDate=${endDate ? moment(endDate).format("YYYY-MM-DD") : ""}&academicYearId=${
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

      setleaveList(res?.data?.data?.data);

    } catch (error) {
      console.log(error);
    }
  };
    
  useEffect(() => {
    if (startDate) {
      if (endDate) {
        getLeaveRequest();
      }
    } else {
        getLeaveRequest();
    }
  }, [dateRange, filterStatus, leaveType ,  academicYearId, authState?.startYearId, upcomingyear]);
  // Handle state change for each row
  const handleOptionChange = (index, value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = value;
    setSelectedOptions(newSelectedOptions);
  };


  const toggleSelectAll = () => {
    setCollecIds(selectAll ? [] : leaveList.map((student) => student._id));
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setCollecIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const withdrawlRequest = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/leave-request/withdraw`,
        {
          ids: collecIds.length > 0 ? collecIds : [id],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      notification.success({
        message: "Success",
        description: "Request withdraw successfully!",
      });
      getLeaveRequest();
      setCollecIds([]);
      handleClose();

    } catch (error) {
      console.error(error);
    }
  };
    
 

const columns = [
    {
      title: (
        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
      ),
      render: (_, record) => (
        <input
          type="checkbox"
          checked={collecIds.includes(record._id)}
          onChange={() => handleCheckboxChange(record._id)}
        />
      ),
    },
    {
      title: "Date",
      className: "column-date", 
      dataIndex: "start_date",
      render: (_, record) => {
        const startDate = moment(record.start_date, "DD/MM/YYYY").format("MMM D");
        const endDate = moment(record.end_date, "DD/MM/YYYY").format("MMM D");
        return `${startDate} - ${endDate}`;
      },
    },
  
    // {
    //   title: "Leave Type",
    //   dataIndex: "leave_type",
    //   className: "column-date",
    // },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      className: "column-date",
      render: (text) =>
        text
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
    }
,    
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Leave Status",
      render: (_, record) =>
        record.is_approved
          ? "Approved"
          : record.is_rejected
          ? "Rejected"
          : record.is_withdrawn
          ? "Withdrawn"
          : "Pending",
    },

    // {
    //   title: "Action",
    


    //   render: (_, record) => (
    //     <div className="d-flex align-items-center">
    //       <div className="dropdown">
    //         <Link
    //           to="#"
    //           className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
    //           data-bs-toggle="dropdown"
    //           aria-expanded="false"
    //         >
    //           <i className="ti ti-dots-vertical fs-14" />
    //         </Link>
      
    //         <ul className="dropdown-menu dropdown-menu-right p-3">
    //           {/* View Button */}
    //           {(record?.is_approved || record?.is_rejected || record?.is_withdrawn) && (
    //             <li>
    //               <button
    //                 className="dropdown-item rounded-1"
    //                 onClick={() =>
    //                   navigate("/student/leave/view", { state: { id: record?._id } })
    //                 }
    //               >
    //                 <i className="ti ti-eye me-2" />
    //                 View
    //               </button>
    //             </li>
    //           )}
      
         
    //           {!record?.is_approved && !record?.is_withdrawn && (
    //             <li>
    //               <button
    //                 className="dropdown-item rounded-1 text-danger"
    //                 onClick={() => {
    //                   setCollecIds([record._id]);
    //                   withdrawlRequest(record._id);
    //                 }}
    //               >
    //                 <i className="ti ti-arrow-left me-2" />
    //                 Withdraw
    //               </button>
    //             </li>
    //           )}
      
            
    //           { !record?.is_withdrawn &&  !record?.is_approved && !record?.is_rejected && (
    //             <li>
    //               <button
    //                 className="dropdown-item rounded-1"
                  
    //                 onClick={() => {
    //                   navigate("/student/leave/edit", { state: { id: record?._id } })
    //                 }}
                  

    //               >
    //                 <i className="ti ti-edit-circle me-2" />
    //                 Edit
    //               </button>
    //             </li>
    //           )}
      
            
    //         </ul>
    //       </div>
    //     </div>
    //   )
      

    // },
    {
      title: "Action",
    
      render: (_, record) => (
        <div className="d-flex align-items-center gap-2">
          {/* View Button */}
          {(record?.is_approved || record?.is_rejected || record?.is_withdrawn) && (
            <button
              className="btn btn-light border d-flex align-items-center gap-1"
              onClick={() =>
                navigate("/student/leave/view", { state: { id: record?._id } })
              }
            >
              {/* <i className="ti ti-eye" /> */}
               View
            </button>
          )}
    
          {/* Withdraw Button */}
          {!record?.is_approved && !record?.is_withdrawn && (
            <button
              className="btn  btn-danger d-flex align-items-center gap-1"
              onClick={() => {
                setCollecIds([record._id]);
                handleOpen();
              }}
            >
              {/* <i className="ti ti-arrow-left" />  */}
              Withdraw
            </button>
          )}
    
          {/* Edit Button */}
          {!record?.is_withdrawn && !record?.is_approved && !record?.is_rejected && (
            <button
              className="btn  btn-primary d-flex align-items-center gap-1"
              onClick={() =>
                navigate("/student/leave/edit", { state: { id: record?._id } })
              }
            >
              {/* <i className="ti ti-edit-circle" /> */}
               Edit
            </button>
          )}
        </div>
      )
    }
    
  ];
  const options = [
    { value: "", label: "Leave Status" },
    { value: "is_approved", label: "Approved" },
    { value: "is_rejected", label: "Rejected" },
    { value: "is_withdrawn", label: "Withdrawn" },
    { value: "is_pending", label: "Pending" },
    
    
  ];

  const optionsLeave = [
    { value: "", label: "Leave Type" },
    { value: "full-day", label: "Full Day" },
    { value: "half-day", label: "Half Day" },
    { value: "early-release", label: "Early Release" },
  ];
    return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className=" d-flex align-items-center justify-content-between mb-3 custom-responsive">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1" style={{ fontSize: "x-large" }}>
                  Leave Listing
                </h3>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <div className="mb-2">
                  <Link
                    className="btn btn-primary"
                    to={all_routes.leaveRequest}
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Create Request
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Teacher Attendence List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Student Leave List</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setdateRange(update);
                      }}
                      className="date-range-leave"

                      dateFormat="dd-MM-yyyy"
                      isClearable={true}
                      placeholderText="Select Date Range"
                    />
                  </div>
                  {/* <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                    </Link>
                    <div
                      className="dropdown-menu drop-width"
                      ref={dropdownMenuRef}
                    >
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Leave Type</label>
                                {/* <CommonSelect
  className="select"
  options={[
    { value: "", label: "Leave Type" },
    { value: "full-day", label: "Full Day" },
    { value: "half-day", label: "Half Day" },
    { value: "early-release", label: "Early Release" },
  ]}
  value={
    leaveType
      ? { value: leaveType, label: leaveType.replace("-", " ") }
      : { value: "", label: "Leave Type" }  // ✅ Ensure correct default option
  }
  onChange={(e) => setLeaveType(e ? e.value : "")}  // ✅ Ensure value is set properly
/> */}
  {/* <select
     className="form-control form-select"
      value={leaveType}
      onChange={(e) => setLeaveType(e.target.value)}
    >
      {optionsLeave.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Status</label> */}

                                {/* <CommonSelect
  className="select"
  options={[
    { value: "", label: "Leave Status" },
    { value: "is_approved", label: "Approved" },
    { value: "is_rejected", label: "Rejected" },
    { value: "is_withdrawn", label: "Withdrawn" },
  ]}
  value={
    filterStatus
      ? { value: filterStatus, label: filterStatus.replace("-", " ") }
      : { value: "", label: "Leave Status" }  // ✅ Ensure correct default option
  }
  onChange={(e) => setFilterStatus(e ? e.value : "")}  // ✅ Ensure value is set properly
/> */}
    {/* <select
        className="form-control form-select"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link
                            to="#"
                            className="btn btn-light me-3"
                            onClick={() => {
                              setLeaveType(""); 
                              setFilterStatus(""); 
                            }}
                          >
                            Reset
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div> */}
                  {/* </div> */} 



               
                         
                              <div className="mb-3 me-2 position-relative notification-boxss">
                          
                             
  <select
     className="form-control form-select"
      value={leaveType}
      onChange={(e) => setLeaveType(e.target.value)}
    >
      {optionsLeave.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
                              </div>
                           
                         
                              <div className="mb-3 me-2 position-relative notification-boxss">

                               
    <select
        className="form-control form-select"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
                              </div>
                          
                            


                         



                  <div className="mb-3 me-2">
                  
                      <button
                      disabled={collecIds.length==0}
          className="btn btn-danger"
          // onClick={withdrawlRequest}
          onClick={handleOpen}
        >
    <i class="ti ti-arrow-back-up"></i>Withdraw
        </button>
                  </div>
                  <div className="mb-3 me-2">
                  
                      <button
          className="btn btn-light"
          onClick={()=>{
              setFilterStatus('');
              setLeaveType('');
              setdateRange([null,null]);
          }}
        >
    Reset
        </button>
                  </div>
                </div>
                </div>
                 <div className="modal fade" id="delete-modal">
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <form>
                                <div className="modal-body text-center">
                                  <span className="delete-icon">
                                  <i class="ti ti-arrow-back-up" style={{fontSize: "30px"}}></i>
                                  </span>
                                  <h4>Confirm Withdraw</h4>
                                  <p>You want to Withdraw all selected requests</p>
                                  <div className="d-flex justify-content-center">
                                    <Link
                                      to="#"
                                      className="btn btn-light me-3"
                                      data-bs-dismiss="modal"
                                    >
                                      Cancel
                                    </Link>
                                    <Link
                                      to="#"
                                      onClick={withdrawlRequest}
                                      className="btn btn-danger"
                                      data-bs-dismiss="modal"
                                    >
                                      Yes, Withdraw
                                    </Link>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
              <div className="card-body p-0 py-3">
                {/* Student List */}
                <Table dataSource={leaveList} columns={columns} Selection={true} />
                {/* /Student List */}
              </div>
            </div>
            {/* /Teacher Attendence List */}
          </div>
        </div>
        <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Are you sure you want to withdraw?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
          This action will withdrawl the  request
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={withdrawlRequest} variant="contained" color="error">
              Confirm Withdraw
            </Button>
          </Box>
        </Box>
      </Modal>
        {/* /Page Wrapper */}
      </>
    </div>
  );
};

export default LeaveListing;
