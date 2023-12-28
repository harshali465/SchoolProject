import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CFormFeedback,
  CInputFile,
  CRow,
  CContainer,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilArrowThickRight } from "@coreui/icons";
// imports for modal
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import axios from "axios";

function Addstudent() {
  const token = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    profilePic: "",
    firstName: "",
    lastName: "",
    studentPassword: "",
    ConfirmStudentPassword: "",
    class: "",
    house: "",
    phoneNumber: "",
    studentId: "",
    division: "",
    mentor: "",
    siblings: [],
    fatherFirstName: "",
    fatherLastName: "",
    fatherPhoneNumber: "",
    fatherEmailAddress: "",
    motherFirstName: "",
    motherLastName: "",
    motherPhoneNumber: "",
    motherEmailAddress: "",
    year: "",
    term: "",
  });

  const [Popup1, setPopup1] = useState(false);
  const [Popup2, setPopup2] = useState(false);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPassword, setshowPassword] = useState("password");

  const [getMentors, setgetMentors] = useState([]);
  const [getStudents, setgetStudents] = useState([]);

  useEffect(() => {
    const getmentors = async () => {
      try {
        // const token =
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

        const response = await axios.get(
          "http://18.118.42.224:3001/api/v1/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              role: "teacher",
            },
          }
        );

        console.log(response.data.data.docs);
        setgetMentors(response.data.data.docs);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getmentors();
    const getstudents = async () => {
      try {
        // const token =
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

        const response = await axios.get(
          "http://18.118.42.224:3001/api/v1/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              role: "student",
            },
          }
        );

        console.log(response.data.data.docs);
        setgetStudents(response.data.data.docs);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getstudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // if (name === "profilePic") {
    //   // const files = e.target.files;
    //   // If no files are selected, clear the existing state for that input

    //   const selectedFiles = event.target.files[0];
    //   setFormData({ ...formData, profilePic: selectedFiles });
    // }

    // setFormData({ ...formData, [name]: value });

    if (name === "profilePic") {
      const selectedFile = event.target.files[0];
      setFormData({ ...formData, profilePic: selectedFile }); // Update formData directly with the selected file
    } else {
      setFormData({ ...formData, [name]: value }); // For other inputs, update formData as usual
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      console.log("form is valid and good to ship");

      // asking for confirmation here
      setVisible(true);
    }
  };

  const generateuid = () => {
    const uId =
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    setFormData({ ...formData, studentId: uId });
  };

  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    itsNo: formData.phoneNumber,
    email: formData.fatherEmailAddress,
    gender: "male",
    password: formData.studentPassword,
    studentId: formData.studentId,
    class: formData.class,
    house: formData.house,
    division: formData.division,
    mentor: formData.mentor,
    siblings: formData.siblings,
    familyDetails: {
      fatherFirstName: formData.fatherFirstName,
      fatherLastName: formData.fatherLastName,
      fatherPhone: formData.fatherPhoneNumber,
      fatherEmail: formData.fatherEmailAddress,
      motherFirstName: formData.motherFirstName,
      motherLastName: formData.motherLastName,
      motherPhone: formData.motherPhoneNumber,
      motherEmail: formData.motherEmailAddress,
    },
    behaviousPoints: {
      positivePoints: "500",
      negativePoints: "200",
    },
    year: formData.year,
    term: formData.term,
    profilePic: formData.profilePic,
  };

  const fd = new FormData();

  // Append form fields to the FormData instance
  Object.keys(data).forEach((key) => {
    fd.append(key, data[key]);
  });

  const handleFormSubmission = async () => {
    console.log(formData);
    const response = await axios.post(
      "http://18.118.42.224:3001/api/v1/users/student",
      fd,

      // {
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   itsNo: formData.phoneNumber,
      //   email: formData.fatherEmailAddress,
      //   gender: "male",
      //   password: formData.studentPassword,
      //   studentId: formData.studentId,
      //   class: formData.class,
      //   house: formData.house,
      //   division: formData.division,
      //   mentor: formData.mentor,
      //   siblings: formData.siblings,
      //   familyDetails: {
      //     fatherFirstName: formData.fatherFirstName,
      //     fatherLastName: formData.fatherLastName,
      //     fatherPhone: formData.fatherPhoneNumber,
      //     fatherEmail: formData.fatherEmailAddress,
      //     motherFirstName: formData.motherFirstName,
      //     motherLastName: formData.motherLastName,
      //     motherPhone: formData.motherPhoneNumber,
      //     motherEmail: formData.motherEmailAddress,
      //   },
      //   behaviousPoints: {
      //     positivePoints: "500",
      //     negativePoints: "200",
      //   },
      //   year: formData.year,
      //   term: formData.term,
      //   profilePic: formData.profilePic,
      // },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Other headers can be added as needed
        },
      }
    );

    setVisible(false);
    console.log(response);
    resetData();
  };

  const resetData = () => {
    setPopup1(false);
    setPopup2(false);
    setValidated(false);
    setFormData({
      profilePic: "",
      firstName: "",
      lastName: "",
      studentPassword: "",
      ConfirmStudentPassword: "",
      class: "",
      house: "",
      phoneNumber: "",
      studentId: "",
      division: "",
      mentor: "",
      siblings: [],
      fatherFirstName: "",
      fatherLastName: "",
      fatherPhoneNumber: "",
      fatherEmailAddress: "",
      motherFirstName: "",
      motherLastName: "",
      motherPhoneNumber: "",
      motherEmailAddress: "",
      year: "",
      term: "",
    });
  };

  // multi select for sibilings
  // const handleSiblingsSelection = (event) => {
  //   const selectedOptions = Array.from(
  //     event.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   setFormData({ ...formData, siblings: selectedOptions });
  // };
  const [selectedSiblings, setSelectedSiblings] = useState([]);
  const handleSiblingsSelection = (event) => {
    const selectedOption = event.target.value;
    if (!selectedSiblings.includes(selectedOption)) {
      const updatedSelection = [...selectedSiblings, selectedOption];
      setSelectedSiblings(updatedSelection);
      setFormData({ ...formData, siblings: updatedSelection });
    }
  };

  return (
    <>
      <CContainer fluid className="container overflow-auto">
        {/* modal */}
        <CModal
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">
              Form submission
            </CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you wish to sumbit this form?</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleFormSubmission}>
              Yes!
            </CButton>
          </CModalFooter>
        </CModal>
        <div className="display-5 text-center pb-3 font-weight-bold">
          Add student
        </div>
        <div className="display-6 text-center pb-3">Student information</div>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CRow>
            <CCol md={6} className="d-flex flex-column align-items-center col1">
              <CCol className="pt-4">
                <CFormInput
                  type="file"
                  class="form-control"
                  label="Profile pic"
                  name="profilePic"
                  id="inputGroupFile02"
                  // value={formData.profilePic}
                  onChange={handleChange}
                />
              </CCol>
              <CCol>
                <CFormLabel htmlFor="validationCustomPassword">
                  Password
                </CFormLabel>
                <CInputGroup className="has-validation">
                  <CInputGroupText
                    onClick={() => {
                      if (showPassword === "text") {
                        setshowPassword("password");
                      } else {
                        setshowPassword("text");
                      }
                    }}
                  >
                    @
                  </CInputGroupText>
                  <CFormInput
                    type={showPassword}
                    aria-describedby="inputGroupPrependFeedback"
                    id="validationCustomPassword"
                    name="studentPassword"
                    required
                    value={formData.studentPassword}
                    onChange={handleChange}
                  />
                </CInputGroup>
              </CCol>

              <CCol>
                <CFormLabel htmlFor="validationCustomConfirmPassword">
                  Confirm Password
                </CFormLabel>
                <CInputGroup className="has-validation">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type={showPassword}
                    aria-describedby="inputGroupPrependFeedback"
                    id="validationCustomConfirmPassword"
                    name="ConfirmStudentPassword"
                    required
                    value={formData.ConfirmStudentPassword}
                    onChange={handleChange}
                  />
                </CInputGroup>
              </CCol>
              <CCol className="pt-2">
                <CFormInput
                  type="number"
                  feedbackValid="Looks good!"
                  id="validationCustom03"
                  label="Home phone number"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </CCol>
              <CCol>
                <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select a valid Division."
                  id="validationCustom04"
                  label="Division"
                  name="division"
                  required
                  value={formData.division}
                  onChange={handleChange}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  <option>div A</option>
                  <option>div B</option>
                  <option>div C</option>
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  aria-describedby="validationCustom07Feedback"
                  feedbackInvalid="Please select a valid Mentor."
                  id="validationCustom07"
                  label="Sibilings"
                  name="sibilings"
                  required
                  onChange={handleSiblingsSelection}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>

                  {getStudents.map((student) => {
                    return (
                      <option value={student._id} onClick={null}>
                        {student.firstName} {student.lastName}
                      </option>
                    );
                  })}
                </CFormSelect>
                <div>
                  {selectedSiblings.length > 0 &&
                    selectedSiblings.map((selectedId) => {
                      const selectedStudent = getStudents.find(
                        (student) => student._id === selectedId
                      );
                      return (
                        <span key={selectedId}>
                          {selectedStudent &&
                            `${selectedStudent.firstName} ${selectedStudent.lastName}, `}
                        </span>
                      );
                    })}
                  <CButton
                    className="btn btn-md btn-dark"
                    onClick={() => {
                      setSelectedSiblings([]);
                    }}
                  >
                    reset
                  </CButton>
                </div>
              </CCol>
            </CCol>

            <CCol md={6} className="d-flex flex-column align-items-center col2">
              <CCol className="pt-4">
                <CFormInput
                  type="text"
                  feedbackValid="Looks good!"
                  id="validationCustom01"
                  label="First name"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </CCol>

              <CCol>
                <CFormInput
                  type="text"
                  feedbackValid="Looks good!"
                  id="validationCustom02"
                  label="Last name"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </CCol>

              <CCol>
                <CFormSelect
                  aria-describedby="validationCustom05Feedback"
                  feedbackInvalid="Please select a valid Class."
                  id="validationCustom05"
                  label="Class"
                  name="class"
                  required
                  value={formData.class}
                  onChange={handleChange}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  <option>Grade 1</option>
                  <option>Grade 2</option>
                  <option>Grade 3</option>
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  aria-describedby="validationCustom06Feedback"
                  feedbackInvalid="Please select a valid House."
                  id="validationCustom06"
                  label="House"
                  name="house"
                  required
                  value={formData.house}
                  onChange={handleChange}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  <option>Green house</option>
                  <option>Blue house</option>
                  <option>Red house</option>
                </CFormSelect>
              </CCol>
              <CCol className="pt-2">
                <CFormInput
                  type="text"
                  id="validationCustom01"
                  label="StudentId"
                  name="studentId"
                  required
                  readOnly
                  value={formData.studentId}
                  placeholder="null-id"
                />
                <CButton
                  color="dark"
                  className="float-end btn-md"
                  onClick={generateuid}
                >
                  Generate id
                </CButton>
              </CCol>

              <CCol>
                <CFormSelect
                  aria-describedby="validationCustom07Feedback"
                  feedbackInvalid="Please select a valid Mentor."
                  id="validationCustom07"
                  label="Mentor"
                  name="mentor"
                  required
                  value={formData.mentor}
                  onChange={handleChange}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  {/* <option>Mentor A</option>
                  <option>Mentor B</option>
                  <option>Mentor C</option> */}
                  {getMentors.map((mentor) => {
                    return (
                      <option value={mentor._id}>{mentor.firstName}</option>
                    );
                  })}
                </CFormSelect>
              </CCol>
            </CCol>
          </CRow>

          <CContainer fluid className=" d-flex mt-4">
            <CContainer fluid className="father-info">
              <div className="display-6 text-center pb-3">Father details</div>
              <CRow>
                <CCol md={12} className="fathers-column">
                  <CCol>
                    <CFormInput
                      type="text"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Fathers first name"
                      name="fatherFirstName"
                      required
                      value={formData.fatherFirstName}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="text"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Fathers last name"
                      name="fatherLastName"
                      required
                      value={formData.fatherLastName}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Fathers phone number"
                      name="fatherPhoneNumber"
                      required
                      value={formData.fatherPhoneNumber}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="email"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Fathers email address"
                      name="fatherEmailAddress"
                      required
                      value={formData.fatherEmailAddress}
                      onChange={handleChange}
                    />
                  </CCol>
                </CCol>
              </CRow>
            </CContainer>
            <CContainer fluid className="mother-info">
              <div className="display-6 text-center pb-3">Mother details</div>
              <CRow>
                <CCol md={12} className="mothers-column">
                  <CCol>
                    <CFormInput
                      type="text"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Mothers first name"
                      name="motherFirstName"
                      required
                      value={formData.motherFirstName}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="text"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Mothers last name"
                      name="motherLastName"
                      required
                      value={formData.motherLastName}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Mothers phone number"
                      name="motherPhoneNumber"
                      required
                      value={formData.motherPhoneNumber}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="email"
                      feedbackValid="Looks good!"
                      id="validationCustom02"
                      label="Mothers email address"
                      name="motherEmailAddress"
                      required
                      value={formData.motherEmailAddress}
                      onChange={handleChange}
                    />
                  </CCol>
                </CCol>
              </CRow>
            </CContainer>
          </CContainer>

          <CContainer fluid className="Academic details mt-4">
            <div className="display-6 text-center pb-3">Academic details</div>
            <CRow>
              <CCol md={6} className="academin-col1">
                <CCol>
                  <CFormSelect
                    aria-describedby="validationCustom07Feedback"
                    feedbackInvalid="Please select a valid year."
                    id="validationCustom07"
                    label="Select year"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option selected="" disabled="" value="">
                      Choose...
                    </option>
                    <option>2019-20</option>
                    <option>2020-21</option>
                    <option>2021-22</option>
                  </CFormSelect>
                </CCol>

                <CCol className="pt-4">
                  <CRow className="align-items-center">
                    <CCol md={6}>
                      <p>Attendence:</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Total days"
                        required
                        readOnly
                        value="10"
                      />
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Present"
                        required
                        readOnly
                        value="8"
                      />
                    </CCol>
                  </CRow>
                </CCol>
                <CCol className="pt-4">
                  <CRow>
                    <CCol md={6}>
                      <p>Student report:</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        readOnly
                        value="80%"
                      />
                      <CButton color="dark" className="float-end btn-md">
                        Download pdf
                      </CButton>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol className="pt-4">
                  <CRow className="align-items-center">
                    <CCol md={6}>
                      <p>Leave request:</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Total req"
                        required
                        readOnly
                        value="20"
                      />
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="App req"
                        required
                        readOnly
                        value="17"
                      />
                    </CCol>
                  </CRow>
                </CCol>
                <CCol className="pt-4">
                  <CRow className="align-items-center">
                    <CCol md={6}>
                      <p>Fees:</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Total"
                        required
                        readOnly
                        value="10000"
                      />
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Paid"
                        required
                        readOnly
                        value="7000"
                      />
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Pending"
                        required
                        readOnly
                        value="3000"
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CCol>
              <CCol md={6} className="academin-col2">
                <CCol>
                  <CFormSelect
                    aria-describedby="validationCustom07Feedback"
                    feedbackInvalid="Please select a valid term."
                    id="validationCustom07"
                    label="Select term"
                    name="term"
                    required
                    value={formData.term}
                    onChange={handleChange}
                  >
                    <option selected="" disabled="" value="">
                      Choose...
                    </option>
                    <option>1st term</option>
                    <option>2nd term</option>
                    <option>both</option>
                  </CFormSelect>
                </CCol>
                <CCol className="pt-4">
                  <CRow className="align-items-center">
                    <CCol md={6}>
                      <p>Behavious points:</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="+ve points"
                        required
                        readOnly
                        value="20"
                      />
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="-ve points"
                        required
                        readOnly
                        value="17"
                      />
                    </CCol>
                    <CCol md={6} className="mt-4">
                      <p>Homework status:</p>
                    </CCol>
                    <CCol md={6} className="mt-4">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Total"
                        required
                        readOnly
                        value="5"
                      />
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        label="Completed"
                        required
                        readOnly
                        value="3"
                      />
                    </CCol>
                    <CCol md={6} className="mt-4">
                      <p>Notifications:</p>
                    </CCol>
                    <CCol md={6} className="mt-4 d-flex">
                      <CButton
                        color="dark"
                        className="float-end btn-md"
                        onClick={() => {
                          setPopup1(true);
                        }}
                      >
                        Individual
                      </CButton>
                      <CButton
                        color="dark"
                        className="float-end btn-md"
                        onClick={() => {
                          setPopup2(true);
                        }}
                      >
                        General
                      </CButton>
                    </CCol>
                    <CContainer className="d-flex tables mt-3">
                      <CRow>
                        <CCol md={12} className="table1">
                          {Popup1 ? (
                            <table class="table table-bordered">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Date</th>
                                  <th scope="col">Sent by</th>
                                  <th scope="col">Message</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th scope="row">1</th>
                                  <td>20/09/2023</td>
                                  <td>Otto</td>
                                  <td>Hi there</td>
                                </tr>
                                <tr>
                                  <th scope="row">2</th>
                                  <td>20/09/2023</td>
                                  <td>Thornton</td>
                                  <td>Hows it going</td>
                                </tr>
                                <tr>
                                  <th scope="row">3</th>
                                  <td>20/09/2023</td>
                                  <td>Forsen</td>
                                  <td>Detailed message</td>
                                </tr>
                              </tbody>
                            </table>
                          ) : null}
                        </CCol>
                        <CCol md={12} className="table2">
                          {Popup2 ? (
                            <table class="table table-bordered">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Date</th>
                                  <th scope="col">Sent by</th>
                                  <th scope="col">Sent To</th>
                                  <th scope="col">Message</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th scope="row">1</th>
                                  <td>20/09/2023</td>
                                  <td>Otto</td>
                                  <td>Class 2nd</td>
                                  <td>Hi there</td>
                                </tr>
                                <tr>
                                  <th scope="row">2</th>
                                  <td>20/09/2023</td>
                                  <td>Thornton</td>
                                  <td>Class 3rd</td>
                                  <td>Hows it going</td>
                                </tr>
                                <tr>
                                  <th scope="row">3</th>
                                  <td>20/09/2023</td>
                                  <td>Forsen</td>
                                  <td>xyz</td>
                                  <td>Detailed message</td>
                                </tr>
                              </tbody>
                            </table>
                          ) : null}
                        </CCol>
                      </CRow>
                    </CContainer>
                  </CRow>
                </CCol>
              </CCol>
            </CRow>
          </CContainer>

          <div className="buttons text-center">
            <CButton color="primary" type="submit">
              Submit form
            </CButton>

            <CButton color="dark" type="reset" onClick={resetData}>
              Reset form
            </CButton>
          </div>
        </CForm>
      </CContainer>
    </>
  );
}

export default Addstudent;
