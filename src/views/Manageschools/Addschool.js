// import React, { useEffect, useState } from "react";
// import {
//   CButton,
//   CCol,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CFormLabel,
//   CFormSelect,
//   CFormCheck,
//   CFormFeedback,
//   CInputFile,
//   CRow,
// } from "@coreui/react";

// // imports for modal
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
// } from "@coreui/react";

// import axios from "axios";
// import randomstring from "randomstring";

// function Addschool() {
//   const [visible, setVisible] = useState(false);
//   const [approved, setapproved] = useState(false);
//   const [formData, setFormData] = useState({
//     schoolLogo: "",
//     schoolName: "",
//     contactPersonEmail: "",
//     contactPersonName: "",
//     contactPersonContact: "",
//     numberOfStudents: "",
//     addressLine1: "",
//     addressLine2: "",
//     cityState: "",
//     country: "",
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };
//   const generateRandomPassword = (length) => {
//     return randomstring.generate({
//       length: length,
//       charset: "alphanumeric", // You can customize character sets
//     });
//   };

//   const [validated, setValidated] = useState(false);
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       setValidated(true);
//     } else {
//       console.log("form is valid and good to ship");

//       // asking for confirmation here
//       setVisible(true);
//       // if (approved === true) {
//       //   const generatedPassword = generateRandomPassword(8); // Adjust the length as needed
//       //   console.log(generatedPassword);

//       //   const response = await axios.post(
//       //     "http://localhost:3001/api/v1/schools/addnewschool",
//       //     {
//       //       schoolLogo: formData.schoolLogo,
//       //       schoolName: formData.schoolName,
//       //       contactPersonEmail: formData.contactPersonEmail,
//       //       contactPersonName: formData.contactPersonName,
//       //       contactPersonContact: formData.contactPersonContact,
//       //       numberOfStudents: formData.numberOfStudents,
//       //       addressLine1: formData.addressLine1,
//       //       addressLine2: formData.addressLine2,
//       //       cityState: formData.cityState,
//       //       country: formData.country,
//       //       password: generatedPassword,
//       //     }
//       //   );
//       //   setVisible(false);
//       //   console.log(response);
//       //   resetValues();
//       // }
//     }
//   };

//   const handleFormSubmission = async () => {
//     const generatedPassword = generateRandomPassword(8); // Adjust the length as needed
//     console.log(generatedPassword);

//     const response = await axios.post(
//       "http://localhost:3001/api/v1/schools/addnewschool",

//       {
//         schoolLogo: formData.schoolLogo,
//         schoolName: formData.schoolName,
//         contactPersonEmail: formData.contactPersonEmail,
//         contactPersonName: formData.contactPersonName,
//         contactPersonContact: formData.contactPersonContact,
//         numberOfStudents: formData.numberOfStudents,
//         addressLine1: formData.addressLine1,
//         addressLine2: formData.addressLine2,
//         cityState: formData.cityState,
//         country: formData.country,
//         password: generatedPassword,
//       }
//     );

//     setVisible(false);
//     console.log(response);
//     resetValues();
//     setValidated(false);
//   };

//   const resetValues = () => {
//     setFormData({
//       schoolLogo: "",
//       schoolName: "",
//       contactPersonEmail: "",
//       contactPersonName: "",
//       contactPersonContact: "",
//       numberOfStudents: "",
//       addressLine1: "",
//       addressLine2: "",
//       cityState: "",
//       country: "",
//     });
//   };

//   return (
//     <div className="h-100">
//       {/* modal */}
//       <CModal
//         backdrop="static"
//         visible={visible}
//         onClose={() => setVisible(false)}
//         aria-labelledby="StaticBackdropExampleLabel"
//       >
//         <CModalHeader>
//           <CModalTitle id="StaticBackdropExampleLabel">
//             Form submission
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>Are you sure you wish to sumbit this form?</CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setVisible(false)}>
//             Close
//           </CButton>
//           <CButton color="primary" onClick={handleFormSubmission}>
//             Yes!
//           </CButton>
//         </CModalFooter>
//       </CModal>
//       <div className="display-4 text-center pb-2">Add school</div>
//       <div className="display-6 text-center pb-3">school information</div>
//       <div className="vertical-height d-flex justify-content-center">
//         <CForm
//           className="needs-validation h-100 w-50"
//           noValidate
//           validated={validated}
//           onSubmit={handleSubmit}
//         >
//           <CRow className="row1-height">
//             <CCol className="d-flex flex-column align-items-center col1">
//               <CRow>
//                 <CCol md={12} className="pt-2">
//                   <CFormInput
//                     type="text"
//                     className="form-control"
//                     label="School logo"
//                     id="inputGroupFile02"
//                     name="schoolLogo"
//                     value={formData.schoolLogo}
//                     onChange={handleChange}
//                   />

