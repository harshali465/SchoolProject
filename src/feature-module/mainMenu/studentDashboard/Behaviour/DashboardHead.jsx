import { CContainer } from "@coreui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Routes, useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { AuthContext } from "../../../helper/AuthState";

const DashboardHead = () => {
  const navigate = useNavigate();

  const [points, setpoints] = useState({
    totalEarnedPoints: 0,
    totalredeemPoints: 0,
    totalBalancePoints: 0,
  });

    const academicYearId = localStorage.getItem("academicYearId");
    const upcomingyear = localStorage.getItem("upcomingyear");
    const { authState } = useContext(AuthContext);
  const getPoints = async () => {
    try {
      const response = await axios.get(
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
       if (response?.data?.status == true) {
        setpoints({
          totalEarnedPoints: response?.data?.data?.totalPoints,
          totalredeemPoints: response?.data?.data?.reedemedPoints,
          totalBalancePoints: response?.data?.data?.RemainingPoints,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(academicYearId && authState?.startYearId)
    getPoints();
  }, [academicYearId, authState?.startYearId, upcomingyear]);
  return (
    <div>
      {/* Header Section */}
      <div className="col-12 container-fluid">
        <div className="card-header dashboard_head_responsive  rounded">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="text-dark" style={{fontSize:"x-large"}}>Behaviour Dashboard</h4>
          </div>
          <div className="row content-position g-2" style={{justifyContent:"end"}}>
              <div className="col-auto">
                <button
                  className="btn btn-light fw-medium"
                  onClick={() => navigate("/behaviour/assign/assign-points")}
                >
                  Assign Points
                </button>
              </div>
              <div className="col-auto">
                {/* <button
                  className="btn btn-dark w-100"
                  onClick={() => navigate("/behaviour/coupon-request")}
                >
                  Request Coupon
                </button> */}
              <Link
                          to={all_routes.coupon_request_student}
                          className="btn btn-light "
                        >
                           
                      
                  
                          Request Coupon
                        </Link>
              </div>
              <div className="col-auto">
                {/* <button className="btn btn-dark w-100" onClick={() => navigate("/student/assign/point/classes/view")} >Class-Wise View</button> */}
              </div>
            </div>
        </div>

        <div className="d-flex justify-content-between flex-wrap mt-3 gap-2-responsive">
          <div className="col-md-4   responsive-box">
            <div
              style={{ marginBottom: "0px" }}
              className="card bg-info-transparent border-3 border-white text-center p-3"
            >
              <div className="d-flex align-items-center justify-content-between text-default">
                <h6 className="">
                  <FaCoins style={{ marginRight: "5px" }} /> Total Points Earned
                </h6>
                <p>
                {points.totalEarnedPoints > 0 
  ? points.totalEarnedPoints.toFixed(2) 
  : '0'}

                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4   responsive-box">
            <div
              style={{ marginBottom: "0px" }}
              className="card bg-success-transparent border-3 border-white text-center p-3"
            >
              <div className="d-flex align-items-center justify-content-between text-default">
                <h6 className="">
                  {" "}
                  <FaHandHoldingUsd style={{ marginRight: "5px" }} /> Total
                  Points Redeemed
                </h6>
                <p>
                  {points.totalredeemPoints > 0 ? points.totalredeemPoints : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4  responsive-box">
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
                  {" "}
                  {points.totalBalancePoints > 0
  ? points.totalBalancePoints.toFixed(2)
  : '0'}

                </p>
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}

        {/* <div className="mb-2">
              <div className="row gap-2 upperBox-content  ">
                <div className="col-sm-button d-flex justify-content-start  justify-content-sm-start justify-content-lg-end">
                  <div className="d-flex gap-1 border border-dark   w-b   align-items-center p-2">
                    <p className="mb-0 fw-bolder text-dark">
                      Total Points Earned
                    </p>
                    <p className="fw-bold">{points.totalEarnedPoints}</p>
                  </div>
                </div>
                <div className="col-sm-button d-flex justify-content-start justify-content-sm-start justify-content-lg-end">
                  <div className="d-flex gap-1 border border-dark   w-b   align-items-center p-2">
                    <p className="mb-0 fw-bolder text-dark">
                      Total Points Redeemed
                    </p>
                    <p className="fw-bold">{points.totalredeemPoints}</p>
                  </div>
                </div>
                <div className="col-sm-button d-flex justify-content-start justify-content-sm-start justify-content-lg-end">
                  <div className="d-flex gap-1 border border-dark   w-b   align-items-center p-2">
                    <p className="mb-0 fw-bolder text-dark">
                      Total Points Balance
                    </p>
                    <p className="fw-bold text-blue">
                      {points.totalBalancePoints}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
        {/* Button Section */}
      </div>
      <div className="mb-2 mt-3 ms-auto"></div>
    </div>
  );
};

export default DashboardHead;
