import { useLocation } from "react-router-dom";
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
} from "@coreui/react";
import axios from "axios";

function Editschool() {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  const id = location.state.schoolid;

  const [formData, setFormData] = useState({
    schoolLogo: "",
    schoolName: "",
    contactPersonEmail: "",
    contactPersonName: "",
    contactPersonContact: "",
    numberOfStudents: "",
    addressLine1: "",
    addressLine2: "",
    cityState: "",
    country: "",
    password: "",
  });

  const fetchinitdata = async (schoolidd) => {
    const response = await axios.get(
      `http://18.118.42.224:3001/api/v1/schools/get/${schoolidd}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Other headers can be added as needed
        },
      }
    );
    const { data } = response;
    console.log("Data from API:", data);
    setFormData(data.school);
  };

  useEffect(() => {
    fetchinitdata(id);
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [validated, setValidated] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      console.log("form is valid and good to ship");
      const response = await axios.put(
        `http://18.118.42.224:3001/api/v1/schools/update/${id}`,
        {
          schoolLogo: formData.schoolLogo,
          schoolName: formData.schoolName,
          contactPersonEmail: formData.contactPersonEmail,
          contactPersonName: formData.contactPersonName,
          contactPersonContact: formData.contactPersonContact,
          numberOfStudents: formData.numberOfStudents,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          cityState: formData.cityState,
          country: formData.country,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Other headers can be added as needed
          },
        }
      );
      console.log(response);
      setFormData({
        schoolLogo: "",
        schoolName: "",
        contactPersonEmail: "",
        contactPersonName: "",
        contactPersonContact: "",
        numberOfStudents: "",
        addressLine1: "",
        addressLine2: "",
        cityState: "",
        country: "",
        password: "",
      });
    }
  };
  const resetValues = () => {
    setFormData({
      schoolLogo: "",
      schoolName: "",
      contactPersonEmail: "",
      contactPersonName: "",
      contactPersonContact: "",
      numberOfStudents: "",
      addressLine1: "",
      addressLine2: "",
      cityState: "",
      country: "",
      password: "",
    });
  };

  return (
    <div className="h-100">
      <div className="display-3 text-center pb-3">Edit school</div>
      <div className="display-6 text-center pb-3">school information</div>
      <div className="vertical-height d-flex justify-content-center">
        <CForm
          className="needs-validation h-100 w-50"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CRow className="row1-height">
            <CCol md={6} className="d-flex flex-column align-items-center col1">
              <CRow>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    className="form-control"
                    label="School logo"
                    id="inputGroupFile02"
                    name="schoolLogo"
                    value={formData.schoolLogo}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom01"
                    label="School name"
                    required
                    value={formData.schoolName}
                    onChange={handleChange}
                    name="schoolName"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom02"
                    placeholder="Addressline 1"
                    label="Address"
                    required
                    value={formData.addressLine1}
                    onChange={handleChange}
                    name="addressLine1"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom02"
                    placeholder="Addressline 2"
                    required
                    value={formData.addressLine2}
                    onChange={handleChange}
                    name="addressLine2"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom02"
                    placeholder="City, State"
                    required
                    value={formData.cityState}
                    onChange={handleChange}
                    name="cityState"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom02"
                    placeholder="Country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    name="country"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="number"
                    feedbackValid="Looks good!"
                    id="validationCustom03"
                    label="No of students"
                    required
                    value={formData.numberOfStudents}
                    onChange={handleChange}
                    name="numberOfStudents"
                  />
                </CCol>
              </CRow>
            </CCol>

            <CCol md={6} className="d-flex flex-column align-items-center col2">
              <CRow>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom01"
                    label="Contact person name"
                    required
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    name="contactPersonName"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="number"
                    feedbackValid="Looks good!"
                    id="validationCustom03"
                    label="Contact number"
                    required
                    value={formData.contactPersonContact}
                    onChange={handleChange}
                    name="contactPersonContact"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="email"
                    feedbackValid="Looks good!"
                    id="validationCustom03"
                    label="Contact person email"
                    required
                    value={formData.contactPersonEmail}
                    onChange={handleChange}
                    name="contactPersonEmail"
                  />
                </CCol>
                <CCol md={12} className="pt-2">
                  <CFormInput
                    type="text"
                    id="cust"
                    label="Edit password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                  />
                </CCol>
              </CRow>
            </CCol>
          </CRow>

          <div className="buttons text-center mt-3">
            <CCol xs={12}>
              <CButton color="primary" type="submit">
                Submit form
              </CButton>
            </CCol>
            <CCol xs={12} className="mt-2">
              <CButton
                color="dark"
                type="reset"
                onClick={() => {
                  resetValues();
                }}
              >
                Reset form
              </CButton>
            </CCol>
          </div>
        </CForm>
      </div>
    </div>
  );
}

export default Editschool;
