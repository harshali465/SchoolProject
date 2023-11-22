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
    placeholder="Adaat date"
    label={labelName}
    onClick={onClick}
    value={value}
  />
);

function AddAdaat() {
  registerLocale("sa", sa);

  const token = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    responseType: "",
    customField: [
      {
        fieldTitle: "",
        fieldType: "",
        options: [],
      },
    ],
    isSurat: "",
    isRemark: "",
    isImageUpload: "",
    applicableTo: "",
    isCompulsory: "",
    startDate: new Date(),
    endDate: new Date(),
    class: "",
    repetation: "",
    repeatDays: [],
  });

  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [pop1, setpop1] = useState(false);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCheckboxChange = (e) => {
    setShowCustomOptions(e.target.checked);
    handleChange(e);
  };
  const handleimage = (e) => {
    setpop1(e.target.checked);
    handleChange(e);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name == "yesno") {
      setFormData({
        ...formData,
        responseType: "yesno",
      });
    } else if (name === "custom") {
      setFormData({
        ...formData,
        responseType: "custom",
      });
    } else if (name === "remarkbox") {
      setFormData({
        ...formData,
        responseType: "remarkbox",
      });
    } else if (name === "image") {
      setFormData({
        ...formData,
        responseType: "image",
      });
    } else if (name === "male") {
      setFormData({
        ...formData,
        applicableTo: "male",
      });
    } else if (name === "female") {
      setFormData({
        ...formData,
        applicableTo: "female",
      });
    } else if (name === "both") {
      setFormData({
        ...formData,
        applicableTo: "both",
      });
    } else if (name === "isCompulsoryYes") {
      setFormData({
        ...formData,
        isCompulsory: true,
      });
    } else if (name === "isCompulsoryNo") {
      setFormData({
        ...formData,
        isCompulsory: false,
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
      "http://localhost:3001/api/v1/aadat",

      {
        name: formData.name,
        category: formData.category,
        responseType: formData.responseType,
        customField: formData.customField,
        isSurat: formData.isSurat,
        isRemark: formData.isRemark,
        isImageUpload: formData.isImageUpload,
        applicableTo: formData.applicableTo,
        isCompulsory: formData.isCompulsory,
        startDate: formData.startDate,
        endDate: formData.endDate,
        repetation: formData.repetation,
        repeatDays: formData.repeatDays,
        class: formData.class,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // retrieving all the students to make a new aadatData instance
    const res = await axios.get("http://localhost:3001/api/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        role: "student",
        class: formData.class,
      },
    });

    // making aadatData model instance

    setVisible(false);
    console.log(response);
    resetData();
  };

  const resetData = () => {
    setValidated(false);
    setFormData({
      name: "",
      category: "",
      responseType: "",
      customField: [],
      isSurat: "",
      isRemark: "",
      isImageUpload: "",
      applicableTo: "",
      isCompulsory: "",
      startDate: "",
      endDate: "",
      repetation: "",
      repeatDays: [],
    });
  };

  //   getting categories
  const [getCats, setgetCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.data.docs);
        setgetCats(response.data.data.docs);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getCats();
  }, []);

  const [fieldType, setFieldType] = useState("dropdown");

  // adding more data
  const renderCustomField = () => {
    switch (fieldType) {
      case "dropdown":
        return (
          <div className="pt-2">
            <CCardTitle className="text-center">Custom field</CCardTitle>
            <CFormInput
              type="text"
              id="labelName"
              label="Label name"
              placeholder="Please enter name"
            />
            <div className="pt-3">
              <CFormSelect
                id="validationCustom07"
                label="Field Name"
                name="fieldName"
              >
                <option selected="" disabled="" value="">
                  Choose...
                </option>
                <option>Dropdown</option>
                <option>Checkbox</option>
              </CFormSelect>
              <div className="pt-3">
                <CFormInput
                  type="text"
                  id="labelNameee"
                  placeholder="value 1"
                />
              </div>
              <div className="pt-3">
                <CFormInput type="text" id="labelNamee" placeholder="value 2" />
              </div>
            </div>
          </div>
        );
      // Add more cases for other field types
      default:
        return null;
    }
  };

  const addCustomField = () => {
    setFormData({
      ...formData,
      customField: [
        ...formData.customField,
        {
          fieldTitle: "",
          fieldType: "",
          options: [],
        },
      ],
    });
  };

  const handleCustomFieldChange = (index, fieldKey, value) => {
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };
      const updatedCustomField = [...updatedFormData.customField];

      // Update the specific field based on the index
      const updatedField = { ...updatedCustomField[index] };

      if (fieldKey === "labelName") {
        updatedField.fieldTitle = value;
      } else if (fieldKey === "fieldName") {
        updatedField.fieldType = value;
      } else if (fieldKey.startsWith("option")) {
        // Handling options
        const optionIndex = parseInt(fieldKey.replace("option", ""), 10) - 1;

        // Ensure options array exists before assigning values
        if (!updatedField.options) {
          updatedField.options = [];
        }

        updatedField.options[optionIndex] = value;
      }

      updatedCustomField[index] = updatedField;
      updatedFormData.customField = updatedCustomField;

      return updatedFormData;
    });
  };

  // Function to remove a custom field by index
  const removeCustomField = (indexToRemove) => {
    const updatedCustomFields = formData.customField.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, customField: updatedCustomFields });
  };

  const addMoreOptions = (index) => {
    const updatedFormData = { ...formData };
    updatedFormData.customField[index].options.push("");
    setFormData(updatedFormData);
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
        <div className="display-5 text-center pb-3 font-weight-bold">Adaat</div>
        <CContainer fluid>
          <div className="display-6 text-center pb-3 border-bottom">
            Adaat information
          </div>
          <CForm
            className="row needs-validation"
            // style={{
            //   maxWidth: "100%",
            //   margin: "0px",
            //   maxHeight: "100%",
            //   padding: "0px",
            // }}
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
                  <CFormSelect
                    aria-describedby="validationCustom07Feedback"
                    feedbackInvalid="Please select a valid Mentor."
                    id="validationCustom07"
                    label="Categories"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option selected="" disabled="" value="">
                      Choose...
                    </option>
                    {getCats.map((cat) => {
                      return <option value={cat._id}>{cat.name}</option>;
                    })}
                  </CFormSelect>
                </CCol>

                <CCol className="pt-4">
                  <CFormInput
                    type="text"
                    feedbackValid="Looks good!"
                    id="validationCustom01"
                    label="Adaat name"
                    placeholder="Please enter adaat name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol className="pt-4">
                  <CRow>
                    <CCol md={6}>
                      <p>Response type:</p>
                    </CCol>

                    <CCol md={6}>
                      <CFormCheck
                        id="flexCheckDefault"
                        label="yes/no tab"
                        name="yesno"
                        checked={
                          formData.responseType === "yesno" ? true : false
                        }
                        onChange={handleChange}
                      />

                      <CFormCheck
                        id="flexCheckDefault"
                        label="custom"
                        name="custom"
                        checked={
                          showCustomOptions &&
                          formData.responseType === "custom"
                            ? true
                            : false
                        }
                        onChange={handleCheckboxChange}
                      />
                      {showCustomOptions && (
                        <div className=" card p-2 mt-2">
                          <CFormInput
                            type="text"
                            id="labelName"
                            placeholder="Please enter name"
                          />
                          <div className="d-flex flex-column p-2">
                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="option2"
                              label="for boys"
                            />
                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="option2"
                              label="for girls"
                            />
                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="option2"
                              label="for both"
                            />
                          </div>
                        </div>
                      )}
                      <CFormCheck
                        id="flexCheckDefault"
                        label="remark box"
                        name="remarkbox"
                        checked={
                          formData.responseType === "remarkbox" ? true : false
                        }
                        onChange={handleChange}
                      />

                      <CFormCheck
                        id="flexCheckDefault"
                        label="image"
                        name="image"
                        checked={
                          pop1 && formData.responseType === "image"
                            ? true
                            : false
                        }
                        onChange={handleimage}
                        className="mb-2"
                      />

                      {pop1 && (
                        <div className="card">
                          <CFormSelect
                            aria-describedby="yo"
                            feedbackInvalid="Please select number."
                            id="imageNo"
                            name="imageNo"
                          >
                            <option selected="" disabled="" value="">
                              Please select number
                            </option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                          </CFormSelect>
                        </div>
                      )}
                    </CCol>
                  </CRow>
                </CCol>
                <CCol className="pt-4">
                  <CRow>
                    <CCol md={6}>
                      <p>Applicable for:</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormCheck
                        id="flexCheckDefault"
                        label="boys only"
                        name="male"
                        checked={
                          formData.applicableTo === "male" ? true : false
                        }
                        onChange={handleChange}
                      />
                      <CFormCheck
                        id="flexCheckDefault"
                        label="girls only"
                        name="female"
                        checked={
                          formData.applicableTo === "female" ? true : false
                        }
                        onChange={handleChange}
                      />
                      <CFormCheck
                        id="flexCheckDefault"
                        label="boys and girls"
                        name="both"
                        checked={
                          formData.applicableTo === "both" ? true : false
                        }
                        onChange={handleChange}
                      />
                    </CCol>
                  </CRow>
                </CCol>

                <CCol className="pt-4">
                  <CFormSelect
                    aria-describedby="validationCustom07Feedback"
                    feedbackInvalid="Please select a valid Mentor."
                    id="validationCustom07"
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
                <CCol className="pt-4">
                  <CRow>
                    <CCol md={6}>
                      <p>Compulsary?</p>
                    </CCol>
                    <CCol md={6}>
                      <CFormCheck
                        id="flexCheckDefault"
                        label="yes"
                        name="isCompulsoryYes"
                        checked={formData.isCompulsory === true ? true : false}
                        onChange={handleChange}
                      />
                      <CFormCheck
                        id="flexCheckDefault"
                        label="no"
                        name="isCompulsoryNo"
                        checked={formData.isCompulsory === false ? true : false}
                        onChange={handleChange}
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CCol>

              <CCol
                md={6}
                className="d-flex flex-column align-items-center col2"
              >
                <CCol className="pt-4">
                  <CCard>
                    <CCardBody>
                      {/* <CCardTitle className="text-center">
                        Custom field
                      </CCardTitle>
                      <CFormInput
                        type="text"
                        id="labelName"
                        label="Label name"
                        placeholder="Please enter name"
                      />
                      <div className="pt-3">
                        <CFormSelect
                          id="validationCustom07"
                          label="Field Name"
                          name="fieldName"
                          onChange={(e) => {}}
                        >
                          <option selected="" disabled="" value="">
                            Choose...
                          </option>
                          <option>Dropdown</option>
                          <option>Checkbox</option>
                        </CFormSelect>
                        <div className="pt-3">
                          <CFormInput
                            type="text"
                            id="labelNameee"
                            placeholder="value 1"
                          />
                        </div>
                        <div className="pt-3">
                          <CFormInput
                            type="text"
                            id="labelNamee"
                            placeholder="value 2"
                          />
                        </div> */}
                      {formData.customField.map((field, index) => (
                        <div key={index} className="pt-3">
                          <CCardTitle className="text-center">
                            Custom field
                          </CCardTitle>
                          <CFormInput
                            type="text"
                            id="labelName"
                            label="Label name"
                            placeholder="Please enter name"
                            value={field.fieldTitle}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                index,
                                "labelName",
                                e.target.value
                              )
                            }
                          />
                          <CFormSelect
                            id="validationCustom07"
                            label="Field Name"
                            name="fieldName"
                            value={field.fieldType}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                index,
                                "fieldName",
                                e.target.value
                              )
                            }
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option>dropdown</option>
                            <option>checkbox</option>
                          </CFormSelect>
                          <div className="pt-3">
                            <CFormInput
                              type="text"
                              id="value1option"
                              placeholder="value 1"
                              onChange={(e) =>
                                handleCustomFieldChange(
                                  index,
                                  "option1",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="pt-3">
                            <CFormInput
                              type="text"
                              id="value2option"
                              placeholder="value 2"
                              onChange={(e) =>
                                handleCustomFieldChange(
                                  index,
                                  "option2",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeCustomField(index)}
                          >
                            Remove
                          </button>
                          <button
                            className="btn btn-sm btn-primary float-right"
                            onClick={addMoreOptions}
                          >
                            add more
                          </button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <button
                          className="btn btn-sm btn-dark float-right"
                          onClick={addCustomField}
                        >
                          +
                        </button>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol className="">
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

                <CCol className="pt-4">
                  <CFormSelect
                    aria-describedby="validationCustom07Feedback"
                    feedbackInvalid="Please select a valid Mentor."
                    id="validationCustom07"
                    label="repetation"
                    name="repetation"
                    required
                    value={formData.repetation}
                    onChange={handleChange}
                  >
                    <option selected="" disabled="" value="">
                      Choose...
                    </option>
                    <option value="norepeat">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly on Thursday</option>
                    <option value="monthly">Monthly on fourth Thursday</option>
                    <option value="yearly">Anually on June 22</option>
                    <option value="everyweekday">Every weekday</option>
                    <option>Custom</option>
                  </CFormSelect>
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

export default AddAdaat;
