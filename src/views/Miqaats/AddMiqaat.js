import React, { useState } from "react";
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
  CCardBody,
  CCard,
  CCardTitle,
  CContainer,
  CDateRangePicker,
} from "@coreui/react";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import sa from "date-fns/locale/ar-SA";

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

import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";

const CustomInput = ({ value, onClick, labelName }) => (
  <CFormInput
    type="text"
    id="dateselect"
    placeholder="Miqaat date"
    label={labelName}
    onClick={onClick}
    value={value}
  />
);

function AddMiqaat() {
  registerLocale("sa", sa);

  const token = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    repeat: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [pop1, setpop1] = useState(false);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCheckboxChange = (e) => {
    setShowCustomOptions(e.target.checked);
    handleChange(e);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name == "everyweek") {
      setFormData({
        ...formData,
        repeat: "everyweek",
      });
    } else if (name === "everymonth") {
      setFormData({
        ...formData,
        repeat: "everymonth",
      });
    } else if (name === "everyyear") {
      setFormData({
        ...formData,
        repeat: "everyyear",
      });
    } else {
      setFormData({ ...formData, [name]: value });
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

  const handleFormSubmission = async () => {
    console.log(formData);
    const response = await axios.post(
      "http://localhost:3001/api/v1/miqaat",

      {
        name: formData.name,
        description: formData.description,
        repeat: formData.repeat,
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // making aadatData model instance

    setVisible(false);
    console.log(response);
    resetData();
  };

  const resetData = () => {
    setValidated(false);
    setFormData({
      name: "",
      description: "",
      repeat: "",
      startDate: "",
      endDate: "",
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
          Miqaat
        </div>
        <CContainer fluid>
          <div className="display-6 text-center pb-3 border-bottom">
            Miqaat information
          </div>
          <CForm
            className="row needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CRow>
              <CCol
                md={6}
                className="d-flex flex-column align-items-center col1"
              >
                <CCol className="pt-4">
                  <CFormInput
                    type="text"
                    id="validationCustom01"
                    label="Miqaat name"
                    placeholder="Please enter Miqaat name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol className="pt-4">
                  <CRow>
                    <CCol md={6}>
                      <p>Repeat:</p>
                    </CCol>

                    <CCol md={6}>
                      <CFormCheck
                        id="flexCheckDefault"
                        label="Every Week"
                        name="everyweek"
                        checked={formData.repeat === "everyweek" ? true : false}
                        onChange={handleChange}
                      />

                      <CFormCheck
                        id="flexCheckDefault"
                        label="Every Month"
                        name="everymonth"
                        checked={
                          formData.repeat === "everymonth" ? true : false
                        }
                        onChange={handleCheckboxChange}
                      />

                      <CFormCheck
                        id="flexCheckDefault"
                        label="Every Year"
                        name="everyyear"
                        checked={formData.repeat === "everyyear" ? true : false}
                        onChange={handleChange}
                      />
                    </CCol>
                  </CRow>
                </CCol>

                <CCol className="pt-4">
                  <p>Description:</p>

                  <div class="form-floating">
                    <textarea
                      class="form-control"
                      placeholder="Leave a comment here"
                      id="floatingTextarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                    <label for="floatingTextarea">
                      please enter description here
                    </label>
                  </div>
                </CCol>
              </CCol>

              <CCol
                md={6}
                className="d-flex flex-column align-items-center col2"
              >
                <CCol className="mt-5">
                  <DatePicker
                    locale="sa"
                    label="Start date"
                    name="startDate"
                    dateFormat="dd/MM/yyyy"
                    selected={formData.startDate}
                    popperPlacement="top-end"
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        startDate: date,
                      })
                    }
                    customInput={<CustomInput labelName={"Start date"} />}
                  />
                </CCol>
                <CCol className="">
                  <DatePicker
                    locale="sa"
                    label="End date"
                    dateFormat="dd/MM/yyyy"
                    selected={formData.endDate}
                    popperPlacement="top-end"
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        endDate: date,
                      })
                    }
                    customInput={<CustomInput labelName={"End date"} />}
                  />
                </CCol>
              </CCol>
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
      </CContainer>
    </>
  );
}

export default AddMiqaat;
