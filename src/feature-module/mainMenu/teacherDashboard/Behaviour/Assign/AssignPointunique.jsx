import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
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
  userTypeTeacher,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import { useLocation } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../helper/AuthState";
import { useAssignContext } from "../../../../helper/AuthSelector";
import { CircularProgress } from "@mui/material";
const AssignPointUnique = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  const datas = location?.state?.data;

  console.log("this datas", datas);
  const [loading, setLoading] = useState(false);
  const { appState, setAppState } = useAssignContext();
  const academicYearId = localStorage.getItem("academicYearId");
  const upcomingyear = localStorage.getItem("upcomingyear");
  const { authState } = useContext(AuthContext);
  const [selectAll, setSelectAll] = useState(false);
  const [collecIds, setCollecIds] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    userType: "",
    grade: "",
    teacherType: "",
    section: "",
    category: "",
    pointType: "",
    remark: "",
  });

  const value = useLocation();

  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userList, setUserList] = useState([]);

  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);

    const newUserDetails = selectedOptions
      ? selectedOptions
          .map((option) => {
            const userInfo = userList.find(
              (user) => user?._id === option?.value
            );

            if (userInfo) {
              return {
                id: userInfo._id,
                name: `${userInfo.firstName} ${userInfo.lastName}`,
                number: userInfo.itsNo,
                grade: userInfo.stageGradeSection?.grade?.grade,
                section: userInfo.stageGradeSection?.section?.section,
                type: userInfo.teacherType?.type || "N/A",
              };
            }

            console.warn(`No matching user found for option: ${option?.value}`);
            return null;
          })
          .filter((user) => user !== null)
      : [];

    setUserDetails((prevDetails) => {
      const mergedDetails = [...prevDetails, ...newUserDetails];
      const uniqueDetails = mergedDetails.filter(
        (user, index, self) => index === self.findIndex((u) => u.id === user.id)
      );
      return uniqueDetails;
    });
  };

  const handleDeleteUser = (e, id) => {
    e.preventDefault();
    setUserDetails((prevDetails) =>
      prevDetails.filter((user) => user.id !== id)
    );

    setSelectedUsers((prevSelected) => {
      const updatedSelected = prevSelected.filter((user) => user.value !== id);

      setAppState({
        grade: formData.grade,
        section: formData.section,
        type: formData.userType,
        selectedData: updatedSelected,
      });

      return updatedSelected;
    });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (name === "pointType" && value) {
      setError((prev) => ({ ...prev, pointType: false }));
    }
    if (name === "category" && value) {
      setError((prev) => ({ ...prev, category: false }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() == false) {
      setValidated(true);
      notification.error({
        message: "Error",
        description: "Please fill all required fields",
      });
    } else {
      setVisible(true);
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

  const getTeachers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/teacher?role=teacher&teacherType=${formData?.teacherType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserList(response?.data?.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const [pagedata, setPageData] = useState([]);
  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/stage-grade-section/get-student-by-grade-section?gradeId=${
          formData?.grade ? formData?.grade : ""
        }&sectionId=${formData?.section ? formData?.section : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserList(response?.data?.data);
      setPageData(response?.data?.data);

      if (appState?.selectedData?.length > 0) {
        setSelectedUsers(appState?.selectedData);

        const newUserDetails = appState.selectedData
          .map((option) => {
            const userInfo = response?.data?.data.find(
              (user) => user._id === option.value
            );
            if (userInfo) {
              return {
                id: userInfo._id,
                name: `${userInfo.firstName} ${userInfo.lastName}`,
                number: userInfo.itsNo,
                grade: userInfo.stageGradeSection?.grade?.grade,
                section: userInfo.stageGradeSection?.section?.section,
                type: userInfo.teacherType?.type,
              };
            }
            return null;
          })
          .filter(Boolean);

        if (newUserDetails.length > 0) {
          setUserDetails(newUserDetails);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    }
  };

  useEffect(() => {
    if (formData?.userType == "student") {
      getUsers();
      if (formData.grade && formData.section) getUsers();
    } else if (formData?.userType == "teacher") {
      getTeachers();
    } else if (formData?.userType == "school-admin") {
      getSchoolAdminList();
    }
  }, [
    formData?.userType,
    formData?.grade,
    formData?.section,
    formData?.teacherType,
  ]);

  const userOption = userList?.map((value) => ({
    grade: value?.stageGradeSection?.grade?.grade,
    section: value?.stageGradeSection?.section?.section,
    value: value?._id,
    label: `${value?.firstName} ${value?.lastName}`,
  }));
  const userOptionTeacher = userList
    ?.map((value) => ({
      type: value?.teacherType?.type,
      value: value?._id,
      label: `${value?.firstName} ${value?.lastName}`,
    }))
    .filter((data) => data?.value !== localStorage.getItem("userId"));

  console.log(
    "this is a userOptionTeacher",
    userOptionTeacher,
    "this is s a userlist",
    userList
  );
  const userOptionSchool = userList?.map((value) => ({
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
  const [previousRoute, setPreviousRoute] = useState(null);

  useEffect(() => {
    // getGrades()

    if (
      location?.state?.previousRoute === "/teacher/assign/point/classes/view"
    ) {
      if (allGrades) {
        const selectedGrade =
          allGrades?.find((grade) => grade._id == location?.state?.grade) ||
          null;

        setFormData((prev) => ({
          ...prev,
          userType: "student",
          grade: selectedGrade?._id,
          // pointType: {value:appState?.pointType , label:appState?.pointType},
          category: appState?.category,
        }));
        getSections(location?.state?.grade);
      }
    }
  }, [allGrades]);

  useEffect(() => {
    if (
      location?.state?.previousRoute === "/teacher/assign/point/classes/view"
    ) {
      if (allSections) {
        const selectedSection =
          allSections?.find(
            (section) => section._id == location?.state?.section
          ) || null;

        setFormData((prev) => ({
          ...prev,
          section: selectedSection?._id,
        }));
      }
    }
  }, [allSections]);

  useEffect(() => {
    if (
      location?.state?.previousRoute === "/teacher/assign/point/classes/view"
    ) {
      if (allCategories) {
        const selectedCategory =
          allCategories?.find(
            (category) => category?._id == appState?.category
          ) || null;

        setFormData((prev) => ({
          ...prev,
          category: selectedCategory?._id,
        }));
      }
    }
  }, [allCategories]);

  const columns = [
    {
      title: "Name",
      dataIndex: "label",
      className: "fontsize-12",
    },

    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   className: "fontsize-12",
    //   render: (text) => (text ? text : "N/A"),
    // },
    ...(formData?.userType === "student"
      ? [
          {
            title: "Grade",
            dataIndex: "grade",
            className: "fontsize-12",
            render: (text) => (text ? text : "N/A"),
          },
          {
            title: "Section",
            dataIndex: "section",
            className: "fontsize-12",
            render: (text) => (text ? text : "N/A"),
          },
        ]
      : formData?.userType === "teacher"
      ? [
          {
            title: "Type",
            dataIndex: "type",
            className: "fontsize-12",
            render: (text) => (text ? text : "N/A"),
          },
        ]
      : []),

    {
      title: "Action",
      render: (_, record) => (
        <button
          onClick={(e) => {
            handleDeleteUser(e, record?.value);
          }}
          danger
          className="btn btn-soft-danger"
          style={{ fontSize: "10px", padding: "6px" }}
        >
          {/* <i className="ti ti-trash-x me-2" /> */}
          Remove
        </button>
      ),
    },
  ];

  const getGrades = async (id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/grade`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllGrades(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSections = async (id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/section/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllSections(res?.data?.records);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategory = async (e) => {
   
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/categories?point_type=${e}&category_for=${datas?.assigned_by?.role}`,
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
        setTeacherType(res?.data?.data); // Set stages data if request is successful
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
    }
  };

  useEffect(() => {
    if (formData?.userType == "student") {
      getGrades();
    } else if (formData?.userType == "teacher") {
      getTeacherType();
    }
  }, [formData?.userType]);
  const [error, setError] = useState({
    pointType: false,
    category: false,
  });

  const handleAssignPoints = async (e) => {
    e.preventDefault();

    if (!!!formData?.pointType) {
      notification.error({
        message: "error",
        description: "Plese select a points type",
      });
      return;
    }
    if (!!!formData?.category) {
      notification.error({
        message: "error",
        description: "Plese select a category",
      });
      return;
    }
    if (!!!formData?.remark) {
      notification.error({
        message: "error",
        description: "Plese give a remark",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/behaviorpoint/assign-point`,
        {
          user_type: datas?.assigned_by?.role,
          assigned_to: [datas?.assigned_by?._id],
          category_id: formData?.category,
          point_type: formData?.pointType,
          remark: formData?.remark,
          academicYearId: authState?.startYearId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppState({});
      setLoading(false);
      navigate(-1);
      notification.success({
        message: "Success",
        description: response?.data?.message,
      });
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: "Failed to assign ",
      });
    }
  };
  const previousFormDataRef = useRef(null);
  const handleNavigate = (e) => {
    // Get the previous grade from the ref
    e.preventDefault();
    const previousGrade = previousFormDataRef.current;

    // Check if the grade has changed and is not null
    // if (formData?.grade && formData.grade !== previousGrade) {
    setAppState({
      grade: formData.grade,
      section: formData.section,
      type: formData.userType,

      selectedData: selectedUsers,

      teacherType: formData?.teacherType,
      pointType: formData?.pointType,
      category: formData?.category,
      remark: formData?.remark,
      alldata: userDetails,
    });

    navigate("/teacher/assign/point/classes/view", {
      state: { grade: formData.grade, section: formData.section },
    });
    // } else {
    //   console.log(
    //     "No navigation: grade unchanged or null",
    //     previousGrade,
    //     "->",
    //     formData.grade
    //   );
    // }
  };

  const [isEdit, setIsEdit] = useState(false);

  const [defaultDate, setDefaultDate] = useState(null);
  const [newContents, setNewContents] = useState([0]);

  const academic_Year = location?.state?.academicYear;

  useEffect(() => {
    if (formData?.userType == "teacher") {
      getTeachers();
    } else if (formData?.userType == "school-admin") {
      getSchoolAdminList();
    }
  }, [formData?.userType, formData?.teacherType]);

  useEffect(() => {
    if (formData?.userType == "teacher") {
      getTeacherType();
    }
  }, [formData?.userType]);

  const handleUserTypeChange = (selectedOption) => {
    if (selectedOption) {
      setAppState({
        grade: "",
        section: "",
        type: "",
        selectedData: [],
      });
      setFormData({
        date: new Date(),
        ["userType"]: selectedOption,

        grade: "",
        teacherType: "",
        section: "",
        category: "",
        pointType: "",
        remark: "",
      });
      setUserList([]);
      setSelectedUsers([]);
      setUserDetails([]);
      // setFormData({
      //   ...formData,
      //   date: moment(),
      // });
    }
  };

  const handleInputChange = (field, value) => {
    console.log("this is a value", value);
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
            background: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
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
                            User Type<span style={{ color: "red" }}>*</span>
                          </label>

                          <input
                            disabled
                            type="text"
                            name="lastName"
                            className="form-control"
                            style={{ fontSize: "12px" }}
                            value={
                              datas?.assigned_by?.role
                                ? datas.assigned_by.role
                                    .split('-')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join('-')
                                : ''
                            }
                            
                                                      />
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
                              value={moment()}
                              placeholder="Select Date"
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {datas?.assigned_by?.role == "student" && (
                        <>
                          <div className="col-xxl col-xl-4 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Grade</label>

                              <input
                                disabled
                                type="text"
                                name="lastName"
                                className="form-control"
                                style={{ fontSize: "12px" }}
                                value={
                                  datas?.assigned_by?.stageGradeSection?.grade
                                }
                              />
                            </div>
                          </div>

                          <div className="col-xxl col-xl-4 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Section</label>

                              <input
                                disabled
                                type="text"
                                name="lastName"
                                className="form-control"
                                style={{ fontSize: "12px" }}
                                value={
                                  datas?.assigned_by?.stageGradeSection?.section
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {datas?.assigned_by?.role == "teacher" && (
                        <div className="col-xxl col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Teacher Type </label>

                            <input
                              disabled
                              type="text"
                              name="lastName"
                              className="form-control"
                              style={{ fontSize: "12px" }}
                              value={datas?.assigned_by?.teacherType}
                            />
                          </div>
                        </div>
                      )}

                      {/* Name */}
                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Name <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            disabled
                            type="text"
                            name="fullName"
                            className="form-control"
                            style={{ fontSize: "12px" }}
                            value={`${datas?.assigned_by?.firstName ?? ""} ${
                              datas?.assigned_by?.lastName ?? ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Category */}
                    </div>

                 

                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      <div className="col-xxl col-xl-4 col-md-6">
                        <div className="mb-3">
                          {console.log("tjs os a a", formData?.pointType)}
                          <label className="form-label">
                            Points Type <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            className="form-control form-select"
                            value={formData?.pointType}
                            onChange={(e) => {
                              handleInputChange("pointType", e.target.value);
                              getCategory(e.target.value);
                            }}
                          >
                            <option value="">Select Points Type</option>
                            <option value="Positive">Positive</option>
                            {formData?.userType !== "school-admin" && (
                              <option value="Negative">Negative</option>
                            )}
                          </select>
                        </div>
                      </div>

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
                            value={formData?.category}
                            onChange={(e) =>
                              handleInputChange("category", e ? e : "")
                            }
                          /> */}
                          {console.log(
                            "thsi is a atergory ",
                            formData.category
                          )}
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

                      {/* Remark */}
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

                    <div className="text-center d-flex align-items-center  justify-content-center">
                    <button
                className="btn btn-light me-2 mb-2"
                onClick={() => navigate('/teacher/behaviour/mypoints-listing')}
              >
                Back
              </button>
                      <button
                        onClick={(e) => handleAssignPoints(e)}
                        disabled={loading}
                        className="btn btn-primary mb-2"
                      >
                        Submit{" "}
                        {loading && (
                          <CircularProgress color="white" size={20} />
                        )}
                      </button>
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

export default AssignPointUnique;
