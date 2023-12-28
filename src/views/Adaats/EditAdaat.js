import React from "react";

import { CFormInput, CButton } from "@coreui/react";
import axios from "axios";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function EditCategory() {
  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.catid;

  const [catName, setcatName] = useState("");
  const token = localStorage.getItem("accessToken");

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://18.118.42.224:3001/api/v1/aadat/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data.data);
      const editStudent = response.data.data;

      if (editStudent) {
        setcatName(editStudent.name);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const handleChange = async () => {
    await axios.patch(
      `http://18.118.42.224:3001/api/v1/aadat/${id}`,
      { name: catName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Successfully edited!");
    setcatName("");
  };

  return (
    <div>
      <CFormInput
        type="text"
        feedbackValid="Looks good!"
        id="val1"
        label="Adaat Name"
        required
        value={catName}
        onChange={(e) => {
          setcatName(e.target.value);
        }}
        name="schoolName"
      />
      <CButton className="btn btn-dark" onClick={handleChange}>
        submit
      </CButton>
    </div>
  );
}

export default EditCategory;
