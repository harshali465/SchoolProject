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
const EditProfile = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });
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
      if(studentProfile){
       setPreviewImage(
          studentProfile
            ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${studentProfile}`
            : malegeneric
        );
      
      }
  },[studentProfile])

  useEffect(() => {
    getStudentDetails();
  }, []);

  if (!student) {
    return <div>Loading...</div>;
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
  
    if (selectedFile) {
      formdata.append("photo", selectedFile); 
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
        getStudentDetails();

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

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
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
                                name="first_name"
                                className="form-control"
                                placeholder="Enter First Name"
                                value={formData?.first_name}
                                style={{fontSize:"12px"}}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                            <div className="mb-3 flex-fill">
                              <label className="form-label">Last Name</label>
                              <input
                                type="text"
                                name="last_name"

                                className="form-control"
                                placeholder="Enter Last Name"
                                style={{fontSize:"12px"}}

                                value={formData?.last_name}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">ITS No. </label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email"
                              style={{fontSize:"12px"}}
                              name="its"

                              value={formData?.its}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                          <div className="d-block d-xl-flex">
                            <div className="mb-3 flex-fill me-xl-3 me-0 flex-1" >
                              <label className="form-label">HMR No.</label>
                              <input
                                type="text"
                                className="form-control"
                                style={{fontSize:"12px"}}
 name="hmr_number"
                                placeholder="Enter HMR Name"
                                value={formData?.hmr_number}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                            <div className="mb-3 flex-fill flex-1" >
                              <label className="form-label">Stage</label>
                              
                              <CommonSelect
                                className="select"
                                options={allStages?.map((cat) => ({
                                  value: cat._id,
                                  label: cat.stage,
                                }))}
                                value={
                                  stages
                                    ? {
                                        value: stages,
                                        label: allStages.find(
                                          (cat) => cat._id === stages
                                        )?.stage,
                                      }
                                    : null
                                }
                         
                                onChange={(e) => {
                                  setStages(e ? e.value : null);
                                  getGrades(e.value);
                                }}
                               
                              />

                            
                            </div>
                          </div>
                          <div className="d-block d-xl-flex">
                            <div className="mb-3 flex-fill me-xl-3 me-0">
                              <label className="form-label">Grade</label>

                             

                              <CommonSelect
                                className="select"
                                options={allGrades?.map((cat) => ({
                                  value: cat._id,
                                  label: cat.grade,
                                }))}
                                value={
                                  grades
                                    ? {
                                        value: grades,
                                        label: allGrades.find(
                                          (cat) => cat._id === grades
                                        )?.grade,
                                      }
                                    : null
                                }
                                onChange={(e) => {
                                  setGrades(e ? e.value : null);
                                  getSections(e.value);
                                }}
                              />
                            </div>
                            <div className="mb-3 flex-fill">
                              <label className="form-label">Section</label>
                           

<CommonSelect
                                className="select"
                                options={allSections?.map((cat) => ({
                                  value: cat._id,
                                  label: cat.section,
                                }))}
                                value={
                                    section
                                    ? {
                                        value: section,
                                        label: allSections.find(
                                          (cat) => cat._id === section
                                        )?.section,
                                      }
                                    : null
                                }
                                onChange={(e) => setSection(e.value)}
                              />
                                                          
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5>Father's Information</h5>
                       
                        </div>
                        <div className="card-body pb-0">
                          <div className="d-block d-xl-flex">
                            <div className="mb-3 flex-fill me-xl-3 me-0">
                              <label className="form-label">
                                Father First Name
                              </label>
                              <input
                                type="text"
                                  name="father_first_name"
                                className="form-control"
                                placeholder="Enter Father First Name"
                                value={formData?.father_first_name}
                                style={{fontSize:"12px"}}

                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                            <div className="mb-3 flex-fill">
                              <label className="form-label">
                                Father Last Name
                              </label>
                              <input
                                type="text"
                                   name="father_last_name"
                                className="form-control"
                                placeholder="Enter Father Last Name"
                                style={{fontSize:"12px"}}

                                value={formData?.father_last_name}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                          <div className="d-block d-xl-flex">
                            <div className="mb-3 flex-fill me-xl-3 me-0">
                              <label className="form-label">
                                Father Phone No.
                              </label>
                              <input
                                type="number"
                                  name="father_phone"
                                className="form-control"
                                placeholder="Enter Father Phone No."
                                value={formData?.father_phone}
                                style={{fontSize:"12px"}}

                        onChange={(e) => handleChange(e)}
                              />
                            </div>
                            <div className="mb-3 flex-fill">
                              <label className="form-label">
                                Father Email Address
                              </label>
                              <input
                                type="email"
                                  name="father_email"
                                className="form-control"
                                placeholder="Enter Father Email Address"
                                value={formData?.father_email}
                                style={{fontSize:"12px"}}

                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5>Mother's Information</h5>
                       
                        </div>
                        <div className="card-body pb-0">
                          <div className="d-block d-xl-flex">
                            <div className="mb-3 flex-fill me-xl-3 me-0">
                              <label className="form-label">
                                Mother First Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                     name="mother_first_name"
                                placeholder="Enter Mother First Name"
                                value={formData?.mother_first_name}
                                onChange={(e) => handleChange(e)}
                                style={{fontSize:"12px"}}

                              />
                            </div>
                            <div className="mb-3 flex-fill">
                              <label className="form-label">
                                Mother Last Name
                              </label>
                              <input
                                type="email"
                                  name="mother_last_name"
                                className="form-control"
                                placeholder="Enter Mother Last Name"
                                value={formData?.mother_last_name}
                        onChange={(e) => handleChange(e)}
                        style={{fontSize:"12px"}}

                              />
                            </div>
                          </div>
                          <div className="d-block d-xl-flex">
                            <div className="mb-3 flex-fill me-xl-3 me-0">
                              <label className="form-label">
                                Mother Phone No.
                              </label>
                              <input
                                type="number"
                                   name="mother_phone"
                                className="form-control"
                                placeholder="Enter Mother Phone No."
                                value={formData?.mother_phone}
                                style={{fontSize:"12px"}}

                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                            <div className="mb-3 flex-fill">
                              <label className="form-label">
                                Mother Email Address
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                style={{fontSize:"12px"}}
     name="mother_email"
                                placeholder="Enter Mother Email Address"
                                value={formData?.mother_email}
                                onChange={(e) => handleChange(e)}
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

export default EditProfile;
