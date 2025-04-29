import { FaCoins } from "react-icons/fa";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import Table from "../../../../../core/common/dataTable/index";
import Table from "../../../../core/common/dataTable/index";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Checkbox, Space } from "antd";
import { CContainer } from "@coreui/react";
import { notification } from "antd";
import { RotatingLines } from "react-loader-spinner";

import moment from "moment";
import { AuthContext } from "../../../helper/AuthState";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import { CircularProgress } from "@mui/material";
import { alignPropType } from "react-bootstrap/esm/types";

const CouponRequest = () => {
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(false);

  const [filterStage, setFilterStage] = useState("");

  const [dateRange, setdateRange] = useState(["", ""]);
  const [startDate, endDate] = dateRange;

  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
  const [search, setSearch] = useState();

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
           render: (date) => moment(date).format("MMM D"),
         
     
    },
    {
      title: "Reward Point Req.",
      dataIndex: "requested_coupon",
    
    },
    {
      title: "Issued date",
      render: (_, record) =>
        record.is_issued ? moment(record?.updatedAt).format("MMM D") : "",
  
    },

    {
      title: "Status",
      render: (_, record) => (record.is_issued ? "Approved" : "Pending"),
    
    },
    {
      title: "Remark Description",
      dataIndex: "remark",
  
      className: "remark-column",
    },
  ];

  const getCoupon = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/coupon-approval/user/${localStorage.getItem(
          "userId"
        )}?academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCoupon(res?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getCoupon();
  }, []);
  const [couponValue, setcouponValue] = useState({});
  const [points, setAllPoints] = useState([]);

  const getCouponValue = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/coupons/?coupon_for=student&academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(
        "respnose is this **********************************",
        setcouponValue
      );
      setcouponValue(res?.data?.data?.docs[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const requestACoupon = async (id) => {
    if (!status) {
      notification.warning({
        message: "Warning",
        description: "Please select a coupon!",
      });
      return;
    }

    setLoading(true);

    try {
      if (points?.RemainingPoints >= couponValue?.coupon_value) {
        const res = await axios.post(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/coupon-approval`,
          {
            requested_coupon: status,
            coupon_id: couponValue?._id,
            academicYearId: authState?.startYearId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        getTotalPointsAwarded();
        setStatus("");
        getCoupon();
        setLoading(false);
        if (res.status === 201) {
          notification.success({
            message: "Success",
            description: "Request Send successfully!",
          });
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotalPointsAwarded = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-total-points-count?userId=${localStorage.getItem(
          "userId"
        )}&academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setAllPoints(res?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getCouponValue();
    getTotalPointsAwarded();
  }, [academicYearId, authState?.startYearId, upcomingyear]);

  console.log(
    "couponValue?.coupon_value -----------------------------",
    couponValue?.coupon_value
  );
  const totalCoupon = Math.floor(
    parseInt(points?.RemainingPoints) / parseInt(couponValue?.coupon_value)
  );
  const showCoupon = Array.from({ length: totalCoupon }, (_, i) => i + 1);
  console.log("this is a show coupon ", showCoupon);
  return (
    <>
      
      {loading && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.5)", // White background with opacity
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999, // Ensure it appears above everything
        }}
      >
        <CircularProgress size={60} />
      </div>
    )}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content  p-3">
          {/* Page Header */}
          <div className="card-header coupon_responsive  rounded">
            <div className="d-flex align-items-center">
              <h4 className="text-dark" style={{ fontSize: "x-large" }}>
                Coupon Request Listing
              </h4>
            </div>

            <div className="d-flex justify-content-end flex-wrap mt-3">
              <div className="col-md-4  min-width  responsive-box">
                <div
                  style={{ marginBottom: "0px" }}
                  className="card bg-info-transparent border-3 border-white text-center p-3"
                >
                  <div className="d-flex align-items-center justify-content-between text-default">
                    <h6 className="">
                      <FaCoins style={{ marginRight: "5px" }} /> Total Points
                      Earned
                    </h6>
                    <p>{points?.totalPoints > 0 ? points?.totalPoints : 0}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 min-width responsive-box">
                <div
                  style={{ marginBottom: "0px" }}
                  className="card bg-warning-transparent border-3 border-white text-center p-3"
                >
                  <div className="d-flex align-items-center justify-content-between text-default">
                    <h6 className="">
                      {" "}
                      <AccountBalanceWalletIcon
                        fontSize="12px"
                        style={{ marginRight: "5px" }}
                      />{" "}
                      Total Points Balance
                    </h6>
                    <p>
                    {points?.RemainingPoints > 0
  ? points.RemainingPoints.toFixed(2)
  : '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* /Page Header */}
          {/* Students List */}
          <div className="card mt-5">
            <div className="card-body p-0 pb-3 pt-1">
              {/* Student List */}
              <Table
                rowKey="_id"
                columns={columns}
                className="bordered-table"
                dataSource={coupon}
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
          <div className="card-header bg-light p-3 rounded">
            <div className="d-flex align-items-center">
              <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                <i className="ti ti-send fs-16" />
              </span>
              <h4 className="text-dark">Send Coupon Request</h4>
            </div>
          </div>

          <div className="filters d-flex gap-3 my-3 align-items-center flex-wrap">
            {/* <select
            name=""
            value={status}
            style={{ width: "200px" }}
            className="form-control form-select"
            onChange={(e) => setStatus(e.target.value)}
            id=""
          >
            <option value="">Select Coupon</option>
            {showCoupon?.map((res, i) => (
              <option value={res} key={i}>
                {res}
              </option>
            ))}
          </select> */}
            <select
              className="form-control form-select"
              value={status || ""}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select a Coupon</option>
              {showCoupon.map((coupon) => (
                <option key={coupon} value={coupon}>
                  {coupon}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={requestACoupon}
            disabled={loading}
            className="btn btn-primary mb-5"
          >
            Request Coupon{" "}
            {loading && <CircularProgress color="white" size={20} />}
          </button>

          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* <StudentModals /> */}
    </>
  );
};

export default CouponRequest;
