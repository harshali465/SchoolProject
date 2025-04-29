import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { notification } from "antd";
import CommonSelect from "../../../core/common/commonSelect";
import malegeneric from "../../../image/images/malegeneric.png";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const EditPasswordTeacher = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   oldPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // });
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  // const [showPassword, setShowPassword] = useState({
  //   oldPassword: false,
  //   newPassword: false,
  //   confirmPassword: false,
  // });
  const [touchedFields, setTouchedFields] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({ ...formData, [name]: value });
  //   setTouchedFields({ ...touchedFields, [name]: true });
  // };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
  
    // Set fields as touched
    setTouchedFields({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });
  
    // Validation conditions
    const valid =
      formData.oldPassword && formData.newPassword && formData.confirmPassword;
    const passwordsMatch = formData.newPassword === formData.confirmPassword;
    const newPasswordValid = formData.newPassword.length >= 8;

  
    // If validation fails, show error
    if (!valid || !passwordsMatch || !newPasswordValid) {
      setValidated(false);
      notification.error({
        message: "Error",
        description: !valid
          ? "All fields are required"
          : !passwordsMatch
          ? "Passwords do not match"
          : "New password must be at least 8 characters",
      });
      return;
    }
  
    try {
      // API Call to update password
      const response = await axios.patch(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/updateMyPassword`,
        {
          passwordCurrent: formData.oldPassword,
          passwordConfirm: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Success notification
      notification.success({
        message: "Success",
        description: "Password changed successfully",
      });
  
      // Handle navigation after success
      setVisible(false);
      if (localStorage.getItem("user") === "teacher") {
        navigate(
          `/teacher/login/${localStorage.getItem("schoolName")}/${localStorage.getItem("uniqueId")}`
        );
      } else if(localStorage.getItem("user") === "student")  {
        navigate(
          `/student/login/${localStorage.getItem("schoolName")}/${localStorage.getItem("uniqueId")}`
        );
      }
  
      // Clear token and reset form
      localStorage.removeItem("accessToken");
      resetData();
    } catch (error) {
      console.error("Error submitting form:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "An unexpected error occurred",
      });
      setVisible(false);
    }
  };
  
  const resetData = () => {
    setValidated(false);
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTouchedFields({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const newPasswordValid = formData.newPassword.length >= 8;
  const isEmpty = (field) => !formData[field];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "confirmPassword") {
      if (e.target.value !== formData.newPassword) {
        setError("Passwords do not match!");
      } else {
        setError("");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
          
            <div className="d-md-flex d-block mt-3 change-password ">
              <div className="settings-right-sidebar me-md-3 border-0"></div>
              <div className="flex-fill ps-0 border-0">
                <form>
                  <div className="d-md-flex">
                    <div className="flex-fill">
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5>Change Password</h5>
                        </div>
                        <div className="card-body pb-0">
                          <div className="mb-3 flex-fill">
                            <label className="form-label">Old Password *</label>
                            <div className="input-group">
                              <input
                                type={showPassword.old ? "text" : "password"}
                                name="oldPassword"
                                className="form-control"
                                placeholder="Enter Old Password"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                style={{ fontSize: "12px" }}
                              />
                              <span
                                className="input-group-text"
                                onClick={() => togglePasswordVisibility("old")}
                                style={{ cursor: "pointer" }}
                              >
                                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                              </span>
                            </div>
                          </div>
                          <div className="mb-3 flex-fill">
                            <label className="form-label">New Password *</label>
                            <div className="input-group">
                              <input
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                className="form-control"
                                placeholder="Enter New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                style={{ fontSize: "12px" }}
                              />
                              <span
                                className="input-group-text"
                                onClick={() => togglePasswordVisibility("new")}
                                style={{ cursor: "pointer" }}
                              >
                                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                              </span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              Confirm Password *
                            </label>
                            <div className="input-group">
                              <input
                                type={
                                  showPassword.confirm ? "text" : "password"
                                }
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ fontSize: "12px" }}
                              />
                              <span
                                className="input-group-text"
                                onClick={() =>
                                  togglePasswordVisibility("confirm")
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {showPassword.confirm ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </span>
                            </div>
                          </div>
                          {error && (
                            <p
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {error}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={(e) => handlePasswordChange(e)}
                        >
                          Save
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
    </div>
  );
};

export default EditPasswordTeacher;
