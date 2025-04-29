import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CFormSelect } from "@coreui/react";
import axios from "axios";
import { notification } from "antd";
import CommonSelect from "../../../core/common/commonSelect";
import malegeneric from '../../../image/images/malegeneric.png'
import moment from "moment";
const EditProfileTeacher = () => {
  const route = all_routes;
  const [token] = useState(localStorage.getItem("accessToken"));
  const [validated, setValidated] = useState(false);
  const [isLoding, setisLoding] = useState(false);
  const [studentProfile, setStudentProfile] = useState("");

    
      const [previewImage, setPreviewImage] = useState(
        studentProfile
          ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${studentProfile}`
          : malegeneric
      );
      const [selectedFile, setSelectedFile] = useState(null);
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setSelectedFile(file);
          const imageUrl = URL.createObjectURL(file);
          setPreviewImage(imageUrl); // Show preview
        }
      };
    
  const [formData, setFormData] = useState({
    photo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    teacherPassword: "",
    confirmTeacherPassword: "",
    phoneNumber: "",
    housenumber: "",
    housenumber: "",
    whatsAppnumber: "",
    itsnumber: "",
    email: "",
    teachertype: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bloodGroup: "",
    dob: "",
  });

  useEffect(() => {
      if(studentProfile){
       setPreviewImage(
          studentProfile
            ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${studentProfile}`
            : malegeneric
        );
      
      }
  },[studentProfile])
  const navigate = useNavigate();

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
    // getTeacherType()
  }, []);




  const getStudentDetails = () => {
    axios
      .get(`${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(function (response) {
        setFormData({
          firstName: response?.data?.data?.firstName,
          middleName: response?.data?.data?.middleName,
          lastName: response?.data?.data?.lastName,
          phoneNumber: response?.data?.data?.contactPersonMobile,
          housenumber: response?.data?.data?.HomeNumber,
          whatsAppnumber: response?.data?.data?.WhatsAppNumber,
          itsnumber: response?.data?.data?.itsNo,
          email: response?.data?.data?.email,
          // teachertype: response?.data?.data?.teacherType?._id,
          address1: response?.data?.data?.address?.addressLine1,
          address2: response?.data?.data?.address?.addressLine2,
          city: response?.data?.data?.address?.city,
          state: response?.data?.data?.address?.state,
          country: response?.data?.data?.address?.country,
          pincode: response?.data?.data?.address?.pincode,
          bloodGroup: response?.data?.data?.bloodGroup,
          dob: moment(response?.data?.data?.dob).format("YYYY-MM-DD"),
        });

        if (response?.data?.data?.photo) {
          setStudentProfile(response?.data?.data?.photo);
        }
      });
  };
  useEffect(() => {
    getStudentDetails();
  }, []);

  if (!formData) {
    return <div>Loading...</div>; //setting loading to avoid onload error
  }

  const saveData = async (e) => {
    e.preventDefault();

    const address = {
      addressLine1: formData?.address1,
      addressLine2: formData?.address2,
      city: formData?.city,
      state: formData?.state,
      country: formData?.country,
      pincode: formData?.pincode,
    };
    const formdata = new FormData();
    formdata.append("firstName", formData?.firstName);
    formdata.append("middleName", formData?.middleName);
    formdata.append("lastName", formData?.lastName);
    formdata.append("itsNo", formData?.itsnumber);
    formdata.append("email", formData?.email);
    formdata.append("role", "teacher");
    // formdata.append("password" , formData?.teacherPassword)
    formdata.append("schoolId", localStorage.getItem("schoolId"));
    formdata.append("dob", formData?.dob);
    formdata.append("WhatsAppNumber", formData?.whatsAppnumber);
    formdata.append("HomeNumber", formData?.housenumber);
    formdata.append("contactPersonMobile", formData?.phoneNumber);
    formdata.append("address", JSON.stringify(address));
      // formdata.append("teacherType" , formData?.teachertype)
      if (selectedFile) {
        formdata.append("photo", selectedFile);

      }

    // formdata.append("photo" , formData?.profilePic)
    formdata.append("bloodGroup", formData?.bloodGroup);
    const response = await axios.patch(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/updateMe`,
      formdata,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.data?.status == "success") {
      notification.success({
        message: "Success",
        description: " Updated successfully!",
      });
        
        getStudentDetails();
        
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "photo") {
      const selectedFile = event.target.files[0];

      setFormData({ ...formData, photo: selectedFile });
      setStudentProfile(URL.createObjectURL(selectedFile));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Profile</h3>
                {/* <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={route.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Settings</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Profile
                    </li>
                  </ol>
                </nav> */}
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                {/* <div className="pe-1 mb-2">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
                  >
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white btn-icon me-1"
                    >
                      <i className="ti ti-refresh" />
                    </Link>
                  </OverlayTrigger>
                </div> */}
              </div>
            </div>
            <div className="d-md-flex d-block mt-3">
              <div className="settings-right-sidebar me-md-3 border-0">
                <div className="card">
                  <div className="card-header">
                    <h5>Personal Information</h5>
                  </div>
                  <div className="card-body ">
                    <div className="settings-profile-upload">
                      <span className="profile-pic">
                      <img
                        crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                        src={previewImage}
                        alt="Profile Preview"
                        className="edit-user-images"
                      />

                      </span>
                      <div className="title-upload">
                        <h5>Edit Your Photo</h5>
                        {/* <Link to="#" className="me-2">
                          Delete{" "}
                        </Link>
                        <Link to="#" className="text-primary">
                          Update
                        </Link> */}
                      </div>
                    </div>
                    <div className="profile-uploader profile-uploader-two mb-0">
                      <span className="upload-icon">
                        <i className="ti ti-upload" />
                      </span>
                      <div className="drag-upload-btn bg-transparent me-0 border-0">
                        <p className="upload-btn">
                          <span>Click to Upload</span>
                        </p>
                      
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        id="image_sign"
                        onChange={handleImageChange}
                      />
                      <div id="frames" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-fill ps-0 border-0">
                <form>
                  <div className="d-md-flex">
                    <div className="flex-fill">
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5>Personal Information</h5>
                        
                        </div>
                        
<div className="card-body pb-0">
  <div className="d-block d-xl-flex">
    <div className="mb-3 flex-fill me-xl-3 me-0">
      <label className="form-label">First Name</label>
      <input
        type="text"
        name="firstName"
        className="form-control"
        placeholder="Enter First Name"
        style={{ fontSize: "12px" }}
        value={formData?.firstName}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3 flex-fill">
      <label className="form-label">Middle Name</label>
      <input
        type="text"
        name="middleName"
        className="form-control"
        placeholder="Enter Middle Name"
        style={{ fontSize: "12px" }}
        value={formData?.middleName}
        onChange={handleChange}
      />
                                                      </div>
                                                      

  
  </div>


                                                  
  <div className="d-block d-xl-flex">
  <div className="mb-3 flex-fill me-xl-3 me-0">
      <label className="form-label">Last Name</label>
      <input
        type="text"
        name="lastName"
        className="form-control"
        placeholder="Enter Last Name"
        style={{ fontSize: "12px" }}
        value={formData?.lastName}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3 flex-fill ">
      <label className="form-label">Home Phone Number</label>
      <input
        type="number"
        name="housenumber"
        className="form-control"
        placeholder="Enter Home Phone Number"
        style={{ fontSize: "12px" }}
        value={formData?.housenumber}
        onChange={handleChange}
      />
    </div>
                                                      
  </div>


  <div className="d-block d-xl-flex">
  
    <div className="mb-3 flex-fill me-xl-3 me-0">
      <label className="form-label">Mobile Number</label>
      <input
        type="number"
        name="phoneNumber"
        className="form-control"
        placeholder="Enter Mobile Number"
        style={{ fontSize: "12px" }}
        value={formData?.phoneNumber}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3 flex-fill">
      <label className="form-label">WhatsApp Number</label>
      <input
        type="number"
        name="whatsAppnumber"
        className="form-control"
        placeholder="Enter WhatsApp Number"
        style={{ fontSize: "12px" }}
        value={formData?.whatsAppnumber}
        onChange={handleChange}
      />
    </div>
  </div>
  <div className="d-block d-xl-flex">
  <div className="mb-3 flex-fill me-xl-3 me-0 flex-1">
    <label className="form-label">Email Address</label>
    <input
      type="email"
      name="email"
      className="form-control"
      placeholder="Enter Email Address"
      style={{ fontSize: "12px" }}
      value={formData?.email}
      onChange={handleChange}
    />
  </div>
  <div className="mb-3 flex-fill flex-1">
    <label className="form-label">Blood Group</label>
    <select
      name="bloodGroup"
      className="form-control"
      style={{ fontSize: "12px" }}
      value={formData?.bloodGroup}
      onChange={handleChange}
    >
      <option value="">Select Blood Group</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
    </select>
  </div>
</div>
 
  <div className="d-block d-xl-flex">
    <div className="mb-3 flex-fill me-xl-3 me-0 flex-1">
      <label className="form-label">ITS Number</label>
      <input
        type="number"
        name="itsnumber"
        className="form-control"
        placeholder="Enter ITS Number"
        style={{ fontSize: "12px" }}
        value={formData?.itsnumber}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3 flex-fill flex-1">
      <label className="form-label">Date of Birth</label>
      <input
        type="date"
        name="dob"
        className="form-control"
        style={{ fontSize: "12px" }}
        value={formData?.dob?.split("T")[0]}
        onChange={handleChange}
      />
    </div>
  </div>



  <div className="d-block d-xl-flex">
   
    <div className="mb-3 flex-fill me-xl-3 me-0">
      <label className="form-label">Address</label>
      <input
        type="text"
        name="address1"
        className="form-control"
        placeholder="Enter Address Line 1"
        style={{ fontSize: "12px" }}
        value={formData?.address1}
        onChange={handleChange}
      />
                                                      </div>
                                                      <div className="mb-3 flex-fill">
    <label className="form-label">PinCode</label>
    <input
      type="text"
      name="pincode"
      className="form-control"
      placeholder="Enter Pincode"
      style={{ fontSize: "12px" }}
      value={formData?.pincode}
      onChange={handleChange}
    />
  </div>
                                                  </div>
                                                  











  <div className="d-block d-xl-flex">
    <div className="mb-3 flex-fill me-xl-3 me-0">
      <input
        type="text"
        name="address2"
        className="form-control"
        placeholder="Enter Address Line 2"
        style={{ fontSize: "12px" }}
        value={formData?.address2}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3 flex-fill">
      <input
        type="text"
        name="city"
        className="form-control"
        placeholder="Enter City"
        style={{ fontSize: "12px" }}
        value={formData?.city}
        onChange={handleChange}
      />
    </div>
  </div>

  <div className="d-block d-xl-flex">
    <div className="mb-3 flex-fill me-xl-3 me-0">
      <input
        type="text"
        name="state"
        className="form-control"
        placeholder="Enter State"
        style={{ fontSize: "12px" }}
        value={formData?.state}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3 flex-fill">
      <input
        type="text"
        name="country"
        className="form-control"
        placeholder="Enter Country"
        style={{ fontSize: "12px" }}
        value={formData?.country}
        onChange={handleChange}
      />
    </div>
  </div>

  
</div>


                                              
                      </div>
                   
                 
        <div className="text-center">
          <button className="btn btn-primary" onClick={(e)=>saveData(e)} >
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
        {/* /Page Wrapper */}
        {/* Edit Profile */}
      
      </>
    </div>
  );
};

export default EditProfileTeacher;
