import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import { Table, notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { feeGroup, feesTypes, paymentType } from '../../../core/common/selectoption/selectoption'
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  status,
  userType,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import { useLocation } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../helper/AuthState";
import { CircularProgress } from "@mui/material";

const CustomControl = ({ children, ...props }) => {
  return <components.Control {...props}>{null}</components.Control>;
};
const AssignPoint = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [defaultDate, setDefaultDate] = useState(null);
  const [newContents, setNewContents] = useState([0]);

  const location = useLocation();

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const academic_Year = location?.state?.academicYear;
  //   const { appState, setAppState } = useAssignContext();
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [collecIds, setCollecIds] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: moment(),
    userType: "",
    teacherType: "",
    category: "",
    pointType: "",
    remark: "",
  });
  console.log("this is  a formtdata", formData?.teacherType);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [userDetails, setUserDetails] = useState([]);

  console.log("this are the suer details", userDetails);
  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);

    if (!selectedOptions || selectedOptions.length === 0) {
      setError("Please select at least one user.");
      setUserDetails([]);
      return;
    }

    const newUserDetails = selectedOptions.map((option) => {
      const userInfo = userList.find((user) => user._id === option.value);

      return userInfo
        ? {
            id: userInfo._id,
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            number: userInfo.itsNo,
            type: userInfo.teacherType?.type || "N/A",
          }
        : null;
    });

    setError("");

    setUserDetails((prevUserDetails) => {
      const filteredNewUserDetails = newUserDetails.filter(
        (user) => user !== null
      );

      const updatedUserDetails = [
        ...prevUserDetails,
        ...filteredNewUserDetails.filter(
          (newUser) =>
            !prevUserDetails.some(
              (existingUser) => existingUser.id === newUser.id
            )
        ),
      ];

      return updatedUserDetails;
    });
  };

  const handleDeleteUser = (e, id) => {
    e.preventDefault();
    setUserDetails((prevDetails) =>
      prevDetails.filter((user) => user.id !== id)
    );
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user.value !== id)
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (
      form.checkValidity() == false ||
      !selectedUsers ||
      selectedUsers.length === 0
    ) {
      setValidated(true);
      notification.error({
        message: "Error",
        description: "Please fill all required fields correctly.",
      });
      setError("Please select at least one user.");
    } else {
      setValidated(false);
      setVisible(true);
    }
  };

  const getTeachers = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/teacher?role=teacher&teacherType=${
          formData?.teacherType ? formData?.teacherType : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.status == "success") {
        setUserList(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const getSchoolAdminList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/role-wise-user?role=school-admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.status == "success") {
        setUserList(
          response?.data?.data?.filter(
            (elm) => elm?._id != localStorage.getItem("userId")
          )
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (formData?.userType == "school-admin") {
      getSchoolAdminList();
    }
    if (formData?.teacherType) {
      getTeachers();
    }
  }, [formData?.userType, formData?.teacherType]);

  const [userList, setUserList] = useState([]);

  const userOption = userList?.map((value) => ({
    value: value?._id,
    label: `${value?.firstName} ${value?.lastName}`,
  }));

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedStudents = selectedUsers.map((student) => ({
      ...student,
      selected: !selectAll,
    }));
    setSelectedUsers(updatedStudents);
    setCollecIds(
      !selectAll ? updatedStudents.map((student) => student._id) : []
    );
  };

  const handleSelect = (id) => {
    const updatedStudents = selectedUsers.map((student) => {
      if (student._id === id) {
        student.selected = !student.selected;
        if (student.selected) {
          setCollecIds((prev) => [...prev, id]);
        } else {
          setCollecIds((prev) => prev.filter((studentId) => studentId !== id));
        }
      }
      return student;
    });
    setSelectedUsers(updatedStudents);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Type",
      dataIndex: "type",
      render: (text) => (text ? text : "-"),
    },

    {
      title: "Action",
      render: (_, record) => (
        <button
          className="btn btn-soft-danger"
          onClick={(e) => {
            handleDeleteUser(e, record?.id);
          }}
          style={{ fontSize: "12px", padding: "6px" }}
        >
          Remove
        </button>
      ),
    },
  ];

  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);

  const [allCategories, setAllCategories] = useState([]);

  const getCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/categories?point_type=Positive&category_for=${formData?.userType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllCategories(response?.data?.data?.docs);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const [teacherType, setTeacherType] = useState([]);
  const getTeacherType = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/teacherType`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.status === 200) {
        setTeacherType(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
    }
  };

  useEffect(() => {
    if (formData?.userType == "teacher") {
      getTeacherType();
      getTeachers();
    }
  }, [formData?.userType , formData?.teacherType]);

  useEffect(() => {
    getCategory();
  }, [formData?.userType]);

  const handleAssignPoints = async (event) => {
    event.preventDefault();
    if (!!!formData?.userType) {
      notification.error({
        message: "Error",
        description: "Please select user type.",
      });
      return;
    }
    // if (formData?.userType === 'teacher' && !!!formData?.teacherType ) {
    //   notification.error({
    //     message: "Error",
    //     description: "Please select teacher type.",
    //   });
    //   return;
    // }
    if (selectedUsers?.length === 0) {
      notification.error({
        message: "Error",
        description: "Please select at least one user.",
      });
      return;
    }

    if (!!!formData?.category) {
      notification.error({
        message: "Error",
        description: "Please select a category.",
      });
      return;
    }

    if (!!!formData?.remark) {
      notification.error({
        message: "Error",
        description: "Please enter a remark.",
      });
      return;
    }
    // if (formData?.userType === "teacher" && !formData?.teacherType) {
    //   notification.error({
    //     message: "Error",
    //     description: "Please enter a teacher type.",
    //   });
    //   return;
    // }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/assign-point`,
        {
          user_type: formData?.userType,
          assigned_to: selectedUsers?.map((res) => res?.value),
          category_id: formData?.category,
          point_type: "Positive",
          remark: formData?.remark,
          academicYearId: authState?.startYearId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status == "success") {
        setLoading(false);
        navigate(-1);
        notification.success({
          message: "Success",
          description: "Behavior points assigned successfully",
        });
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: "Failed to assign ",
      });
    }
  };
  const handleUserTypeChange = (selectedOption) => {
    // Ensure selectedOption is not null and has a value
    if (selectedOption) {
      // const [formData, setFormData] = useState({
      //   date: moment(),
      //   userType: "",
      //   teacherType: "",
      //   category: "",
      //   pointType: "",
      //   remark: "",
      // });
      setFormData({
        date: moment(),
        ["userType"]: selectedOption,

        teacherType: "",
        category: "",
        pointType: "",
        remark: "",
      });
      setUserList([]);
      setSelectedUsers([]);
      setUserDetails([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

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
      )}{" "}
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="row">
            <div className="col-md-12">
              <form>
                {/* Personal Information */}
                <div className="card">
                  <div className="card-header ">
                    <div className="d-flex align-items-center">
                      <h4 className="text-dark" style={{ fontSize: "x-large" }}>
                        Assign Points
                      </h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      {/* User Type */}
                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            User Type <span style={{ color: "red" }}>*</span>
                          </label>
                          {/* <CommonSelect
                            className="select"
                            options={userType}
                            defaultValue={userType.find(
                              (option) => option.value === formData.userType
                            )}
                            onChange={handleUserTypeChange}
                          /> */}

                          <select
                            className="form-control form-select"
                            value={formData.userType || ""}
                            onChange={(e) =>
                              handleUserTypeChange(e.target.value)
                            }
                          >
                            <option value="">Select User Type</option>
                            {userType?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date</label>
                          <div className="input-icon position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format={{
                                format: "DD-MM-YYYY",
                                type: "mask",
                              }}
                              disabled
                              value={formData.date}
                              onChange={(date) =>
                                handleInputChange("date", date)
                              }
                              placeholder="Select Date"
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {formData?.userType == "teacher" && (
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Teacher Type </label>
                            {/* <CommonSelect
                              className="select"
                              options={
                                teacherType &&
                                teacherType.map((teacher) => ({
                                  value: teacher._id,
                                  label: teacher.type,
                                }))
                              }
                              value={
                                teacherType.find(
                                  (teacher) =>
                                    teacher.type === formData.teacherType
                                ) || null
                              }
                              onChange={(e) => {
                                handleInputChange(
                                  "teacherType",
                                  e ? e.value : ""
                                );
                              }}
                            /> */}

                            <select
                              className="form-control form-select"
                              value={formData.teacherType || ""}
                              onChange={(e) =>{
                                handleInputChange("teacherType", e.target.value)
                                setUserList([])
                              }
                              }
                            >
                              <option value="">Select Teacher Type</option>
                              {teacherType?.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                  {teacher.type}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Name */}
                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Name <span style={{ color: "red" }}>*</span>
                          </label>
                          <Select
                            value={selectedUsers}
                            name="siblings"
                            options={userOption}
                            isSearchable={true}
                            isClearable={false}
                            isMulti={true}
                            onChange={(e) => {
                              handleUserChange(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {selectedUsers?.length > 0 && (
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap">
                          <h4 className="">List of users selected</h4>
                        </div>
                        <Table
                          rowKey="_id"
                          columns={columns}
                          className="bordered-tables perfect-size"
                          dataSource={userDetails}
                          pagination={false}
                        />
                      </div>
                    )}

                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Category <span style={{ color: "red" }}>*</span>
                          </label>
                          {/* <CommonSelect
                            className="select"
                            options={
                              allCategories &&
                              allCategories.map((category) => ({
                                value: category._id,
                                label: category.category_name,
                              }))
                            }
                            defaultValue={status.find(
                              (option) => option.value === formData.category
                            )}
                            onChange={(e) =>
                              handleInputChange("category", e ? e.value : "")
                            }
                          /> */}

                          <select
                            className="form-control form-select"
                            value={formData.category || ""}
                            onChange={(e) =>
                              handleInputChange("category", e.target.value)
                            }
                          >
                            <option value="">Select Category</option>
                            {allCategories?.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.category_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Give Remark <span style={{ color: "red" }}>*</span>
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.remark}
                            onChange={(e) =>
                              handleInputChange("remark", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={(e) => handleAssignPoints(e)}
                        className="btn btn-primary mb-3"
                        disabled={loading}
                      >
                        Submit{" "}
                        {loading && (
                          <CircularProgress color="white" size={20} />
                        )}
                      </button>

                      {/* <button
                        onClick={(e) => handleAssignPoints(e)}
                        disabled={loading}
                        className="btn btn-primary mb-3"
                      >
                        Submit {loading && <CircularProgress color="white" size={20} />}
                      </button> */}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignPoint;
