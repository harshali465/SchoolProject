import React, { useContext, useEffect, useState } from "react";

import { CContainer } from "@coreui/react";
import moment from "moment";
// import maleGenericimage from "../../../../image/images/malegeneric.png"

import maleGenericimage from "../../../../image/images/malegeneric.png";

import { Button, Checkbox, Select, Table, Space } from "antd";
import { Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../helper/AuthState";
import { all_routes } from "../../../router/all_routes";
import { AlignCenter } from "react-feather";

function PointsReceived() {
  const [pointsList, setPointsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  // const [yearmatch, setYearMatch] = useState(
  //   academicYearId !== upcomingyear ? upcomingyear : academicYearId
  // );
  // const selected_year = localStorage.getItem("localstartYear");
  const { authState } = useContext(AuthContext);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-points-assign-to-user?academicYearId=${
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
      setPointsList(response.data.data.docs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(academicYearId &&  authState?.startYearId)
    getUsers();
  }, [academicYearId, authState?.startYearId, upcomingyear]);
  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      width: 50,
      align:"center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      align:"center",
      render: (date) => moment(date).format("MMM D"),
      className: "column-date",
    },
    {
      title: "Time Stamp",
      dataIndex: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      align:"center",
      render: (date) => moment(date).format("h:mm A"),
      responsive: ["lg"],
    },
    {
      title: "User Type",
      dataIndex: "assigned_by",
      // render: (assigned_by) => `${assigned_by?.role}`, // Access nested field `firstName`
      render: (text) =>
        text?.role?.charAt(0).toUpperCase() + text?.role?.slice(1),
      className: "user-column",
      align:"center",
    },
    {
      title: "Name",
      dataIndex: "assigned_by",
      key: "firstName",
      align:"center",
      render: (assigned_by, record) => (
        <div className="d-flex align-items-center gap-1 min-width-maxContent justify-center" >
          <img
            crossOrigin={process.env.REACT_APP_DEV_BASE_URL}
            src={
              assigned_by.photo
                ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${assigned_by.photo}`
                : maleGenericimage
            }
            alt="Profile"
            style={{ height: "30px", width: "30px" }}
            className=" rounded-circle image-table"
          />
          {console.log("this is a image user" , assigned_by)}
          <span className="white-space">{`${assigned_by?.firstName} ${assigned_by?.lastName}`}</span>
        </div>
      ),

      // align: "center",
      className: "name-column",
    },

    {
      title: "Type",
      dataIndex: "assigned_by",
      render: (assigned_by) =>
        assigned_by?.teacherType?.type ? assigned_by?.teacherType?.type : "Na",
      className: "user-column",
      align:"center",
    },

    {
      title: "Category",
      dataIndex: "category_id",
      align:"center",
      render: (category_id) => category_id?.category_name,
    },
    {
      title: "Remark Description",
      dataIndex: "remark",
      align:"center",
      className: "remark-column", 
    },
    {
      title: "Point",
      dataIndex: "category_id",
     
      align:"center",
      render: (category_id) => category_id?.point, // Access nested field `firstName`
    },
  ];

  return (
    <div>
      <CContainer fluid>
        <div className=" mt-5 ">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap">
              <h4 className="">Points Received</h4>
              <div className="d-flex  flex-wrap">
                <Link
                  to={all_routes.mypoints}
                  className="link-primary fw-medium"
                >
                  View All
                </Link>{" "}
              </div>
            </div>
            <div className="card-body p-0 pb-3">
              <Table
                rowKey="_id"
                columns={columns}
                className="bordered-table"
                dataSource={pointsList.slice(0, 5)}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </CContainer>
    </div>
  );
}

export default PointsReceived;
