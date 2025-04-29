import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Checkbox, Table, Space } from "antd";
import { CContainer } from "@coreui/react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



import { FaCoins } from 'react-icons/fa';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { FaBalanceScale } from 'react-icons/fa';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { RotatingLines } from "react-loader-spinner";

import moment from "moment";
import { AuthContext } from '../../../helper/AuthState';
import { Link } from 'react-router-dom';
import PredefinedDateRanges from '../../../../core/common/datePicker';
const Report = () => {


  const [status, setStatus] = useState("");
  const token = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(false);

  const [filterStage, setFilterStage] = useState("");

  const [dateRange, setdateRange] = useState(["", ""]);
  const [startDate, endDate] = dateRange;

  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();

  const [search, setSearch] = useState();

  const columns = [
    {
      title: "Month",
      dataIndex: "Month",
    },
    {
      title: "Point Earned",
      dataIndex: "TotalEarned",
    },
    {
      title: "Balance",
      render: (_, record) => record.Balance,
    },

    {
      title: "Action",
      render: (_, record) => (
        <div className="action-buttons">
          <a
            className="link-primary fw-medium"
            onClick={() =>
              navigate("/behaviour/report-view", {
                state: {
                  startDate: getFirstAndLastDate(record?.Month).firstDate,
                  endDate: getFirstAndLastDate(record?.Month).lastDate,
                },
              })
            }
          >
            View
              </a>
              {/* <Link to={routes.activity} className="btn btn-primary w-100">
                      View All
                    </Link> */}
          <a className="link-primary fw-medium">Download Certificate</a>
        </div>
      ),
    },
  ];
  const getFirstAndLastDate = (monthYear) => {
    const [month, year] = monthYear.split("/").map(Number);

    // Get the first and last dates of the month
    const firstDate = new Date(year, month - 1, 1); // Month is 0-indexed
    const lastDate = new Date(year, month, 0); // Day 0 gives the last day of the previous month

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => date.toLocaleDateString("en-CA"); // Outputs date in 'YYYY-MM-DD' format

    return {
      firstDate: formatDate(firstDate),
      lastDate: formatDate(lastDate),
    };
  };

  const [points, setAllPoints] = useState([]);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const getTotalPointsEarned = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-total-points-count?userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTotalPointsEarned(res?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const getReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/month-wise-student-report?studentId=${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setAllPoints(res?.data?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalPointsEarned();
    getReport();
  }, []);

  console.log(
    getFirstAndLastDate("10/2024").firstDate,
    "this is a actualyy date bro ok then"
  );


    return (
        <>
          {/* Page Wrapper */}
          <div className="page-wrapper">
            <div className="content">
              {/* Page Header */}
              <div className="card-header p-3 rounded">
                      <div className="d-flex align-items-center">
                        
                        <h4 className="text-dark" style={{fontSize:"x-large"}}>Monthly Report List</h4>
                        </div>
                        
                     
                    </div>
                
              <div className="card mt-5">
                
                <div className="card-body p-0 pb-3 mt-5 pt-3">
                  {/* Student List */}
                  <Table
          rowKey="_id"
          columns={columns}
          className="bordered-table"
          dataSource={points}
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
                  
            </div>
          </div>
       
        </>
      );
}

export default Report