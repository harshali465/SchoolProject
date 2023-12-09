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
  CDateRangePicker,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked } from "@coreui/icons";
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
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";

function Editteacher() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const studentid = location.state.studentid;

  const getUser = async () => {
    try {
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

      const response = await axios.get(
        `http://18.118.42.224:3001/api/v1/users/${studentid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data.data);
      const editStudent = response.data.data;

      if (editStudent) {
        setFormData({
          profilePic: "",
          firstName: editStudent.firstName,
          lastName: editStudent.lastName,
          teacherPassword: "",
          confirmTeacherPassword: "",
          phoneNumber: editStudent.itsNo,
          email: editStudent.email,
          teachertype: editStudent.teachertype,
          section: editStudent.section,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const [formData, setFormData] = useState({
    profilePic: "",
    firstName: "",
    lastName: "",
    teacherPassword: "",
    confirmTeacherPassword: "",
    phoneNumber: "",
    email: "",
    teachertype: "",
    section: "",
    division: "",
  });

  const [Popup1, setPopup1] = useState(true);
  const [Popup2, setPopup2] = useState(false);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // if (name === "teachertype" && value === "Class T") {
    //   setPopup1(false);
    // }
    // if (name === "teachertype" && value === "Assist T") {
    //   setPopup1(true);
    // }
    // if (name === "teachertype" && value === "Subject T") {
    //   setPopup1(true);
    // }
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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (date) => {
    setStartDate(date[0]);
    setEndDate(date[1]);
    // You can perform any logic with the selected date range here
  };

  const handleFormSubmission = async () => {
    console.log(formData);
    const response = await axios.patch(
      `http://18.118.42.224:3001/api/v1/users/${studentid}`,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        itsNo: formData.phoneNumber,
        email: formData.email,
        photo: formData.profilePic,
        gender: "male",
        role: "teacher",
        class: "CT 3rd grade",
        password: formData.teacherPassword,
        teachertype: formData.teachertype,
        section: formData.section,
        behaviousPoints: {
          positivePoints: "500",
          negativePoints: "200",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
      teacherPassword: "",
      confirmTeacherPassword: "",
      phoneNumber: "",
      email: "",
      teachertype: "",
      section: "",
    });
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
          Edit teacher
        </div>
        <div className="display-6 text-center pb-3">Teacher information</div>
        <CForm
          className="row needs-validation"
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
                  value={formData.profilePic}
                  onChange={handleChange}
                />
              </CCol>

              <CCol>
                <CFormLabel htmlFor="validationCustomPassword">
                  Password
                </CFormLabel>
                <CInputGroup className="has-validation">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    aria-describedby="inputGroupPrependFeedback"
                    id="validationCustomPassword"
                    name="teacherPassword"
                    required
                    value={formData.teacherPassword}
                    onChange={handleChange}
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CFormLabel htmlFor="validationCustomConfirmPassword">
                  Confirm Password
                </CFormLabel>
                <CInputGroup className="has-validation">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    aria-describedby="inputGroupPrependFeedback"
                    id="validationCustomConfirmPassword"
                    name="confirmTeacherPassword"
                    required
                    value={formData.confirmTeacherPassword}
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
                  label="Teacher type"
                  name="teachertype"
                  required
                  value={formData.teachertype}
                  onChange={handleChange}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  <option>Class T</option>
                  <option>Assist T</option>
                  <option>Subject T</option>
                </CFormSelect>

                {/* <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select a valid Division."
                  id="validationCustom04"
                  label="Division"
                  name="division"
                  required
                  value={formData.division}
                  onChange={handleChange}
                  disabled={Popup1}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  <option>div A</option>
                  <option>div B</option>
                  <option>div C</option>
                </CFormSelect> */}
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
                <CFormInput
                  type="email"
                  feedbackValid="Looks good!"
                  id="validationCustom02"
                  label="Email address"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </CCol>

              <CCol>
                <CFormSelect
                  aria-describedby="validationCustom07Feedback"
                  feedbackInvalid="Please select a valid Mentor."
                  id="validationCustom07"
                  label="Section"
                  name="section"
                  required
                  value={formData.section}
                  onChange={handleChange}
                >
                  <option selected="" disabled="" value="">
                    Choose...
                  </option>
                  <option>Pre primary</option>
                  <option>Primary</option>
                  <option>Secondary</option>
                </CFormSelect>
              </CCol>
            </CCol>

            <CContainer fluid className="Academic details mt-4">
              <CRow>
                <CCol md={6} className="academin-col1">
                  <CCol className="mt-4">
                    <p>Mentorship status:</p>

                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Teacher Attendence:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Extra classes taken:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Notifications sent:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CRow>
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
                  </CRow>
                </CCol>

                <CCol md={6} className="academin-col2">
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p>Time table:</p>
                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Time</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                          <th scope="col">Subject</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>10am</td>
                          <td>4th grade</td>
                          <td>div A</td>
                          <td>English</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>10am</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                          <td>sub2</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>10am</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                          <td>Forsen</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Proxy classes:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Leave requests:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Homework posted:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                  <CCol className="mt-4">
                    <div className="d-flex">
                      <p className="p-2">Meeting tasks assigned:</p>

                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        selectsRange
                      />
                    </div>

                    <table class="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Class</th>
                          <th scope="col">Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Otto</td>
                          <td>4th grade</td>
                          <td>div A</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Thornton</td>
                          <td>3rd grade</td>
                          <td>Div B</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Forsen</td>
                          <td>2nd grade</td>
                          <td>div C</td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                </CCol>
              </CRow>
            </CContainer>
          </CRow>

          <div className="buttons text-center pt-3">
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

export default Editteacher;
