import React, { useContext, useEffect, useState } from "react";

import { CContainer } from "@coreui/react";
import maleGenericimage from "../../../../image/images/malegeneric.png";
import { Button, Checkbox, Select, Table, Space } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../../helper/AuthState";
import { all_routes } from "../../../router/all_routes";

function PointsGiven() {
  const [pointsList, setPointsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      className: "column-date",
      align: "center",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      render: (date) => moment(date).format("MMM D"),
    },
    {
      title: "Time Stamp",
      dataIndex: "updatedAt",
      responsive: ["lg"],
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      align:"center",
      render: (date) => moment(date).format("h:mm A"),
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      className: "user-column",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "assigned_to",
      key: "firstName",

      render: (assignedTo, record) => (
        <div className="d-flex align-items-center gap-1 min-width-maxContent justify-center">
          <img
            crossOrigin={process.env.REACT_APP_DEV_BASE_URL}
            src={
              assignedTo.photo
                ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${assignedTo.photo}`
                : maleGenericimage
            }
            alt="Profile"
            style={{ height: "30px", width: "30px" }}
            className=" rounded-circle image-table"
          />
          <span className="white-space">{` ${assignedTo?.firstName} ${assignedTo?.lastName}`}</span>
        </div>
      ),

      className: "name-column",
      align: "center",
      // sorter: (a, b) => a.term.localeCompare(b.term),
    },
    // {
    //   title: "Type",
    //   dataIndex: "assigned_to",
    //   key: "type",
    //   render: (assignedTo) =>
    //     assignedTo?.teacherType?.type ? assignedTo?.teacherType?.type : "Na",

    //   // sorter: (a, b) => a.term.localeCompare(b.term),
    // },

    {
      title: "Category",
      dataIndex: "category_id",
      align: "center",
      render: (category_id) => category_id?.category_name,
    },
    {
      title: "Remark Description",
      dataIndex: "remark",
      className: "remark-column",
      align: "center",
    },
    {
      title: "Point",
      dataIndex: "category_id",
      align: "center",
      render: (category_id) => category_id?.point, // Access nested field `firstName`
      sorter: (a, b) => a?.category_id?.point - b?.category_id?.point,
    },
  ];

  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);

  const getAssignPoints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/behaviorpoint/get-points-assign-by-user?academicYearId=${
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
    if(academicYearId && authState?.startYearId)
    getAssignPoints();
  }, [academicYearId, authState?.startYearId, upcomingyear]);
  return (
    <div>
      <CContainer fluid>
        <div className=" mt-5 ">
          {/* <div className="d-flex d-heading justify-content-between align-items-center mb-2 ">
            <h4 className="m-0">Points Given</h4>

            <div className="btn_grup w-smallS">
              <button
                className="btn btn-outline-primary w-btn"
                onClick={() => navigate("/student/points/assigned")}
              >
                {" "}
                View All{" "}
              </button>
            </div>
          </div> */}

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap">
              <h4 className="">Points Given</h4>
              <div className="d-flex  flex-wrap">
                <Link
                  to={all_routes.teacher.behaviour.assignPoints}
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

        {/* {loading && (
          <div className="spinner-container">
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              strokeColor="#506EE4"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )} */}
      </CContainer>
    </div>
  );
}

export default PointsGiven;
