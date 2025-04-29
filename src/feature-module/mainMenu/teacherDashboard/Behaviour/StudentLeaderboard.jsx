import React, { useContext, useEffect, useState } from "react";

import { CContainer } from "@coreui/react";

import { Button, Checkbox, Select, Table, Space } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../helper/AuthState";

function StudentLeaderboard() {
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
  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      width: 50,
      align:"center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Student Name",
      className: "name-column", 
      align: "center",
        dataIndex: "name",
        render: (text, record) => (
          <Link to={`/teacher/singleView`} state={{ id: record?.studentId }} style={{ color: "#1890ff" }}>
            {text}
          </Link>
        ),
    },
    {
      title: "Grade",
      dataIndex: "gradeName",
      align: "center",
    },
    {
      title: "Section",
      dataIndex: "sectionName",
      align: "center",
    },
    {
      title: "Points",
      dataIndex: "totalPositivePoints",
      align: "center",
        sorter: (a, b) => a.totalPositivePoints - b.totalPositivePoints, // Sort by points numerically

    },
  ];
  const getUsers = async () => {
    setLoading(true);
  
      try {
         
          const response = await axios.get(
            `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/get-student-leaderboard?userType=student&academicYearId=${
          academicYearId == authState?.startYearId
            ? academicYearId
            : authState?.startYearId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
              
            }
        );        
        setPointsList(response.data.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }

    }


  useEffect(() => {
    if(academicYearId && authState?.startYearId )
    getUsers();
  }, [academicYearId, authState?.startYearId, upcomingyear]);

  return (
    <div className="mb-10">
      <CContainer fluid>
        <div className=" mt-5 ">
          {/* <div className="d-flex justify-content-between align-items-center mb-2 ">
            <h4 className="m-0">Student Leaderboard</h4>
          </div> */}


                     <div className="card">
                              <div className="card-header d-flex align-items-center justify-content-between flex-wrap">
                                <h4 className="">Student Leaderboard</h4>
                                {/* <div className="d-flex  flex-wrap">
                                  <Link className="link-primary fw-medium">View All</Link>{" "}
                                </div> */}
                              </div>
                              <div className="card-body p-0 py-3">
                              <Table
          rowKey="_id"
          columns={columns}
          className="bordered-table"
          dataSource={pointsList}
          pagination={false}
        />
                              </div>
                            </div>
                  
        </div>

     
      </CContainer>
    </div>
  );
}

export default StudentLeaderboard;
