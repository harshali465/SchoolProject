import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { notification } from "antd";
import axios from "axios";
const ForgotTeacherPassword = () => {
  const routes = all_routes;
  const navigation = useNavigate();
  const [logimg, setLogoImg] = useState("");
  const [itsNo, setitsNo] = useState("");
const navigate = useNavigate()
  const navigationPath = () => {
    navigation(routes.resetPassword);
  };
  const studentid = localStorage.getItem("uniqueId");
  useEffect(() => {
    const imgurl = `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/get-image?uniqueId=${localStorage.getItem('uniqueId')}`;
    setLogoImg(imgurl);
  }, [])
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/forgotPassword/${studentid}`,
        {
            email: itsNo,
            role: 'teacher'
        }
      );
      notification.success({message:"success" ,description:response.data.message})
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        notification.error({message:"error" ,description:error.response.data.message})
      } else {
        console.error("Login failed:", error.message);
        notification.error({message:"error" ,description:"An error occurred. Please try again."})
      }
    }
  };
  const handleChange = (e) => {
    setitsNo(e.target.value);
  };
  return (
    <>
      <div className="container-fuild">
        <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row">
            <div className="col-lg-6">
              <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
                <div>
                  <ImageWithBasePath
                    src="assets/img/authentication/authentication-03.jpg"
                    alt="Img"
                  />
                </div>
                  
              <div className="col-lg-6 school_bg">
            <div className="d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div className="authen-overlay-item w-75 mx-auto p-4">
                <h1 className="Admin_color" style={{textAlign:'center'}}>Forgot Password</h1>
                
              </div>
            </div>
          </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
                <div className="col-md-8 mx-auto p-4">
                  <form>
                    <div>
                      <div className=" mx-auto mb-5 text-center">
                      <img
                         crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                        src={logimg}
                        style={{height:"100px"  , width:"100px"}}
                        className=""
                        alt="Logo"
                      />
                      </div>
                      <div className="card">
                        <div className="card-body p-4">
                          <div className=" mb-4">
                            <h2 className="mb-2">Forgot Password?</h2>
                           
                          </div>
                          <div className="mb-3 ">
                            <label className="form-label">Email </label>
                            <div className="input-icon mb-3 position-relative">
                              <span className="input-icon-addon">
                                <i className="ti ti-mail" />
                              </span>
                              <input
                                type="email"
                                className="form-control"
                                value={itsNo}
                                onChange={(e) => {
                                 
                                    handleChange(e);
                                  
                                }}
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <button onClick={(e)=>handleForgotPassword(e)}
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              Submit
                            </button>
                          </div>
                          <div className="text-center">
                            <h6 className="fw-normal text-dark mb-0">
                              Return to{" "}
                              <a onClick={()=>navigate(-1)} className="hover-a ">
                                {" "}
                                Login
                              </a>
                            </h6>
                          </div>
                        </div>
                      </div>
                      {/* <div className="mt-5 text-center">
                        <p className="mb-0 ">Copyright © 2024 - Preskool</p>
                      </div> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotTeacherPassword;