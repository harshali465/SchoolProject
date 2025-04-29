import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import maleGenericimage from "../../../../../image/images/malegeneric.png";

import maleGenericimage from "../../../../image/images/malegeneric.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Table from "../../../../core/common/dataTable/index";
import axios from "axios";
import moment from "moment";
import { all_routes } from "../../../router/all_routes";
import { AuthContext } from "../../../helper/AuthState";
import { io } from "socket.io-client";
import CommonSelect from "../../../../core/common/commonSelect";

const socket = io(process.env.REACT_APP_DEV_BASE_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000,
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Connection Error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

const Notification = () => {
  const token = localStorage.getItem("accessToken");
  const Teacher_id = localStorage.getItem("userId");
  const [couponsList, setCouponsList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [category, setCategory] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");

  const [loading, setLoading] = useState(false);

  const [collecIds, setcollecIds] = useState([]);
  const [leaveType, setLeaveType] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setdateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");
  const getModules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/modules`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setCategory(res?.data?.data?.data?.docs);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getNotification = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/school/notification/user/${localStorage.getItem(
          "userId"
        )}?receive=true&startDate=${
          startDate ? moment(startDate).format("YYYY-MM-DD") : ""
        }&endDate=${
          endDate ? moment(endDate).format("YYYY-MM-DD") : ""
        }&module=${filterCategory ? filterCategory?.value : ''}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setNotification(res?.data?.notification);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate) {
      if (endDate) {
        getNotification();
      }
    } else {
      getNotification();
    }
  }, [dateRange, filterCategory, search]);

  useEffect(() => {
    getModules();
  }, []);

  const toggleSelectAll = () => {
    setcollecIds(selectAll ? [] : couponsList.map((student) => student._id));
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setcollecIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    socket.connect();
    console.log(Teacher_id, "Teacher_id");
    socket.on("receiveNotificationArr", (mentions) => {
      if (
        mentions.sender === Teacher_id ||
        mentions.reciever?.includes(Teacher_id)
      ) {
        console.log("Received Notification: Match Found", mentions);
        getNotification();
      } else {
        console.log("No match found for Teacher_id in reciever");
      }
    });

    socket.on("receiveNotification", (mentions) => {
      if (
        mentions.reciever?.includes(Teacher_id) ||
        mentions.sender === Teacher_id
      ) {
        getNotification();
        console.log("Received Notificationdfsfsfsf:", mentions);
      }
      console.log("Received Notificatiozncc:", mentions);
    });

    return () => {
      socket.off("receiveNotification");
      socket.off("receiveNotificationArr");
      socket.disconnect();
    };
  }, [Teacher_id, socket]);

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Module",
      render: (_, record) => record.module,
    },

    {
      title: "Send By",
      render: (_, record) =>
        record.sender?.firstName + " " + record.sender?.lastName,
    },
    {
      title: "Date",
      render: (_, record) => moment(record?.createdAt).format("MMM D"),
    },
    {
      title: "TimeStamp",
      render: (_, record) => moment(record?.createdAt).format("hh:mm A"),
    },
    {
      title: "Remark",
      render: (_, record) => record.message,
    },
  ];



  const [requestData, setRequestData] = useState({
    is_issued: true,
    remark: "",
    userId: "",
  });

  const handleApprove = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/coupon-approval/${requestData?.userId}`,
        {
          is_issued: true,
          remark: requestData?.remark,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res?.data?.status == "success") {
        notification.success({
          message: "Success",
          description: res?.data?.message,
        });
        setVisible(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "error",
        description: error?.message,
      });
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1" style={{ fontSize: "x-large" }}>
                Notifications
              </h3>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Reveived Notifications Listing</h4>

              <div className="d-flex align-items-center flex-wrap">
                {/* <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setdateRange(update);
                    }}
                    dateFormat="dd-MM-yyyy"
                    isClearable={true}
                    placeholderText="Select Date Range"
                  />
                </div>

                <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                  <CommonSelect
                    value={filterCategory || { value: "", label: "Select a module" }}
                    onChange={(value) => setFilterCategory(value)}
                    options={[
                      { value: "", label: "Select a module" },
                      ...(category?.map((res) => ({
                        value: res._id,
                        label: res.moduleName,
                      })) || []),
                    ]}
                  />
                </div>

                <div className="input-icon-start mb-3 me-2 position-relative notification-box">
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    style={{ padding: "0.5rem 0.625rem" }}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    onClick={() => {
                      setdateRange([null, null]);
                      setSearch("");
                      setFilterCategory({
                        value: "",
                        label: "",
                      });
                    }}
                  >
                    Reset
                  </Link>
                </div> */}



<div className="input-icon-start mb-3 me-2 position-relative notification-box">
  <DatePicker
    selectsRange={true}
    startDate={startDate}
    endDate={endDate}
    onChange={(update) => {
      setdateRange(update); // Setting the date range
    }}
    dateFormat="dd-MM-yyyy"
    isClearable={true}
    placeholderText="Select Date Range"
  />
</div>

<div className="input-icon-start mb-3 me-2 position-relative notification-box">
  <CommonSelect
    value={filterCategory || { value: "", label: "Select a module" }} // Ensure initial value is reset
    onChange={(value) => setFilterCategory(value)} // Handling category selection
    options={[
      { value: "", label: "Select a module" },
      ...(category?.map((res) => ({
        value: res._id,
        label: res.moduleName,
      })) || []), // Handling category list
    ]}
  />
</div>

<div className="input-icon-start mb-3 me-2 position-relative notification-box">
  <input
    type="text"
    className="form-control form-control-sm me-2"
    style={{ padding: "0.5rem 0.625rem" }}
    placeholder="Search..."
    value={search} // Binding the search value
    onChange={(e) => setSearch(e.target.value)} // Handling search input change
  />
</div>

<div className="input-icon-start mb-3 me-2 position-relative">
  <Link
    to="#"
    className="btn btn-light me-3"
    onClick={() => {
      setdateRange([null, null]); // Reset DatePicker
      setSearch(""); // Reset Search input
      setFilterCategory({ value: "", label: "Select a module" }); // Reset category selection
    }}
  >
    Reset
  </Link>
</div>

              </div>
            </div>
            <div className="card-body p-0 pb-3">
              {/* Student List */}
              <Table
                rowKey="_id"
                columns={columns}
                className="bordered-table"
                dataSource={notification}
                pagination={{
                  defaultPageSize: 25, // Set the default page size
                  pageSizeOptions: ["25", "50", "100", "All"], // Options for page size selection
                  showSizeChanger: true, // Enable the page size changer dropdown
                  position: ["bottomRight"],
                  locale: {
                    items_per_page: "",
                  },
                }}
              />
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* <StudentModals /> */}
    </>
  );
};

export default Notification;
