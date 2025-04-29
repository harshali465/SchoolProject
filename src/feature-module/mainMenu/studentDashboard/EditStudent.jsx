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

import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { CFormLabel, CFormSelect } from "@coreui/react";
const EditStudent = () => {
  const [token] = useState(localStorage.getItem("accessToken"));
  const [student, setstudent] = useState();
  const [validated, setValidated] = useState(false);
  const [isLoding, setisLoding] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    its: "",
    hmr_number: "",
    father_first_name: "",
    father_last_name: "",
    father_email: "",
    father_phone: "",
    mother_first_name: "",
    mother_last_name: "",
    mother_email: "",
    mother_phone: "",
    school_name: "",
  });

  const [allStages, setAllStages] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [allSections, setAllSections] = useState([]);

  const [photo, setPhoto] = useState(null);

  const [loadingStages, setLoadingStages] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingsection, setLoadingsection] = useState(true);
  const [studentProfile, setStudentProfile] = useState("");

  const [stages, setStages] = useState("");
  const [grades, setGrades] = useState("");
  const [section, setSection] = useState("");

  const navigate = useNavigate();

  const getStages = async () => {
    setLoadingStages(true); // Start loading before the request
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.status === 200) {
        setAllStages(res?.data?.records); // Set stages data if request is successful
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
    } finally {
      setLoadingStages(false); // End loading after the request completes
    }
  };

  useEffect(() => {
    getStages();
  }, []);

  const getGrades = async (id) => {
    setLoadingGrades(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage/${id}/grade`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllGrades(res?.data?.records);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingGrades(false); // End loading after the request completes
    }
  };

  const getSections = async (sid, id) => {
    setLoadingsection(true);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/stage-grade-section/stage/${
          sid || stages
        }/grade/${id}/section`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllSections(res?.data?.records);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingsection(false); // End loading after the request completes
    }
  };

  const [toast, addToast] = useState(0);
  const toaster = useRef();
 
  const [previewImage, setPreviewImage] = useState(
    "http://13.51.124.103/images/no_image.png"
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setPhoto(file);
    }
  };

  const getStudentDetails = () => {
    axios
      .get(`${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(function (response) {
        setstudent(response?.data?.data);
        setFormData({
          first_name: response?.data?.data?.firstName,
          last_name: response?.data?.data?.lastName,
          its: response?.data?.data?.itsNo,
          hmr_number: response?.data?.data?.HMRNumber,
          father_first_name:
            response?.data?.data?.familyDetails?.fatherFirstName,
          father_last_name: response?.data?.data?.familyDetails?.fatherLastName,
          father_email: response?.data?.data?.familyDetails?.fatherEmail,
          father_phone: response?.data?.data?.familyDetails?.fatherPhone,
          mother_first_name:
            response?.data?.data?.familyDetails?.motherFirstName,
          mother_last_name: response?.data?.data?.familyDetails?.motherLastName,
          mother_email: response?.data?.data?.familyDetails?.motherEmail,
          mother_phone: response?.data?.data?.familyDetails?.motherPhone,
          school_name: response?.data?.data?.schoolName,
        });
        setStages(response?.data?.data?.stageGradeSectionData?.stage?._id);
        getGrades(response?.data?.data?.stageGradeSectionData?.stage?._id);
        setGrades(response?.data?.data?.stageGradeSectionData?.grade?._id);
        getSections(
          response?.data?.data?.stageGradeSectionData?.stage?._id,
          response?.data?.data?.stageGradeSectionData?.grade?._id
        );
        setSection(response?.data?.data?.stageGradeSectionData?.section?._id);

        if (response?.data?.data?.photo) {
          setStudentProfile(response?.data?.data?.photo);
        }
      });
  };
  useEffect(() => {
    getStudentDetails();
  }, []);

  if (!student) {
    return <div>Loading...</div>; //setting loading to avoid onload error
  }

  // saving data and making adaatDatamodels for everything mentioned in form

  const saveData = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const familyDetails = {
      fatherFirstName: formData?.father_first_name,
      fatherLastName: formData?.father_last_name,
      fatherEmail: formData?.father_email,
      fatherPhone: formData?.father_phone,
      motherFirstName: formData?.mother_first_name,
      motherLastName: formData?.mother_last_name,
      motherEmail: formData?.mother_email,
      motherPhone: formData?.mother_phone,
    };

    const formdata = new FormData();
    formdata.append("firstName", formData?.first_name);
    formdata.append("lastName", formData?.last_name);
    formdata.append("itsNo", formData?.its);
    formdata.append("grade", grades);
    formdata.append("section", section);
    formdata.append("HMRNumber", formData?.hmr_number);

    formdata.append("familyDetails", JSON.stringify(familyDetails));
    if (photo) {
      formdata.append("photo", photo);
    }
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/updateMe`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
   
      if (response?.data?.status == "success") {
        getStudentDetails();
        notification.success({
          message: "Success",
          description: "Student updated successfully!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={saveData}>
              {/* Personal Information */}
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex align-items-center">
                    <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                    <i className="ti ti-edit fs-16" />

                    </span>
                    <h4 className="text-dark">Edit Profile</h4>
                  </div>
                              </div>
                              <div className="p-5 text-center">
          <p>
            For updating the profile information, kindly share details on the
            given email id below.
          </p>
          <p>Please mention your ITS number in the email subject.</p>
          <p>
            {" "}
            <a href="mailto:update.myaadat@gmail.com">
              update.myaadat@gmail.com
            </a>
          </p>
        </div>
        <div className="card-bodyy test">
            <>
                                      <div className="p-5">
                                      <div
            // className="card-header"
            style={{ fontSize: "25px", fontWeight: "400" ,marginBottom:"15px"}}
          >
            Student Information
          </div>
                <div className="row">
                  <div className="col-md-6 form-group bottom-spe ">
                    <label className="col-md-6 form-label" for="firstname">
                      First Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control "
                        placeholder="firstname"
                        name="first_name"
                        type="text"
                        value={formData?.first_name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>

                    <label className="col-md-6 form-label" for="lastname">
                      Last Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control "
                        placeholder="Last Name"
                        name="last_name"
                        type="text"
                        value={formData?.last_name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>

                    {/* <label className="col-md-6 control-label" for="lastname">
                      School Name
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="School Name"
                        name="school_name"
                        type="text"
                        value={formData?.school_name}
                        disabled
                      />
                    </div> */}
                  </div>

                  <div className="col-md-6 form-group">
                    {/* <div className="form-group">
                      <img
                        crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                        src={
                          studentProfile
                            ? `${process.env?.REACT_APP_DEV_BASE_URL}/uploads/${studentProfile}`
                            : previewImage
                        }
                        alt="Profile Preview"
                        className="edit-user-image"
                      />

                      <div className="input-group mb-3 mt-3">
                        <input
                          type="file"
                          className="form-control"
                          id="profile_picture_id"
                          name="profile_picture"
                          onChange={handleImageChange}
                        />
                        <label
                          className="input-group-text"
                          htmlFor="profile_picture_id"
                        >
                          Profile Picture
                        </label>
                      </div>
                    </div> */}


<div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
  <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
    {/* Conditionally render the image or the icon */}
    {studentProfile || previewImage ? (
      <img
        crossorigin={process.env.REACT_APP_DEV_BASE_URL}
        src={
          studentProfile
            ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${studentProfile}`
            : previewImage
        }
        alt="Profile Preview"
        className="edit-user-image"
      />
    ) : (
      <i className="ti ti-photo-plus fs-16" />
    )}
  </div>

  <div className="profile-upload">
    <div className="profile-uploader d-flex align-items-center">
      {/* File upload section */}
      <div className="drag-upload-btn mb-3">
        Upload
        <input
          type="file"
          className="form-control image-sign"
          multiple
          onChange={handleImageChange} // Assuming you have handleImageChange function for handling file input
        />
      </div>

    
    </div>

    {/* Instructions for file upload */}
    <p className="fs-12">
      Upload image size 4MB, Format JPG, PNG, SVG
    </p>
  </div>
</div>

                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="ejamaat_number"
                    >
                      ITS No. <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control "
                        placeholder="ITS No"
                        name="its"
                        type="text"
                        value={formData?.its}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="ejamaat_number"
                    >
                      HMR No. <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control "
                        placeholder="HMR No"
                        name="hmr_number"
                        type="text"
                        value={formData?.hmr_number}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <CFormLabel
                      htmlFor="stage"
                      className="col-md-6 control-label "
                    >
                      Stage
                    </CFormLabel>

                    <div className="col-md-12">
                      <CFormSelect
                        id="stage"
                        name="stage"
                        onChange={(e) => {
                          setStages(e.target.value);
                          getGrades(e.target.value);
                        }}
                        value={stages}
                      >
                        <option value="">
                          {loadingStages ? "Loading..." : "Select Stage"}
                        </option>
                        {loadingStages ? (
                          <option disabled>select stages...</option> // Loading message
                        ) : (
                          allStages?.map((res, i) => (
                            <option key={i} value={res?._id}>
                              {res?.stage}
                            </option>
                          ))
                        )}
                      </CFormSelect>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <CFormLabel
                      htmlFor="grade"
                      className="col-md-6 control-label "
                    >
                      Grade
                    </CFormLabel>
                    <div className="col-md-12">
                      <CFormSelect
                        id="grade"
                        name="grade"
                        onChange={(e) => {
                          setGrades(e.target.value);
                          getSections(e.target.value);
                        }}
                        value={grades}
                      >
                        {}
                        <option value="">
                          {loadingGrades ? "Loading..." : "Select grade"}
                        </option>
                        {loadingGrades ? (
                          <option disabled>select grade...</option> // Loading message
                        ) : (
                          allGrades?.map((res, i) => (
                            <option value={res?._id} key={i}>
                              {" "}
                              {res?.grade}{" "}
                            </option>
                          ))
                        )}
                      </CFormSelect>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <CFormLabel
                      htmlFor="section"
                      className="col-md-6 control-label form-label "
                    >
                      Section
                    </CFormLabel>
                    <div className="col-md-12">
                      <CFormSelect
                        id="section"
                        name="section"
                        onChange={(e) => setSection(e.target.value)}
                        value={section}
                      >
                        <option value="">
                          {loadingsection ? "Loading..." : "Select section"}
                        </option>
                        {loadingsection ? (
                          <option disabled>select section...</option> // Loading message
                        ) : (
                          allSections?.map((res, i) => (
                            <option value={res?._id} key={i}>
                              {res?.section}{" "}
                            </option>
                          ))
                        )}
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
            
            </>
          </div>
                              <div
          className="p-5"
        >
          <div
            // className="card-header"
            style={{ fontSize: "25px", fontWeight: "400"  , marginBottom:"15px" }}
          >
            Father's Information
          </div>
          <div className="card-bodyy test">
            <>
              <div>
                <div className="row">
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6  form-label"
                      for="father_first_name"
                    >
                      Father First Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control form-label"
                        placeholder="Father First Name"
                        name="father_first_name"
                        type="text"
                        value={formData?.father_first_name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="father_last_name"
                    >
                      Father last Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Father last Name"
                        name="father_last_name"
                        type="text"
                        value={formData?.father_last_name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="father_phone_number"
                    >
                      Father Phone Number{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Father Phone Number"
                        name="father_phone"
                        type="text"
                        value={formData?.father_phone}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="father_email_address"
                    >
                      Father Email Address{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Father Email Address"
                        name="father_email"
                        type="text"
                        value={formData?.father_email}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            
            </>
          </div>
        </div>
        <div
         className="p-5"
        >
          <div
            // className="card-header"
            style={{ fontSize: "25px", fontWeight: "400" ,marginBottom:"15px"}}
          >
            Mother's Information
          </div>
          <div className="card-bodyy test">
            <>
              <div>
                <div className="row">
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="mother_first_name"
                    >
                      Mother First Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Mother First Name"
                        name="mother_first_name"
                        type="text"
                        value={formData?.mother_first_name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="mother_last_name"
                    >
                      Mother last Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Mother last Name"
                        name="mother_last_name"
                        type="text"
                        value={formData?.mother_last_name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="mother_phone_number"
                    >
                      Mother Phone Number{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Mother Phone Number"
                        name="mother_phone"
                        type="text"
                        value={formData?.mother_phone}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 form-group ">
                    <label
                      className="col-md-6 form-label"
                      for="mother_email_address"
                    >
                      Mother Email Address{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        placeholder="Mother Email Address"
                        name="mother_email"
                        type="text"
                        value={formData?.mother_email}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            
            </>
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
