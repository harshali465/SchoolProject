import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // accepting data from the inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (validationErrors.length === 0) {
      // ready to be shipped

      try {
        const res = await axios.post(
          "http://localhost:3001/api/v1/users/signup",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
          }
        );
        const token = res.data.token;
        localStorage.setItem("accessToken", token);
        console.log("sucessfully registered");
        navigate("/");
      } catch (error) {
        console.error("signup failed", error);
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      setErrors([]);
    } else {
      // Data is not valid, set the validation errors
      setErrors(validationErrors);
    }
  };

  // validating credentials
  const validateForm = (data) => {
    const errors = [];

    if (!data.name.trim()) {
      errors[0] = "Name is required";
    }

    if (!data.email.trim()) {
      errors[1] = "Email is required";
    } else if (!isValidEmail(data.email)) {
      errors[2] = "Invalid email format";
    }

    if (!data.password) {
      errors[3] = "Password is required";
    } else if (data.password.length < 8) {
      errors[4] = "Password must be at least 8 characters";
    }

    if (data.password !== data.passwordConfirm) {
      errors[5] = "Passwords do not match";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <div className="err mb-3" style={{ color: "#ff3333" }}>
                    {errors[0] && <div>{errors[0]}</div>}
                  </div>

                  <CInputGroup className="">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <div className="err mb-3" style={{ color: "#ff3333" }}>
                    {errors[1] ||
                      (errors[2] && <div>{errors[1] || errors[2]}</div>)}
                  </div>
                  <CInputGroup className="">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <div className="err mb-3" style={{ color: "#ff3333" }}>
                    {errors[3] ||
                      (errors[4] && <div>{errors[3] || errors[4]}</div>)}
                  </div>
                  <CInputGroup className="">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <div className="err mb-4" style={{ color: "#ff3333" }}>
                    {errors[5] && <div>{errors[5]}</div>}
                  </div>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleSubmit}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