//                   {/* <div class="">
//                     <label for="formFile" class="form-label">
//                       Default file input example
//                     </label>
//                     <input
//                       class="form-control"
//                       type="file"
//                       id="formFile"
//                       name="schoolLogo"
//                       onChange={(e) => {
//                         setFormData({
//                           ...formData,
//                           schoolLogo: e.target.files[0],
//                         });
//                       }}
//                     />
//                   </div> */}
//                 </CCol>

//                 <CCol md={12} className="pt-2">
//                   <CFormInput
//                     type="text"
//                     feedbackValid="Looks good!"
//                     id="validationCustom01"
//                     label="School name"
//                     required
//                     value={formData.schoolName}
//                     onChange={handleChange}
//                     name="schoolName"
//                   />
//                 </CCol>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="text"
//     feedbackValid="Looks good!"
//     id="validationCustom02"
//     placeholder="Addressline 1"
//     label="Address"
//     required
//     value={formData.addressLine1}
//     onChange={handleChange}
//     name="addressLine1"
//   />
// </CCol>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="text"
//     feedbackValid="Looks good!"
//     id="validationCustom02"
//     placeholder="Addressline 2"
//     required
//     value={formData.addressLine2}
//     onChange={handleChange}
//     name="addressLine2"
//   />
// </CCol>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="text"
//     feedbackValid="Looks good!"
//     id="validationCustom02"
//     placeholder="City, State"
//     required
//     value={formData.cityState}
//     onChange={handleChange}
//     name="cityState"
//   />
// </CCol>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="text"
//     feedbackValid="Looks good!"
//     id="validationCustom02"
//     placeholder="Country"
//     required
//     value={formData.country}
//     onChange={handleChange}
//     name="country"
//   />
// </CCol>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="number"
//     feedbackValid="Looks good!"
//     id="validationCustom03"
//     label="No of students"
//     required
//     value={formData.numberOfStudents}
//     onChange={handleChange}
//     name="numberOfStudents"
//   />
// </CCol>
//               </CRow>
//             </CCol>

//             <CCol className="d-flex flex-column align-items-center col2">
//               <CRow>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="text"
//     feedbackValid="Looks good!"
//     id="validationCustom01"
//     label="Contact person name"
//     required
//     value={formData.contactPersonName}
//     onChange={handleChange}
//     name="contactPersonName"
//   />
// </CCol>

// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="number"
//     feedbackValid="Looks good!"
//     id="validationCustom03"
//     label="Contact number"
//     required
//     value={formData.contactPersonContact}
//     onChange={handleChange}
//     name="contactPersonContact"
//   />
// </CCol>
// <CCol md={12} className="pt-2">
//   <CFormInput
//     type="email"
//     feedbackValid="Looks good!"
//     id="validationCustom03"
//     label="Contact person email"
//     required
//     value={formData.contactPersonEmail}
//     onChange={handleChange}
//     name="contactPersonEmail"
//   />
// </CCol>
//               </CRow>
//             </CCol>
//           </CRow>

//           <CRow className="buttons text-center mt-3">
//             <CCol xs={12}>
//               <CButton color="primary" type="submit">
//                 Submit form
//               </CButton>
//             </CCol>
//             <CCol xs={12} className="mt-2">
//               <CButton
//                 color="dark"
//                 type="reset"
//                 onClick={() => {
//                   resetValues();
//                 }}
//               >
//                 Reset form
//               </CButton>
//             </CCol>
//           </CRow>
//         </CForm>
//       </div>
//     </div>
//   );
// }

// export default Addschool;

// new addschool content

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
import randomstring from "randomstring";

import axios from "axios";

function Addstudent() {
  const token = localStorage.getItem("accessToken");
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
  });

  const [Popup1, setPopup1] = useState(false);
  const [Popup2, setPopup2] = useState(false);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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

  const generateRandomPassword = (length) => {
    return randomstring.generate({
      length: length,
      charset: "alphanumeric", // You can customize character sets
    });
  };

  const handleFormSubmission = async () => {
    console.log(formData);
    const generatedPassword = generateRandomPassword(8); // Adjust the length as needed
    console.log(generatedPassword);
    const response = await axios.post(
      "http://localhost:3001/api/v1/schools/addnewschool",

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
        password: generatedPassword,
      },
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
          Add school
        </div>
        <div className="display-6 text-center pb-3">School information</div>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CRow>
            <CCol md={6} className="d-flex flex-column align-items-center col1">
              <CCol className="pt-2">
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

              <CCol className="pt-2">
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
              <CCol className="pt-2">
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
              <CCol className="pt-2">
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
              <CCol className="pt-2">
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
              <CCol className="pt-2">
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
              <CCol className="pt-2">
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
            </CCol>

            <CCol md={6} className="d-flex flex-column align-items-center col2">
              <CCol className="pt-2">
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

              <CCol className="pt-2">
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
              <CCol className="pt-2">
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
            </CCol>
          </CRow>

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
