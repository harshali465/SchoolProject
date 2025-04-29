import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import React, { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../helper/AuthState";

const Login = () => {
  const routes = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  const date = () => {
    return new Date().getFullYear();
  };
  const location = useLocation();

  const { setAuthState } = useContext(AuthContext);
  const [itsNo, setitsNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  useEffect(() => {
    // Extract the school name and ID from the URL
    const currentPath = location.pathname;
    const uniqueId = "0016";
    const pathParts = currentPath.split("/"); // Split the URL by '/'
    const schoolName = pathParts[3]; // Extract the school name (5th part of the path)
    // const uniqueId = pathParts[4]; // Extract the school ID (6th part of the path)

    if (schoolName && uniqueId) {
      // Check if the current values are different from localStorage
      if (
        schoolName !== localStorage.getItem("schoolName") ||
        uniqueId !== localStorage.getItem("uniqueId")
      ) {
        // Store the school name and ID in localStorage
        localStorage.setItem("schoolName", schoolName);
        localStorage.setItem("uniqueId", uniqueId);
      }
    }
  }, [location.pathname]);

  const accessToken = localStorage.getItem("accessToken");
  const usertype = localStorage.getItem("user");

  const [rememberMe, setRememberMe] = useState(false);

  const [logimg, setLogoImg] = useState("");

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  useEffect(() => {
    // Extract the school name and ID from the URL
    const currentPath = location.pathname;

    const pathParts = currentPath.split("/"); // Split the URL by '/'
    const schoolName = pathParts[3]; // Extract the school name (5th part of the path)
    const uniqueId = pathParts[4]; // Extract the school ID (6th part of the path)
    // const uniqueId = "0016"
    const imgurl = `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/get-image?uniqueId=${uniqueId}`;
    setLogoImg(imgurl);
    if (schoolName && uniqueId) {
      // Check if the current values are different from localStorage
      if (
        schoolName !== localStorage.getItem("schoolName") ||
        uniqueId !== localStorage.getItem("uniqueId")
      ) {
        // Store the school name and ID in localStorage
        localStorage.setItem("schoolName", schoolName);
        localStorage.setItem("uniqueId", uniqueId);
      }
    }
  }, [location.pathname]);
  const handleLogin = async (e) => {
    e.preventDefault();

    const currentPath = location.pathname;

    const pathParts = currentPath.split("/");

    const schoolName = pathParts[3];
    const uniqueId = pathParts[4];
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/login`,
        {
          itsNo,
          password,
          // schoolId,
          uniqueId: uniqueId,
          role: "student",
        }
      );
 console.log("this is a response"  ,response)
      setAuthState({
        role: response.data.data.user.role,
        id: response.data.data.user._id,
        name: response.data.data.user.firstName,
        lastname: response.data.data.user.lastName,
        academicYearId: "",
      });
      const token = response.data.token;
      const user = response.data.data.user.role;
      const userId = response.data.data.user._id;
      const schoolId = response.data.data.user.schoolId;
      // const academicYearId =
      //   response.data?.data?.user?.currentAcademicYear[0]?._id;

      if (
        response?.data?.data?.user?.nextAcademicYear[0]?.is_next_year == true
      ) {
        const academicYearId2 =
          response?.data?.data?.user?.nextAcademicYear[0]?._id;
        localStorage.setItem("upcomingyear", academicYearId2);
      }
      if (
        response?.data?.data?.user?.currentAcademicYear[0]?.is_current_year ==
        true
      ) {
        const academicYearId =
          response.data?.data?.user?.currentAcademicYear[0]?._id;
        localStorage.setItem("academicYearId", academicYearId);
      }
      // localStorage.setItem("academicYearId", academicYearId);

      localStorage.setItem("schoolId", schoolId);

      localStorage.setItem("accessToken", token);
      //alert(token);
      localStorage.setItem("user", user);
      localStorage.setItem("userId", userId);
      // window.location.replace("/");
      navigate("/student-dashboard");
      setitsNo("");
      setPassword("");
    } catch (error) {
      console.log("this is a erro " ,error )
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        console.error("Login failed:", errorMessage);
        alert(errorMessage);
      } else {
        console.error("Login failed:", error.message);
        alert("An error occurred. Please try again."); // Show a generic error message
      }
    }
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <div className="login-background d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div>
                <ImageWithBasePath
                  src="assets/img/authentication/authentication-02.jpg"
                  alt=""
                />
              </div>
              {/* <div className="authen-overlay-item  w-100 p-4">
                <h4 className="text-white mb-3">What's New on Preskool !!!</h4>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>New Academic Session Admission Start(2024-25)</h6>
                    <p className="mb-0 text-truncate">
                      An academic term is a portion of an academic year, the
                      time ....
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Date sheet Final Exam Nursery to Sr.Kg</h6>
                    <p className="mb-0 text-truncate">
                      Dear Parents, As the final examination for the session
                      2024-25 is ...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Annual Day Function</h6>
                    <p className="mb-0 text-truncate">
                      Annual functions provide a platform for students to
                      showcase their...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-0 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June 15th
                      for summer...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
              </div> */}
              <div className="col-lg-6 school_bg">
                <div className="d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
                  <div className="authen-overlay-item w-75 mx-auto p-4">
                    <h1 className="Admin_color" style={{ textAlign: "center" }}>
                      Welcome Student Login
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
              <div className="col-md-8 mx-auto p-4">
                <form onSubmit={handleLogin}>
                  <div>
                    <div className=" mx-auto mb-5 text-center">
                      <img
                        crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                        src={logimg}
                        style={{ height: "100px", width: "100px" }}
                        className=""
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body pb-3">
                        <div className=" mb-4">
                          <h2 className="mb-2">Welcome</h2>
                          <p className="mb-0">
                            Please enter your details to sign in
                          </p>
                        </div>

                        <div className="mb-3 ">
                          <label className="form-label">ITS</label>
                          <div className="input-icon mb-3 position-relative">
                          
                            <input
                              type="text"
                              value={itsNo} // Use controlled input
                              className="form-control"
                              onChange={(e) => {
                                const value = e.target.value.trim();
                                if (value === "" || /^[0-9]+$/.test(value)) {
                                  console.log("value is this" , value)
                                  setitsNo(value);
                                }
                              }}
                            />
                          </div>
                          <label className="form-label">Password</label>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              className="pass-input form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                              className={`ti toggle-password ${
                                isPasswordVisible ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                        </div>
                        <div className="form-wrap form-wrap-checkbox">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                              />
                            </div>
                            <p className="ms-1 mb-0 ">Remember Me</p>
                          </div>
                          <div className="text-end ">
                            <Link
                              to={"/student/forgot-password"}
                              className="link-danger"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <div className="mb-3">
                          <button
                            type="submit"
                            to={routes.studentDashboard}
                            // onClick={handleLogin}
                            className="btn btn-primary w-100"
                          >
                            Sign In
                          </button>
                        </div>
                        <div className="text-center">
                          {/* <h6 className="fw-normal text-dark mb-0">
                            Don’t have an account?{" "}
                            <Link to={routes.register} className="hover-a ">
                              {" "}
                              Create Account
                            </Link>
                          </h6> */}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      {/* <p className="mb-0 ">Copyright © {date()} - Preskool</p> */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
