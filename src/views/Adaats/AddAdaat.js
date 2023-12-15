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
    responseType: [],
    customField: [
      {
        fieldTitle: "",
        fieldType: "",
        options: ["", ""],
      },
    ],
    isSurat: "",
    isRemark: "",
    isImageUpload: "",
    applicableTo: "",
    isCompulsory: "",
    startDate: new Date(),
    endDate: "",
    class: "",
    repetation: "",
    isImageUpload: "",
    repeatDays: [],
    responsetypeCustomField: [
      {
        cusresTitle: "",
        cusresType: "",
        cusresValue: [""],
      },
    ],
    repeatDays: [],
    repeatMonths: [],
    repeatDateForMonth: new Date(),
    repeatDateForYear: new Date(),
    customDate: new Date(),
  });

  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [pop1, setpop1] = useState(false);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [repeatPop1, setrepeatPop1] = useState(false);

  const handleCheckboxChange = (e) => {
    setShowCustomOptions(e.target.checked);
    handleChange(e);
  };
  const handleimage = (e) => {
    setpop1(e.target.checked);
    handleChange(e);
  };

  const handleChange2 = (event) => {
    const { name, value } = event.target;
    if (name === "male") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        applicableTo: "male",
      }));
    } else if (name === "female") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        applicableTo: "female",
      }));
    } else if (name === "both") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        applicableTo: "both",
      }));
    } else if (name === "isCompulsoryYes") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        isCompulsory: true,
      }));
    } else if (name === "isCompulsoryNo") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        isCompulsory: false,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, checked, value } = event.target;

    if (checked) {
      if (name === "custom") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          responseType: [...prevFormData.responseType, name],
        }));
        setShowCustomOptions(true); // Show additional options when "custom" is checked
      } else if (name === "image") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          responseType: [...prevFormData.responseType, name],
        }));
        setpop1(true); // Show image options when "image" is checked
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          responseType: [...prevFormData.responseType, name],
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        responseType: prevFormData.responseType.filter((type) => type !== name),
      }));

      if (name === "custom") {
        setShowCustomOptions(false); // Hide additional options when "custom" is unchecked
      } else if (name === "image") {
        setpop1(false); // Hide image options when "image" is unchecked
      }
    }
    if (
      name !== "custom" &&
      name !== "image" &&
      name !== "yesno" &&
      name !== "remarkbox" // Add more conditions for other responseType fields if needed
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
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

  // useEffect(() => {
  //   if (showCustomOptions === false) {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       responsetypeCustomField: [],
  //     }));
  //   }
  // }, [showCustomOptions]);

  const handleFormSubmission = async () => {
    console.log(formData);
    const response = await axios.post(
      "http://18.118.42.224:3001/api/v1/aadat",

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
        responsetypeCustomField: formData.responsetypeCustomField,
        repeatDays: formData.repeatDays,
        repeatMonths: formData.repeatMonths,
        repeatDateForMonth: formData.repeatDateForMonth,
        repeatDateForYear: formData.repeatDateForYear,
        customDate: formData.customDate,
        isSurat: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // retrieving all the students to make a new aadatData instance
    const res = await axios.get("http://18.118.42.224:3001/api/v1/users", {
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
      responseType: [],
      customField: [
        {
          fieldTitle: "",
          fieldType: "",
          options: ["", ""],
        },
      ],
      isSurat: "",
      isRemark: "",
      isImageUpload: "",
      applicableTo: "",
      isCompulsory: "",
      startDate: new Date(),
      endDate: "",
      class: "",
      repetation: "",
      isImageUpload: "",
      repeatDays: [],
      responsetypeCustomField: [
        {
          cusresTitle: "",
          cusresType: "",
          cusresValue: [""],
        },
      ],
      repeatDays: [],
      repeatMonths: [],
      repeatDateForMonth: new Date(),
      repeatDateForYear: new Date(),
      customDate: new Date(),
    });
  };

  //   getting categories
  const [getCats, setgetCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      try {
        const response = await axios.get(
          "http://18.118.42.224:3001/api/v1/categories",
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
          options: ["", ""],
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
    const updatedCustomField = [...formData.customField];

    // Check if options array exists, if not, initialize it
    if (!updatedCustomField[index].options) {
      updatedCustomField[index].options = [];
    }

    updatedCustomField[index].options.push(""); // Push an empty string for a new option

    setFormData({
      ...formData,
      customField: updatedCustomField,
    });
  };
  const addMoreOptionsRes = () => {
    const updatedCustomField = [...formData.responsetypeCustomField];

    // Check if options array exists, if not, initialize it
    if (!updatedCustomField[0].cusresValue) {
      updatedCustomField[0].cusresValue = [];
    }

    updatedCustomField[0].cusresValue.push(""); // Push an empty string for a new option

    setFormData({
      ...formData,
      responsetypeCustomField: updatedCustomField,
    });
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedCustomField = [...formData.customField];

    updatedCustomField[fieldIndex].options[optionIndex] = value;

    setFormData({
      ...formData,
      customField: updatedCustomField,
    });
  };

  // repetation days
  const handleRepChange = (e) => {
    const { name, checked } = e.target;
    let updatedRepeatDays = [...formData.repeatDays]; // Create a copy of repeatDays array

    if (checked) {
      // If checkbox is checked, add the day to the array
      updatedRepeatDays = [...updatedRepeatDays, name];
    } else {
      // If checkbox is unchecked, remove the day from the array
      updatedRepeatDays = updatedRepeatDays.filter((day) => day !== name);
    }

    // Update the state with the new array of selected days
    setFormData({
      ...formData,
      repeatDays: updatedRepeatDays,
    });
  };

  // repeat months
  const handleRepmonthChange = (e) => {
    const { name, checked } = e.target;
    let updatedRepeatDays = [...formData.repeatMonths]; // Create a copy of repeatDays array

    if (checked) {
      // If checkbox is checked, add the day to the array
      updatedRepeatDays = [...updatedRepeatDays, name];
    } else {
      // If checkbox is unchecked, remove the day from the array
      updatedRepeatDays = updatedRepeatDays.filter((day) => day !== name);
    }

    // Update the state with the new array of selected days
    setFormData({
      ...formData,
      repeatMonths: updatedRepeatDays,
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
                        id="flexCheckDefaultYesNo"
                        label="yes/no tab"
                        name="yesno"
                        checked={formData.responseType.includes("yesno")}
                        onChange={handleChange}
                      />

                      <CFormCheck
                        id="flexCheckDefaultCustom"
                        label="custom"
                        name="custom"
                        checked={formData.responseType.includes("custom")}
                        onChange={handleChange}
                      />
                      {showCustomOptions &&
                        formData.responsetypeCustomField.map((field, index) => (
                          <div className=" card p-2 mt-2">
                            <CFormInput
                              type="text"
                              id="labelName"
                              placeholder="Please enter name"
                              onChange={(e) => {
                                setFormData((prevFormData) => ({
                                  ...prevFormData,
                                  responsetypeCustomField: [
                                    {
                                      ...prevFormData.responsetypeCustomField[
                                        index
                                      ],
                                      cusresTitle: e.target.value,
                                    },
                                  ],
                                }));
                              }}
                            />
                            <div className="d-flex flex-column p-2">
                              <CFormCheck
                                type="radio"
                                name="exampleRadios"
                                id="exampleRadios21"
                                value="male"
                                label="for boys"
                                checked={
                                  formData.responsetypeCustomField[index]
                                    .cusresType === "male"
                                }
                                onChange={(e) => {
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    responsetypeCustomField: [
                                      {
                                        ...prevFormData.responsetypeCustomField[
                                          index
                                        ],
                                        cusresType: e.target.value,
                                      },
                                    ],
                                  }));
                                }}
                              />
                              <CFormCheck
                                type="radio"
                                name="exampleRadios"
                                id="exampleRadios22"
                                value="female"
                                label="for girls"
                                checked={
                                  formData.responsetypeCustomField[index]
                                    .cusresType === "female"
                                }
                                onChange={(e) => {
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    responsetypeCustomField: [
                                      {
                                        ...prevFormData.responsetypeCustomField[
                                          index
                                        ],
                                        cusresType: e.target.value,
                                      },
                                    ],
                                  }));
                                }}
                              />
                              <CFormCheck
                                type="radio"
                                name="exampleRadios"
                                id="exampleRadios23"
                                value="both"
                                label="for both"
                                checked={
                                  formData.responsetypeCustomField[index]
                                    .cusresType === "both"
                                }
                                onChange={(e) => {
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    responsetypeCustomField: [
                                      {
                                        ...prevFormData.responsetypeCustomField[
                                          index
                                        ],
                                        cusresType: e.target.value,
                                      },
                                    ],
                                  }));
                                }}
                              />

                              {formData.responsetypeCustomField[
                                index
                              ].cusresValue.map((option, optionIndex) => (
                                <div className="pt-3" key={optionIndex}>
                                  <CFormInput
                                    type="text"
                                    placeholder={`value ${optionIndex + 1}`}
                                    value={option}
                                    onChange={(e) => {
                                      const updatedresponsetypeCustomField = [
                                        ...formData.responsetypeCustomField,
                                      ];

                                      updatedresponsetypeCustomField[
                                        index
                                      ].cusresValue[optionIndex] =
                                        e.target.value;

                                      setFormData({
                                        ...formData,
                                        responsetypeCustomField:
                                          updatedresponsetypeCustomField,
                                      });
                                    }}
                                  />
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-sm btn-primary float-right"
                                onClick={() => addMoreOptionsRes()}
                              >
                                add more
                              </button>
                            </div>
                          </div>
                        ))}

                      <CFormCheck
                        id="flexCheckDefaultRemarkBox"
                        label="remark box"
                        name="remarkbox"
                        checked={formData.responseType.includes("remarkbox")}
                        onChange={handleChange}
                      />

                      <CFormCheck
                        id="flexCheckDefaultImage"
                        label="image"
                        name="image"
                        checked={formData.responseType.includes("image")}
                        onChange={handleChange}
                        className="mb-2"
                      />

                      {pop1 && (
                        <div className="card">
                          <CFormSelect
                            aria-describedby="yo"
                            feedbackInvalid="Please select number."
                            id="imageNo"
                            name="imageNo"
                            onChange={(event) => {
                              const selectedValue = event.target.value;
                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                isImageUpload: selectedValue,
                              }));
                            }}
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
                        onChange={handleChange2}
                      />
                      <CFormCheck
                        id="flexCheckDefault"
                        label="girls only"
                        name="female"
                        checked={
                          formData.applicableTo === "female" ? true : false
                        }
                        onChange={handleChange2}
                      />
                      <CFormCheck
                        id="flexCheckDefault"
                        label="boys and girls"
                        name="both"
                        checked={
                          formData.applicableTo === "both" ? true : false
                        }
                        onChange={handleChange2}
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
                        onChange={handleChange2}
                      />
                      <CFormCheck
                        id="flexCheckDefault"
                        label="no"
                        name="isCompulsoryNo"
                        checked={formData.isCompulsory === false ? true : false}
                        onChange={handleChange2}
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
                            {/* <CFormInput
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
                            /> */}
                            {field.options.map((option, optionIndex) => (
                              <div className="pt-3" key={optionIndex}>
                                <CFormInput
                                  type="text"
                                  placeholder={`value ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          {/* <div className="pt-3">
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
                          </div> */}

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeCustomField(index)}
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary float-right"
                            onClick={() => addMoreOptions(index)}
                          >
                            add more
                          </button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <button
                          type="button"
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
                    disabled={
                      formData.repetation && formData.repetation === "custom"
                    }
                    customInput={<CustomInput labelName={"End date"} />}
                  />
                </CCol>

                <CCol className="pt-4">
                  <CFormSelect
                    aria-describedby="validationCustom07Feedback"
                    feedbackInvalid="Please select a valid Mentor."
                    id="validationCustom07"
                    label="repetition"
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
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Anually</option>

                    <option value="custom">Custom</option>
                  </CFormSelect>
                </CCol>

                {formData.repetation === "monthly" && (
                  <CCol className="pt-4">
                    <DatePicker
                      locale="sa"
                      label="Repeat day for the month/months"
                      dateFormat="dd"
                      selected={formData.repeatDateForMonth}
                      popperPlacement="top-end"
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          repeatDateForMonth: date,
                        })
                      }
                      customInput={
                        <CustomInput
                          labelName={"Repeat date for the month/months"}
                        />
                      }
                    />
                  </CCol>
                )}
                {formData.repetation === "yearly" && (
                  <CCol className="pt-4">
                    <DatePicker
                      locale="sa"
                      label="Repeat date for the years"
                      dateFormat="dd/MM"
                      selected={formData.repeatDateForYear}
                      popperPlacement="top-end"
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          repeatDateForYear: date,
                        })
                      }
                      customInput={
                        <CustomInput labelName={"Repeat date for the years"} />
                      }
                    />
                  </CCol>
                )}

                {formData.repetation === "custom" && (
                  <CCol className="pt-4">
                    <DatePicker
                      locale="sa"
                      label="Custom Date!"
                      dateFormat="dd/MM/yyyy"
                      selected={formData.customDate}
                      popperPlacement="top-end"
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          customDate: date,
                        })
                      }
                      customInput={
                        <CustomInput labelName={"Customized Date!"} />
                      }
                    />
                  </CCol>
                )}

                <CCol className="pt-4">
                  <CCol md={6}>
                    <p>Repeat days:</p>
                  </CCol>

                  <CCol md={6}>
                    <CFormCheck
                      id="flexCheckDefaultSun"
                      label="Sunday"
                      name="sunday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("sunday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                    <CFormCheck
                      id="flexCheckDefaultMon"
                      label="Monday"
                      name="monday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("monday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                    <CFormCheck
                      id="flexCheckDefaultTue"
                      label="Tuesday"
                      name="tuesday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("tuesday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                    <CFormCheck
                      id="flexCheckDefaultSWed"
                      label="Wednesday"
                      name="wednesday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("wednesday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                    <CFormCheck
                      id="flexCheckDefaultThu"
                      label="Thursday"
                      name="thursday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("thursday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                    <CFormCheck
                      id="flexCheckDefaultFri"
                      label="Friday"
                      name="friday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("friday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                    <CFormCheck
                      id="flexCheckDefaultSat"
                      label="Saturday"
                      name="saturday"
                      onChange={handleRepChange}
                      checked={formData.repeatDays.includes("saturday")}
                      disabled={
                        formData.repetation &&
                        (formData.repetation === "daily" ||
                          formData.repetation === "monthly" ||
                          formData.repetation === "yearly" ||
                          formData.repetation === "custom")
                          ? true
                          : false
                      }
                    />
                  </CCol>
                </CCol>
                <CCol className="pt-4">
                  <CCol md={6}>
                    <p>Repeat months:</p>
                  </CCol>

                  <CCol md={6}>
                    <CRow>
                      <CCol md={6}>
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="January"
                          name="january"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("january")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="February"
                          name="february"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("february")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="March"
                          name="march"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("march")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="April"
                          name="april"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("april")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="May"
                          name="may"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("may")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="June"
                          name="june"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("june")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="July"
                          name="july"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("july")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="August"
                          name="august"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("august")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="September"
                          name="september"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("september")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="October"
                          name="october"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("october")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="November"
                          name="november"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("november")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                        <CFormCheck
                          id="flexCheckDefaultSun"
                          label="December"
                          name="december"
                          onChange={handleRepmonthChange}
                          checked={formData.repeatMonths.includes("december")}
                          disabled={
                            formData.repetation &&
                            formData.repetation === "custom"
                          }
                        />
                      </CCol>
                    </CRow>
                  </CCol>
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
